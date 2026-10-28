"use client";

import React, { useState } from "react";
import { useRoomStore } from "@/stores/useRoomStore";
import { MOCK_ROOM_PRESETS } from "@/lib/mock-data";
import { RoomPreset } from "@/types";
import { Sparkles, Maximize2, Compass, Check, ArrowRight } from "lucide-react";

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

  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-kos-standar");
  const [name, setName] = useState("Kamar Kost Impian");
  const [type, setType] = useState("kos_standar");
  const [length, setLength] = useState<number>(3.0);
  const [width, setWidth] = useState<number>(3.0);
  const [height, setHeight] = useState<number>(2.8);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E2126] w-full max-w-xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-elevated overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Setup Ruang 3D Baru
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Tentukan Dimensi Ruanganmu
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Pilih ukuran preset kamar kos populer atau masukkan ukuran sesuai kenyataan kamarmu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Preset Buttons Grid */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2.5">
              Pilihan Preset Cepat
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {MOCK_ROOM_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    selectedPresetId === preset.id
                      ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 text-stone-900 dark:text-stone-100 shadow-sm"
                      : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 text-stone-700 dark:text-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{preset.name}</span>
                    {selectedPresetId === preset.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                    {preset.description}
                  </div>
                  <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 inline-block text-stone-600 dark:text-stone-400">
                    {preset.length} x {preset.width} m (T: {preset.height}m)
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dimension Inputs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Atur Dimensi Kustom (Meter)
              </label>
              <span className="text-[11px] text-stone-400">1 unit 3D = 1 meter</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 block mb-1">Panjang (Z)</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="1.5"
                    max="15"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold bg-transparent focus:outline-none font-mono text-stone-900 dark:text-stone-100"
                  />
                  <span className="text-xs text-stone-400 font-medium">m</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 block mb-1">Lebar (X)</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="1.5"
                    max="15"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold bg-transparent focus:outline-none font-mono text-stone-900 dark:text-stone-100"
                  />
                  <span className="text-xs text-stone-400 font-medium">m</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 block mb-1">Tinggi Dinding</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="5.0"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold bg-transparent focus:outline-none font-mono text-stone-900 dark:text-stone-100"
                  />
                  <span className="text-xs text-stone-400 font-medium">m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Room Name */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
              Judul Desain Ruangan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kamar Kost 3x3 Japandi Estetik"
              className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-600/30 focus:outline-none text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium flex items-center gap-2 hover:bg-stone-800 shadow-sm"
            >
              <span>Buka Editor 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

