# AKALIN — TripoSR Inference Server

Converts a furniture/room-object photo into a `.glb` 3D model that the AKALIN Room Planner can place directly in the scene.

## Requirements

- Python 3.10+
- 8 GB+ RAM (CPU mode) or NVIDIA GPU with 6 GB+ VRAM (GPU mode)

---

## Setup

### 1. Create a virtual environment

```bash
cd triposr-server
python -m venv venv

# Activate
source venv/bin/activate       # macOS / Linux
venv\Scripts\activate          # Windows
```

### 2. Install PyTorch

**CPU (slower — ~2–5 min per model):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**GPU — CUDA 12.1 (recommended — ~15–30 sec per model):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

### 3. Install remaining dependencies

```bash
pip install fastapi uvicorn[standard] python-multipart Pillow trimesh
```

### 4. Install TripoSR

```bash
pip install git+https://github.com/VAST-AI-Research/TripoSR.git
```

### 5. (Optional) Install rembg for background removal

Background removal significantly improves 3D model quality.

```bash
pip install rembg          # CPU
pip install "rembg[gpu]"   # GPU
```

### 6. Run the server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

> **First run:** The TripoSR model weights (~1.5 GB) are downloaded automatically from Hugging Face.

---

## Add to Next.js `.env.local`

```env
TRIPOSR_ENDPOINT=http://localhost:8000
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Server and model status |
| `POST` | `/generate` | Upload image → returns `.glb` |

### `/generate` request

```
Content-Type: multipart/form-data
Field: image — JPEG / PNG / WebP, max 10 MB
```

### `/generate` response

```
Content-Type: model/gltf-binary
Body: binary .glb file
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: tsr` | Run `pip install git+https://github.com/VAST-AI-Research/TripoSR.git` |
| `CUDA out of memory` | Reduce `resolution` in `main.py` from 256 to 128 |
| Slow generation | Switch from CPU to GPU PyTorch |
| No background removal | Install `rembg` for better model quality |
| Connection refused from Next.js | Ensure server is running on port 8000 and `TRIPOSR_ENDPOINT` is set in `.env.local` |

