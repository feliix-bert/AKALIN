"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomStore } from "@/stores/useRoomStore";
import { MOCK_ROOM_PRESETS } from "@/lib/mock-data";
import { RoomPreset } from "@/types";
import { Compass, Check, ArrowRight, X } from "lucide-react";

interface RoomSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export const RoomSetupDialog: React.FC<RoomSetupDialogProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const initRoom = useRoomStore((s) => s.initRoom);

  const [mounted, setMounted] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-kos-standar");
  const [name, setName] = useState("Kamar Kost Impian");
  const [type, setType] = useState("kos_standar");
  const [length, setLength] = useState<number>(3.0);
  const [width, setWidth] = useState<number>(3.0);
  const [height, setHeight] = useState<number>(2.8);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll & ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const handleSelectPreset = (preset: RoomPreset) => {
    setSelectedPresetId(preset.id);
    setName(preset.name);
    setType(preset.type);
    setLength(preset.length);
    setWidth(preset.width);
    setHeight(preset.height);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Nama ruangan tidak boleh kosong.");
      return;
    }
    if (length <= 0 || width <= 0 || height <= 0) {
      setError("Ukuran dimensi harus lebih dari 0 meter.");
      return;
    }
    if (length > 15 || width > 15) {
      setError("Ukuran ruangan maksimal 15 meter untuk visualisasi kos & kamar.");
      return;
    }
    if (height < 2.0 || height > 5.0) {
      setError("Tinggi dinding biasanya antara 2.0 hingga 5.0 meter.");
      return;
    }

    initRoom({
      name,
      type,
      length,
      width,
      height,
    });

    onProceed();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="room-setup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            key="room-setup-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 340,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-[#1A1C20] w-full max-w-xl rounded-[2rem] border border-stone-200/90 dark:border-stone-800 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#009B75] mb-1.5">
                  <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                    <Compass className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    Setup Ruang 3D Baru
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#25251F] dark:text-stone-100 tracking-tight">
                  Tentukan Dimensi Ruanganmu
                </h2>
                <p className="text-xs text-[#5E5E52] dark:text-stone-400 mt-1">
                  Pilih ukuran preset kamar kos populer atau atur dimensi kustom.
                </p>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer self-start"
                aria-label="Tutup Dialog"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Preset Buttons Grid */}
              <div>
                <label className="text-xs font-bold text-[#25251F] dark:text-stone-300 block mb-2.5">
                  Pilihan Preset Cepat
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {MOCK_ROOM_PRESETS.map((preset) => (
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                        selectedPresetId === preset.id
                          ? "border-[#009B75] bg-emerald-50/70 dark:bg-emerald-950/25 text-[#25251F] dark:text-stone-100 shadow-2xs ring-1 ring-[#009B75]"
                          : "border-stone-200/90 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{preset.name}</span>
                        {selectedPresetId === preset.id && (
                          <Check className="w-4 h-4 text-[#009B75] stroke-[2.5] shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-[#5E5E52] dark:text-stone-400 mt-0.5 line-clamp-1">
                        {preset.description}
                      </div>
                      <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 inline-block font-semibold text-stone-700 dark:text-stone-300">
                        {preset.length} × {preset.width} m (T: {preset.height}m)
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Dimension Inputs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#25251F] dark:text-stone-300">
                    Atur Dimensi Kustom (Meter)
                  </label>
                  <span className="text-[11px] text-[#5E5E52] dark:text-stone-400 font-mono">1 unit 3D = 1 meter</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[11px] text-[#5E5E52] dark:text-stone-400 font-medium block mb-0.5">Panjang (Z)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="1.5"
                        max="15"
                        value={length}
                        onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                        className="w-full text-base font-extrabold bg-transparent focus:outline-none font-mono text-[#25251F] dark:text-stone-100"
                      />
                      <span className="text-xs text-stone-400 font-bold">m</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[11px] text-[#5E5E52] dark:text-stone-400 font-medium block mb-0.5">Lebar (X)</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="1.5"
                        max="15"
                        value={width}
                        onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                        className="w-full text-base font-extrabold bg-transparent focus:outline-none font-mono text-[#25251F] dark:text-stone-100"
                      />
                      <span className="text-xs text-stone-400 font-bold">m</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
                    <span className="text-[11px] text-[#5E5E52] dark:text-stone-400 font-medium block mb-0.5">Tinggi Dinding</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="2.0"
                        max="5.0"
                        value={height}
                        onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                        className="w-full text-base font-extrabold bg-transparent focus:outline-none font-mono text-[#25251F] dark:text-stone-100"
                      />
                      <span className="text-xs text-stone-400 font-bold">m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Name */}
              <div>
                <label className="text-xs font-bold text-[#25251F] dark:text-stone-300 block mb-1.5">
                  Judul Desain Ruangan
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kamar Kost 3x3 Japandi Estetik"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200/80 dark:border-stone-700 rounded-xl focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] focus:outline-none text-[#25251F] dark:text-stone-100"
                />
              </div>

              {/* Error display */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/40">
                  {error}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#009B75] hover:bg-[#007F60] text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  <span>Buka Editor 3D</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
