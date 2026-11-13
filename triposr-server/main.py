"""
AKALIN TripoSR Inference Server
================================
Accepts an image via POST /generate and returns a .glb 3D model file.

Usage
-----
  cd triposr-server
  python -m venv venv
  venv\\Scripts\\activate        # Windows
  pip install -r requirements.txt
  pip install git+https://github.com/VAST-AI-Research/TripoSR.git
  uvicorn main:app --host 0.0.0.0 --port 8000

The first run downloads TripoSR weights (~1.5 GB) automatically.

GPU vs CPU
----------
  GPU (NVIDIA): 15–30 seconds per model
  CPU:          2–5 minutes per model

For GPU: pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
For CPU: pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
"""

import io
import logging
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image

logger = logging.getLogger("triposr-server")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

app = FastAPI(title="AKALIN TripoSR Inference Server", version="1.0.0")

# Lazy-loaded model (avoids slow cold start if the endpoint is probed before use)
_model = None
_device = None


def _load_model():
    global _model, _device
    if _model is not None:
        return _model, _device

    try:
        import torch
        from tsr.system import TSR
    except ImportError as exc:
        raise RuntimeError(
            "TripoSR is not installed. Run:\n"
            "  pip install git+https://github.com/VAST-AI-Research/TripoSR.git"
        ) from exc

    _device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info("Loading TripoSR model on device: %s", _device)

    _model = TSR.from_pretrained(
        "stabilityai/TripoSR",
        config_name="config.yaml",
        weight_name="model.ckpt",
    )
    _model.renderer.set_chunk_size(131072)
    _model.to(_device)
    logger.info("TripoSR model loaded.")
    return _model, _device


def _remove_background(image: Image.Image) -> Image.Image:
    """Remove background with rembg when available; fall back to original."""
    try:
        from rembg import remove as rembg_remove
        result = rembg_remove(image)
        logger.info("Background removed via rembg.")
        return result
    except ImportError:
        logger.warning("rembg not installed — skipping background removal.")
        return image
    except Exception as exc:  # noqa: BLE001
        logger.warning("rembg failed (%s) — using original image.", exc)
        return image


# ── Health check ─────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "device": _device or "not_loaded_yet",
        "model_loaded": _model is not None,
    }


# ── Generation endpoint ───────────────────────────────────────────────────────

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@app.post("/generate")
async def generate_3d(image: UploadFile = File(...)):
    """
    Accept a JPG/PNG/WebP image, run TripoSR inference, and return a .glb file.
    """
    # Validate MIME type
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type: {image.content_type}. Use JPEG, PNG, or WebP.",
        )

    raw = await image.read()
    if len(raw) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image exceeds 10 MB limit.")

    # Open and preprocess
    try:
        pil_img = Image.open(io.BytesIO(raw)).convert("RGBA")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot open image: {exc}") from exc

    pil_img = pil_img.resize((512, 512), Image.LANCZOS)
    pil_img = _remove_background(pil_img)

    # Load model (lazy)
    try:
        model, device = _load_model()
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    # Run TripoSR inference
    try:
        import torch

        logger.info("Starting TripoSR inference…")
        with torch.no_grad():
            scene_codes = model([pil_img], device=device)
        logger.info("Inference complete. Extracting mesh…")

        meshes = model.extract_mesh(scene_codes, resolution=256, threshold=25.0)
    except Exception as exc:
        logger.exception("Inference failed: %s", exc)
        raise HTTPException(
            status_code=500, detail=f"3D generation failed: {exc}"
        ) from exc

    if not meshes or meshes[0] is None:
        raise HTTPException(
            status_code=500, detail="Mesh extraction returned an empty result."
        )

    # Export to GLB
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            out_path = Path(tmpdir) / "model.glb"
            meshes[0].export(str(out_path))
            glb_bytes = out_path.read_bytes()
    except Exception as exc:
        logger.exception("GLB export failed: %s", exc)
        raise HTTPException(
            status_code=500, detail=f"GLB export failed: {exc}"
        ) from exc

    logger.info("Returning .glb (%d bytes).", len(glb_bytes))
    return Response(
        content=glb_bytes,
        media_type="model/gltf-binary",
        headers={"Content-Disposition": 'attachment; filename="model.glb"'},
    )

