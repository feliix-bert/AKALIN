"use client";

import React from "react";
import { useRoomStore } from "@/stores/useRoomStore";
import {
  RotateCw,
  RotateCcw,
  Copy,
  Trash2,
  X,
  Sliders,
  Sun,
  Palette,
  Maximize,
  AlertTriangle,
  Compass,
} from "lucide-react";

interface PropertiesSidebarProps {
  onCloseMobile?: () => void;
}

const FLOOR_TEXTURES = [
  { id: "wood", label: "Kayu Oak", color: "#C8A17D" },
  { id: "tiles", label: "Keramik Putih", color: "#E5E5E5" },
  { id: "concrete", label: "Semen Halus", color: "#B8B8B8" },
  { id: "carpet", label: "Karpet Krem", color: "#E8DEC8" },
] as const;

const WALL_COLORS = [
  { label: "Putih Alami", color: "#FAF8F5" },
  { label: "Warm Sand", color: "#F0EAD6" },
  { label: "Sage Grey", color: "#E0E5DF" },
  { label: "Slate Mist", color: "#E2E8F0" },
  { label: "Dusty Terracotta", color: "#F5E6E0" },
];

export const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({ onCloseMobile }) => {
  const selectedId = useRoomStore((s) => s.selectedId);
  const items = useRoomStore((s) => s.items);
  const collidingIds = useRoomStore((s) => s.collidingIds);

  const selectedItem = items.find((i) => i.instanceId === selectedId);
  const isColliding = selectedId ? collidingIds.includes(selectedId) : false;

  // Actions
  const selectItem = useRoomStore((s) => s.selectItem);
  const rotateSelectedItem = useRoomStore((s) => s.rotateSelectedItem);
  const duplicateSelectedItem = useRoomStore((s) => s.duplicateSelectedItem);
  const deleteSelectedItem = useRoomStore((s) => s.deleteSelectedItem);
  const updateItemPosition = useRoomStore((s) => s.updateItemPosition);
  const updateItemRotation = useRoomStore((s) => s.updateItemRotation);

  // Room config
  const roomLength = useRoomStore((s) => s.roomLength);
  const roomWidth = useRoomStore((s) => s.roomWidth);
  const wallHeight = useRoomStore((s) => s.wallHeight);
  const setDimensions = useRoomStore((s) => s.setDimensions);
  const floorTexture = useRoomStore((s) => s.floorTexture);
  const setFloorTexture = useRoomStore((s) => s.setFloorTexture);
  const floorColor = useRoomStore((s) => s.floorColor);
  const setFloorColor = useRoomStore((s) => s.setFloorColor);
  const wallColor = useRoomStore((s) => s.wallColor);
  const setWallColor = useRoomStore((s) => s.setWallColor);
  const lighting = useRoomStore((s) => s.lighting);
  const setLightingPreset = useRoomStore((s) => s.setLightingPreset);
  const clearScene = useRoomStore((s) => s.clearScene);

  // Current rotation in degrees for slider
  const currentRotDeg = selectedItem
    ? Math.round((((selectedItem.rotation[1] % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * (180 / Math.PI))
    : 0;

  return (
    <aside className="w-80 md:w-84 h-full bg-white dark:bg-[#1A1C20] border-l border-stone-200 dark:border-stone-800 flex flex-col z-10 shrink-0">
      {selectedItem ? (
        // ================= SELECTED ITEM CONTROLS =================
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                Perabotan Terpilih
              </span>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">
                {selectedItem.name}
              </h3>
            </div>
            <button
              onClick={() => selectItem(null)}
              className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600"
              title="Batalkan Pilihan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 flex-1">
            {/* Collision Warning */}
            {isColliding && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <div>
                  <p className="font-medium">Posisi Bertabrakan</p>
                  <p className="text-[11px] text-red-600/80 mt-0.5">
                    Objek ini menumpuk dengan perabotan lain. Geser ke area lantai yang kosong.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div>
              <label className="text-[11px] font-medium text-stone-500 mb-2 block">
                Aksi Cepat
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => rotateSelectedItem(-Math.PI / 2)}
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex flex-col items-center gap-1 text-[11px] text-stone-700 dark:text-stone-300"
                  title="Putar -90°"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>-90°</span>
                </button>
                <button
                  onClick={() => rotateSelectedItem(Math.PI / 2)}
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex flex-col items-center gap-1 text-[11px] text-stone-700 dark:text-stone-300"
                  title="Putar +90°"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>+90°</span>
                </button>
                <button
                  onClick={duplicateSelectedItem}
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex flex-col items-center gap-1 text-[11px] text-stone-700 dark:text-stone-300"
                  title="Duplikat"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplikat</span>
                </button>
                <button
                  onClick={deleteSelectedItem}
                  className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 flex flex-col items-center gap-1 text-[11px] text-red-600 dark:text-red-400"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>

            {/* Rotation Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-stone-400" /> Rotasi
                </span>
                <span className="font-mono text-stone-500">{currentRotDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={currentRotDeg}
                onChange={(e) => {
                  const rad = (parseInt(e.target.value, 10) * Math.PI) / 180;
                  updateItemRotation(selectedItem.instanceId, rad);
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Position Coordinates */}
            <div>
              <label className="text-[11px] font-medium text-stone-500 mb-2 block">
                Koordinat Posisi (meter)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 font-mono block">Sumbu X (Lebar)</span>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      step="0.05"
                      value={selectedItem.position[0].toFixed(2)}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateItemPosition(selectedItem.instanceId, [
                          val,
                          selectedItem.position[1],
                          selectedItem.position[2],
                        ]);
                      }}
                      className="w-full text-xs font-mono bg-transparent focus:outline-none text-stone-800 dark:text-stone-200"
                    />
                    <span className="text-[10px] text-stone-400">m</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 font-mono block">Sumbu Z (Panjang)</span>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      step="0.05"
                      value={selectedItem.position[2].toFixed(2)}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateItemPosition(selectedItem.instanceId, [
                          selectedItem.position[0],
                          selectedItem.position[1],
                          val,
                        ]);
                      }}
                      className="w-full text-xs font-mono bg-transparent focus:outline-none text-stone-800 dark:text-stone-200"
                    />
                    <span className="text-[10px] text-stone-400">m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensions Info */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block">
                Dimensi Fisik
              </span>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Lebar (W):</span>
                <span className="font-mono text-stone-800 dark:text-stone-200">
                  {selectedItem.dimensions[0]} meter
                </span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Panjang (D):</span>
                <span className="font-mono text-stone-800 dark:text-stone-200">
                  {selectedItem.dimensions[2]} meter
                </span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Tinggi (H):</span>
                <span className="font-mono text-stone-800 dark:text-stone-200">
                  {selectedItem.dimensions[1]} meter
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ================= ROOM SETTINGS =================
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  Pengaturan Ruangan
                </h3>
                <p className="text-[11px] text-stone-500">
                  Atur ukuran, warna lantai, & pencahayaan
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* Room Dimensions Inputs */}
            <div>
              <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-1.5">
                <Maximize className="w-3.5 h-3.5 text-stone-400" /> Ukuran Ruangan (meter)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-mono">Panjang</span>
                  <input
                    type="number"
                    min="1.5"
                    max="15"
                    step="0.1"
                    value={roomLength}
                    onChange={(e) =>
                      setDimensions(parseFloat(e.target.value) || 3.0, roomWidth, wallHeight)
                    }
                    className="w-full text-xs font-mono font-medium bg-transparent focus:outline-none mt-1 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-mono">Lebar</span>
                  <input
                    type="number"
                    min="1.5"
                    max="15"
                    step="0.1"
                    value={roomWidth}
                    onChange={(e) =>
                      setDimensions(roomLength, parseFloat(e.target.value) || 3.0, wallHeight)
                    }
                    className="w-full text-xs font-mono font-medium bg-transparent focus:outline-none mt-1 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-mono">Tinggi</span>
                  <input
                    type="number"
                    min="2.0"
                    max="5.0"
                    step="0.1"
                    value={wallHeight}
                    onChange={(e) =>
                      setDimensions(roomLength, roomWidth, parseFloat(e.target.value) || 2.8)
                    }
                    className="w-full text-xs font-mono font-medium bg-transparent focus:outline-none mt-1 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>
            </div>

            {/* Floor Material & Color */}
            <div>
              <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-stone-400" /> Material Lantai
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FLOOR_TEXTURES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setFloorTexture(t.id);
                      setFloorColor(t.color);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      floorTexture === t.id
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                        : "border-stone-200 dark:border-stone-700 hover:bg-stone-50 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-md border border-black/10 shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-xs font-medium truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Color */}
            <div>
              <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 mb-2 block">
                Warna Dinding
              </label>
              <div className="flex items-center gap-2">
                {WALL_COLORS.map((w) => (
                  <button
                    key={w.color}
                    onClick={() => setWallColor(w.color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      wallColor === w.color
                        ? "border-emerald-600 scale-110 shadow-sm"
                        : "border-stone-300 dark:border-stone-600 hover:scale-105"
                    }`}
                    style={{ backgroundColor: w.color }}
                    title={w.label}
                  />
                ))}
              </div>
            </div>

            {/* Lighting Mood */}
            <div>
              <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-stone-400" /> Suasana Cahaya
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "daylight", label: "Siang Alami" },
                  { id: "warm", label: "Warm Sunset" },
                  { id: "night", label: "Malam Redup" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLightingPreset(l.id as any)}
                    className={`py-2 px-1 text-center rounded-xl border text-[11px] font-medium transition-all ${
                      lighting.preset === l.id
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                        : "border-stone-200 dark:border-stone-700 hover:bg-stone-50 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Scene Action */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  if (confirm("Kosongkan semua perabotan dari ruangan ini?")) {
                    clearScene();
                  }
                }}
                disabled={items.length === 0}
                className="w-full py-2 px-3 text-xs text-stone-500 hover:text-red-600 border border-stone-200 dark:border-stone-800 hover:border-red-200 rounded-xl transition-colors disabled:opacity-40"
              >
                Kosongkan Ruangan ({items.length} objek)
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
