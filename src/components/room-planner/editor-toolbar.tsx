"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/useRoomStore";
import { DataService } from "@/lib/data-service";
import {
  ArrowLeft,
  Save,
  Grid,
  Magnet,
  Camera,
  Layers,
  Sliders,
  Check,
  Eye,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import { ExportDialog } from "./export-dialog";

interface EditorToolbarProps {
  onToggleCatalog?: () => void;
  onToggleProperties?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onToggleCatalog,
  onToggleProperties,
}) => {
  const router = useRouter();

  const designId = useRoomStore((s) => s.designId);
  const roomName = useRoomStore((s) => s.roomName);
  const roomType = useRoomStore((s) => s.roomType);
  const roomLength = useRoomStore((s) => s.roomLength);
  const roomWidth = useRoomStore((s) => s.roomWidth);
  const wallHeight = useRoomStore((s) => s.wallHeight);
  const floorColor = useRoomStore((s) => s.floorColor);
  const wallColor = useRoomStore((s) => s.wallColor);
  const floorTexture = useRoomStore((s) => s.floorTexture);
  const lighting = useRoomStore((s) => s.lighting);
  const items = useRoomStore((s) => s.items);
  const collidingIds = useRoomStore((s) => s.collidingIds);

  const showGrid = useRoomStore((s) => s.showGrid);
  const toggleGrid = useRoomStore((s) => s.toggleGrid);
  const gridSnap = useRoomStore((s) => s.gridSnap);
  const toggleGridSnap = useRoomStore((s) => s.toggleGridSnap);
  const cameraView = useRoomStore((s) => s.cameraView);
  const setCameraView = useRoomStore((s) => s.setCameraView);
  const resetCamera = useRoomStore((s) => s.resetCamera);

  const hasUnsavedChanges = useRoomStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useRoomStore((s) => s.setHasUnsavedChanges);
  const isSaving = useRoomStore((s) => s.isSaving);
  const setIsSaving = useRoomStore((s) => s.setIsSaving);
  const selectItem = useRoomStore((s) => s.selectItem);

  const [title, setTitle] = useState(roomName);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await DataService.saveRoomDesign({
        id: designId || undefined,
        owner_id: "current-user", // will be auto-resolved by DataService from Supabase session
        title: title || "Desain Kamar Akalin",
        room_type: roomType,
        room_length: roomLength,
        room_width: roomWidth,
        wall_height: wallHeight,
        floor_color: floorColor,
        wall_color: wallColor,
        visibility: "public",
        scene_data: {
          items,
          lighting,
          floorTexture,
        },
      });

      setHasUnsavedChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);

      if (!designId && saved.id) {
        router.replace(`/room-planner/${saved.id}`);
      }
    } catch (err) {
      console.error("Save design failed:", err);
      alert("Gagal menyimpan desain. Silakan coba kembali.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-[#1A1C20]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/my-designs"
          className="p-2 rounded-xl text-stone-600 hover:text-[#25251F] dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="Kembali ke Desain Saya"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Beri nama desainmu..."
            className="text-xs md:text-sm font-bold bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-stone-600 focus:border-[#009B75] focus:outline-none px-1.5 py-0.5 text-[#25251F] dark:text-stone-100 max-w-[140px] md:max-w-xs transition-colors"
          />
          {hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Perubahan belum disimpan" />
          )}
        </div>
      </div>

      {/* Center: Camera & View Tools */}
      <div className="hidden sm:flex items-center gap-1.5 bg-[#FAF8F5] dark:bg-stone-900/80 p-1.5 rounded-full border border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setCameraView("perspective")}
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
            cameraView === "perspective"
              ? "bg-[#009B75] text-white shadow-sm"
              : "text-stone-600 dark:text-stone-400 hover:text-[#25251F] dark:hover:text-stone-100"
          }`}
          title="Tampilan Perspektif 3D"
        >
          3D
        </button>
        <button
          onClick={() => setCameraView("top")}
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
            cameraView === "top"
              ? "bg-[#009B75] text-white shadow-sm"
              : "text-stone-600 dark:text-stone-400 hover:text-[#25251F] dark:hover:text-stone-100"
          }`}
          title="Tampilan 2D dari Atas"
        >
          2D Atas
        </button>
        <div className="w-[1px] h-4 bg-stone-300 dark:bg-stone-700 mx-1" />
        <button
          onClick={toggleGrid}
          className={`p-1.5 rounded-full transition-colors ${
            showGrid
              ? "text-[#009B75] bg-emerald-50 dark:bg-emerald-950/40"
              : "text-stone-400 hover:text-stone-700"
          }`}
          title="Tampilkan / Sembunyikan Grid"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleGridSnap}
          className={`p-1.5 rounded-full transition-colors ${
            gridSnap
              ? "text-[#009B75] bg-emerald-50 dark:bg-emerald-950/40"
              : "text-stone-400 hover:text-stone-700"
          }`}
          title="Grid Snapping (0.05m)"
        >
          <Magnet className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetCamera}
          className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          title="Reset Sudut Kamera"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Collision feedback, Mobile Drawer toggles & Save Button */}
      <div className="flex items-center gap-2.5">
        {collidingIds.length > 0 && (
          <div
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-800/60"
            title="Terdapat perabotan yang menumpuk / bertabrakan"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Ada Tabrakan</span>
          </div>
        )}

        {/* Mobile toggles */}
        {onToggleCatalog && (
          <button
            onClick={onToggleCatalog}
            className="md:hidden p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300"
            title="Buka Katalog"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
        {onToggleProperties && (
          <button
            onClick={onToggleProperties}
            className="md:hidden p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300"
            title="Pengaturan"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}

        {/* Export / Render 3D Button */}
        <button
          onClick={() => {
            selectItem(null);
            setIsExportOpen(true);
          }}
          className="px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all bg-[#FAF8F5] dark:bg-stone-800 text-[#25251F] dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 shadow-sm"
          title="Export & Render Gambar 3D (PNG / JPG)"
        >
          <Camera className="w-3.5 h-3.5 text-[#009B75]" />
          <span className="hidden sm:inline">Export 3D</span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
            saveSuccess
              ? "bg-[#006B52] text-white"
              : "bg-[#009B75] hover:bg-[#007F60] text-white"
          }`}
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saveSuccess ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{isSaving ? "Menyimpan..." : saveSuccess ? "Tersimpan!" : "Simpan Desain"}</span>
        </button>
      </div>

      {/* Render & Export Modal Dialog */}
      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </header>
  );
};
