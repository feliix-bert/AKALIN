import { NextRequest, NextResponse } from "next/server";

const TRIPOSR_ENDPOINT =
  process.env.TRIPOSR_ENDPOINT ?? "http://localhost:8000";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Gagal membaca form data." },
      { status: 400 }
    );
  }

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Tidak ada gambar yang diupload." },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Format tidak didukung. Gunakan JPG, PNG, atau WebP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File terlalu besar. Maksimal 10MB." },
      { status: 400 }
    );
  }

  // Forward to TripoSR inference server
  const inferenceForm = new FormData();
  inferenceForm.append("image", file);

  let inferenceRes: Response;
  try {
    inferenceRes = await fetch(`${TRIPOSR_ENDPOINT}/generate`, {
      method: "POST",
      body: inferenceForm,
      signal: AbortSignal.timeout(180_000), // 3 min timeout
    });
  } catch (err: unknown) {
    const isTimeout =
      err instanceof Error &&
      (err.name === "TimeoutError" || err.name === "AbortError");
    if (isTimeout) {
      return NextResponse.json(
        {
          error:
            "Generasi 3D melebihi batas waktu. Coba lagi atau gunakan gambar yang lebih sederhana.",
        },
        { status: 504 }
      );
    }
    console.error("[image-to-3d] Cannot reach inference server:", err);
    return NextResponse.json(
      {
        error:
          "Tidak dapat terhubung ke inference server TripoSR. Pastikan server berjalan di " +
          TRIPOSR_ENDPOINT,
      },
      { status: 503 }
    );
  }

  if (!inferenceRes.ok) {
    let detail = "Generasi model 3D gagal.";
    try {
      const body = await inferenceRes.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (typeof body?.error === "string") detail = body.error;
    } catch {
      /* ignore */
    }
    console.error("[image-to-3d] Inference server error:", inferenceRes.status, detail);
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  const glbBuffer = await inferenceRes.arrayBuffer();

  if (glbBuffer.byteLength === 0) {
    return NextResponse.json(
      { error: "Server mengembalikan file kosong." },
      { status: 502 }
    );
  }

  return new NextResponse(glbBuffer, {
    status: 200,
    headers: {
      "Content-Type": "model/gltf-binary",
      "Content-Disposition": 'attachment; filename="model.glb"',
      "Cache-Control": "no-store",
    },
  });
}

