"use client";

import React, { useState } from "react";
import { FurnitureCategory, FurnitureItem } from "@/types";
import { useRoomStore } from "@/stores/useRoomStore";
import { MOCK_FURNITURE } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";
import {
  Search,
  Plus,
  Bed,
  Layers,
  Sparkles,
  Maximize2,
  SlidersHorizontal,
} from "lucide-react";

interface CatalogSidebarProps {
  onCloseMobile?: () => void;
}

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: "Semua", value: "all" },
  { label: "Kasur", value: "bed" },
  { label: "Meja", value: "desk" },
  { label: "Kursi", value: "chair" },
  { label: "Lemari", value: "wardrobe" },
  { label: "Rak & Simpan", value: "storage" },
  { label: "Sofa", value: "sofa" },
  { label: "Meja Samping", value: "table" },
  { label: "Lampu", value: "lighting" },
  { label: "Karpet", value: "decor" },
];

export const CatalogSidebar: React.FC<CatalogSidebarProps> = ({ onCloseMobile }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const startPlacing = useRoomStore((s) => s.startPlacing);
  const isPlacingNew = useRoomStore((s) => s.isPlacingNew);
  const itemToPlace = useRoomStore((s) => s.itemToPlace);

  const filteredItems = MOCK_FURNITURE.filter((item) => {
    const matchesCat =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddItem = (item: FurnitureItem) => {
    startPlacing(item);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-80 md:w-88 h-full bg-white dark:bg-[#1A1C20] border-r border-stone-200 dark:border-stone-800 flex flex-col z-10 shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
              Katalog Perabotan
            </h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">
            {filteredItems.length} item
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari kasur, meja, lemari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-stone-800 dark:text-stone-200"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Placing Indicator Banner */}
      {isPlacingNew && itemToPlace && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800/50 p-2.5 px-4 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Klik lantai 3D untuk meletakkan <strong>{itemToPlace.name}</strong></span>
          </div>
        </div>
      )}

      {/* Catalog Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            Tidak ada perabotan yang cocok dengan pencarian.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="group p-2.5 rounded-2xl bg-stone-50/70 dark:bg-stone-900/40 hover:bg-stone-100/90 dark:hover:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 transition-all flex gap-3 items-center"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 relative shrink-0">
                <img
                  src={item.thumbnail_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-stone-500">
                  <span className="font-mono bg-stone-200/60 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                    {item.width} x {item.depth} m
                  </span>
                  <span>•</span>
                  <span>T: {item.height}m</span>
                </div>
                <div className="mt-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  {formatRupiah(item.price_estimate)}
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleAddItem(item)}
                className="p-2 rounded-xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-colors shrink-0 text-stone-700 dark:text-stone-200"
                title="Tambahkan ke Ruang 3D"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

