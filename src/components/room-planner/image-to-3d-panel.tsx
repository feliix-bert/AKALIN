"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  Upload,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Plus,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import { useRoomStore } from "@/stores/useRoomStore";

type GenerationState = "idle" | "generating" | "success" | "error";

export const ImageTo3DPanel: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generationState, setGenerationState] =
    useState<GenerationState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedGlbUrl, setGeneratedGlbUrl] = useState<string | null>(null);
  const [modelName, setModelName] = useState("Objek Kustom");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addGeneratedModel = useRoomStore((s) => s.addGeneratedModel);

  // ── File selection ───────────────────────────────────────────────────────
  const applyFile = useCallback(
    (file: File) => {
      const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
      if (!ALLOWED.includes(file.type)) {
        setErrorMessage("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File terlalu besar. Maksimal 10MB.");
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGenerationState("idle");
      setErrorMessage(null);
      setGeneratedGlbUrl(null);
      setModelName(file.name.replace(/\.[^/.]+$/, "") || "Objek Kustom");
    },
    [previewUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) applyFile(file);
    },
    [applyFile]
  );

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (generatedGlbUrl) URL.revokeObjectURL(generatedGlbUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setGenerationState("idle");
    setErrorMessage(null);
    setGeneratedGlbUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Generation ───────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!selectedFile) return;
    setGenerationState("generating");
    setErrorMessage(null);

    try {
      const form = new FormData();
      form.append("image", selectedFile);

      const res = await fetch("/api/image-to-3d", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data?.error === "string" ? data.error : "Generasi gagal."
        );
      }

      const blob = await res.blob();
      if (generatedGlbUrl) URL.revokeObjectURL(generatedGlbUrl);
      setGeneratedGlbUrl(URL.createObjectURL(blob));
      setGenerationState("success");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui."
      );
      setGenerationState("error");
    }
  };

  // ── Add to room ──────────────────────────────────────────────────────────
  const handleAddToRoom = () => {
    if (!generatedGlbUrl) return;
    addGeneratedModel({
      name: modelName || "Objek Kustom",
      modelUrl: generatedGlbUrl,
      dimensions: [0.5, 0.5, 0.5], // 50 cm default — user can resize in Properties panel
    });
    handleRemove();
  };

  const isGenerating = generationState === "generating";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-3 space-y-3">
      {/* Panel header */}
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-[#F4D35E]/20 text-[#D6B033]">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-xs font-bold text-[#25251F] dark:text-stone-100">
            Foto → 3D
          </h3>
          <p className="text-[10px] text-stone-500 leading-tight">
            Upload foto perabot, jadikan model 3D
          </p>
        </div>
      </div>

      {/* Upload zone */}
      {!previewUrl ? (
        <div
          className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-5 text-center cursor-pointer hover:border-[#009B75] hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-stone-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#25251F] dark:text-stone-200">
                Pilih atau seret foto
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">
                JPG · PNG · WebP — maks. 10 MB
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] px-3 py-1 bg-[#009B75] text-white rounded-full font-semibold">
              <Upload className="w-3 h-3" />
              Pilih File
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) applyFile(f);
            }}
          />
        </div>
      ) : (
        <div className="space-y-2">
          {/* Image preview */}
          <div className="relative rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 aspect-square border border-stone-200 dark:border-stone-800">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              title="Hapus foto"
            >
              <X className="w-3 h-3" />
            </button>
            {generationState === "success" && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                <CheckCircle className="w-2.5 h-2.5" />
                Model siap
              </div>
            )}
          </div>

          {/* Model name input */}
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Nama objek..."
            className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
          />
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-red-700 dark:text-red-300 leading-snug">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Success */}
      {generationState === "success" && !errorMessage && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-emerald-800 dark:text-emerald-200 leading-snug">
            Model 3D berhasil dibuat. Tambahkan ke ruangan untuk mulai menata.
          </p>
        </div>
      )}

      {/* Action buttons */}
      {previewUrl && (
        <div className="space-y-1.5">
          {generationState !== "success" ? (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25251F] dark:bg-stone-700 text-white text-xs font-bold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses… (1–3 menit)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#F4D35E]" />
                  <span>Generate Model 3D</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleAddToRoom}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#009B75] text-white text-xs font-bold hover:bg-[#007F60] transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambahkan ke Ruangan</span>
              </button>
              <button
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-semibold hover:bg-stone-200 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerasi ulang</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Info note */}
      <div className="p-2.5 rounded-xl bg-[#F4D35E]/10 border border-[#F4D35E]/30">
        <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-snug">
          <span className="font-bold text-[#25251F] dark:text-stone-200">
            ⚡ Butuh server TripoSR
          </span>{" "}
          yang berjalan di{" "}
          <code className="font-mono bg-stone-200/70 dark:bg-stone-700 px-0.5 rounded">
            localhost:8000
          </code>
          . Lihat{" "}
          <code className="font-mono">triposr-server/README.md</code> untuk
          panduan setup.
        </p>
      </div>
    </div>
  );
};

