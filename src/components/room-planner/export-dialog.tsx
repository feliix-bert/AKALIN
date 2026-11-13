"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Settings2,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { useRoomStore } from "@/stores/useRoomStore";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
  const roomName = useRoomStore((s) => s.roomName);
  const roomLength = useRoomStore((s) => s.roomLength);
  const roomWidth = useRoomStore((s) => s.roomWidth);
  const wallHeight = useRoomStore((s) => s.wallHeight);
  const items = useRoomStore((s) => s.items);

  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileSizeKB, setFileSizeKB] = useState<number | null>(null);

  // Capture canvas image with optional post-processing watermark
  const generateSnapshot = () => {
    setIsProcessing(true);
    try {
      // Find the actual WebGL canvas element with robust fallbacks
      let rawCanvas: HTMLCanvasElement | null = null;
      const elById = document.getElementById("room-planner-webgl-canvas");
      if (elById instanceof HTMLCanvasElement) {
        rawCanvas = elById;
      } else {
        const queryCandidate =
          document.querySelector("canvas.room-planner-webgl-canvas") ||
          document.querySelector(".canvas-container canvas") ||
          document.querySelector("canvas");
        if (queryCandidate instanceof HTMLCanvasElement) {
          rawCanvas = queryCandidate;
        }
      }

      if (!rawCanvas || rawCanvas.width === 0 || rawCanvas.height === 0) {
        console.warn("WebGL canvas not ready yet for snapshot");
        setIsProcessing(false);
        return;
      }

      // Create an offscreen canvas to composite the watermark & ensure correct sizing
      const offscreen = document.createElement("canvas");
      offscreen.width = rawCanvas.width;
      offscreen.height = rawCanvas.height;
      const ctx = offscreen.getContext("2d");

      if (!ctx) {
        // Fallback: directly use WebGL canvas data URL if 2D context fails
        const mimeType = format === "png" ? "image/png" : "image/jpeg";
        const quality = format === "jpeg" ? 0.92 : undefined;
        setPreviewDataUrl(rawCanvas.toDataURL(mimeType, quality));
        setIsProcessing(false);
        return;
      }

      // 1. Draw base 3D scene from WebGL
      ctx.drawImage(rawCanvas, 0, 0);

      // 2. Optionally draw architectural title badge / watermark
      if (includeWatermark) {
        const padding = 28;
        const bannerHeight = 72;
        const bannerY = offscreen.height - bannerHeight - padding;
        const bannerWidth = Math.min(offscreen.width - padding * 2, 580);
        const bannerX = padding;

        // Semi-transparent rounded background card
        ctx.save();
        ctx.fillStyle = "rgba(25, 26, 24, 0.88)";
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 4;

        const r = 16;
        ctx.beginPath();
        ctx.moveTo(bannerX + r, bannerY);
        ctx.lineTo(bannerX + bannerWidth - r, bannerY);
        ctx.quadraticCurveTo(bannerX + bannerWidth, bannerY, bannerX + bannerWidth, bannerY + r);
        ctx.lineTo(bannerX + bannerWidth, bannerY + bannerHeight - r);
        ctx.quadraticCurveTo(bannerX + bannerWidth, bannerY + bannerHeight, bannerX + bannerWidth - r, bannerY + bannerHeight);
        ctx.lineTo(bannerX + r, bannerY + bannerHeight);
        ctx.quadraticCurveTo(bannerX, bannerY + bannerHeight, bannerX, bannerY + bannerHeight - r);
        ctx.lineTo(bannerX, bannerY + r);
        ctx.quadraticCurveTo(bannerX, bannerY, bannerX + r, bannerY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Brand & Title Text
        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 18px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillText(roomName || "Desain Kamar Kos", bannerX + 20, bannerY + 30);

        // Subtitle / Specs in Emerald & Warm Gray
        ctx.font = "normal 13px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = "#F4D35E"; // Butter Yellow accent for brand name
        ctx.fillText("AKALIN", bannerX + 20, bannerY + 54);

        ctx.fillStyle = "#D1D5DB";
        const specsText = ` • ${roomWidth.toFixed(1)}m × ${roomLength.toFixed(1)}m (T: ${wallHeight.toFixed(1)}m) • ${items.length} perabot`;
        ctx.fillText(specsText, bannerX + 70, bannerY + 54);
        ctx.restore();
      }

      // 3. Export to target format
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const quality = format === "jpeg" ? 0.92 : undefined;
      const dataUrl = offscreen.toDataURL(mimeType, quality);

      setPreviewDataUrl(dataUrl);

      // Estimate file size in KB
      const base64Str = dataUrl.split(",")[1] || "";
      const approxBytes = Math.round((base64Str.length * 3) / 4);
      setFileSizeKB(Math.round(approxBytes / 1024));
    } catch (err) {
      console.error("Failed to render snapshot:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-capture whenever dialog opens, format changes, or watermark toggle changes
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow render loop to stabilize
      const timer = setTimeout(() => {
        generateSnapshot();
      }, 80);
      return () => clearTimeout(timer);
    } else {
      setPreviewDataUrl(null);
      setCopied(false);
    }
  }, [isOpen, format, includeWatermark]);

  const handleDownload = () => {
    if (!previewDataUrl) return;
    const sanitizedTitle = (roomName || "desain-kamar")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-");
    const filename = `AKALIN-${sanitizedTitle}-${Date.now()}.${format === "png" ? "png" : "jpg"}`;

    const link = document.createElement("a");
    link.href = previewDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = async () => {
    if (!previewDataUrl) return;
    try {
      const res = await fetch(previewDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard write failed:", err);
      alert("Gagal menyalin gambar ke clipboard browser.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1A1C20] border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#009B75]">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-[#25251F] dark:text-stone-100 text-base leading-tight">
                Export & Render Gambar 3D
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Simpan tangkapan sudut kamera saat ini dalam format resolusi tinggi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Image Preview Box */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 aspect-video flex items-center justify-center">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Render Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-6 space-y-2 text-stone-400">
                <ImageIcon className="w-8 h-8 mx-auto animate-pulse" />
                <p className="text-xs font-medium">Memproses render visual 3D...</p>
              </div>
            )}

            {previewDataUrl && (
              <button
                type="button"
                onClick={generateSnapshot}
                disabled={isProcessing}
                className="absolute top-3 right-3 py-1 px-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 transition-all"
                title="Render Ulang Tangkapan Kamera"
              >
                <RefreshCw className={`w-3 h-3 ${isProcessing ? "animate-spin" : ""}`} />
                <span>Segarkan</span>
              </button>
            )}

            {fileSizeKB && (
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-semibold">
                {fileSizeKB} KB • {format.toUpperCase()}
              </span>
            )}
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Format Selection */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
              <label className="text-xs font-bold text-[#25251F] dark:text-stone-200 flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-[#009B75]" />
                Format File
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("png")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    format === "png"
                      ? "bg-[#009B75] text-white shadow-sm"
                      : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                  }`}
                >
                  PNG (Jernih)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("jpeg")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    format === "jpeg"
                      ? "bg-[#009B75] text-white shadow-sm"
                      : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                  }`}
                >
                  JPG (Foto)
                </button>
              </div>
            </div>

            {/* Watermark Toggle */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-[#25251F] dark:text-stone-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4D35E]" />
                  Badge Info Editorial
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                  Sertakan label judul, dimensi kamar, dan logo AKALIN
                </p>
              </div>
              <input
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="w-4 h-4 rounded text-[#009B75] focus:ring-[#009B75] border-stone-300 dark:border-stone-700 accent-[#009B75] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Tutup
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyToClipboard}
              disabled={!previewDataUrl || isProcessing}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Gambar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!previewDataUrl || isProcessing}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#009B75] hover:bg-[#007F60] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Unduh {format.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

