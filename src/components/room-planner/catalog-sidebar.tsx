"use client";

import React, { useState } from "react";
import { FurnitureCategory, FurnitureItem } from "@/types";
import { useRoomStore } from "@/stores/useRoomStore";
import { MOCK_FURNITURE } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";
import { ImageTo3DPanel } from "./image-to-3d-panel";
import {
  Search,
  Plus,
  Layers,
  Sparkles,
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
  const [activeTab, setActiveTab] = useState<"catalog" | "image-to-3d">("catalog");

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
      <div className="p-4 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#009B75]">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-[#25251F] dark:text-stone-100 text-sm">
              Katalog Perabotan
            </h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono font-medium">
            {filteredItems.length} item
          </span>
        </div>

        {/* Tab switcher: Katalog | Foto → 3D */}
        <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-900 rounded-xl mb-3">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              activeTab === "catalog"
                ? "bg-white dark:bg-stone-800 text-[#25251F] dark:text-stone-100 shadow-sm"
                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
            }`}
          >
            <Layers className="w-3 h-3" />
            Katalog
          </button>
          <button
            onClick={() => setActiveTab("image-to-3d")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              activeTab === "image-to-3d"
                ? "bg-white dark:bg-stone-800 text-[#25251F] dark:text-stone-100 shadow-sm"
                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#F4D35E]" />
            Foto → 3D
          </button>
        </div>

        {/* Only show search + category pills on catalog tab */}
        {activeTab === "catalog" && (
          <>
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari kasur, meja, lemari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
              />
            </div>

            {/* Categories Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-[#009B75] text-white shadow-sm"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Placing Indicator Banner (catalog tab only) */}
      {activeTab === "catalog" && isPlacingNew && itemToPlace && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800/50 p-2.5 px-4 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#009B75] animate-ping" />
            <span>Klik lantai 3D untuk meletakkan <strong>{itemToPlace.name}</strong></span>
          </div>
        </div>
      )}

      {/* Panel body */}
      {activeTab === "image-to-3d" ? (
        <div className="flex-1 overflow-y-auto">
          <ImageTo3DPanel />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              Tidak ada perabotan yang cocok dengan pencarian.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-900/40 hover:bg-stone-100 dark:hover:bg-stone-800/60 border border-stone-200 dark:border-stone-800 transition-all flex gap-3 items-center"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 relative shrink-0 border border-stone-200 dark:border-stone-700">
                  <img
                    src={item.thumbnail_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#25251F] dark:text-stone-100 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-stone-600 dark:text-stone-400">
                    <span className="font-mono bg-stone-200/70 dark:bg-stone-800 px-1.5 py-0.5 rounded font-medium">
                      {item.width} × {item.depth} m
                    </span>
                    <span>•</span>
                    <span>T: {item.height}m</span>
                  </div>
                  <div className="mt-1 text-xs font-bold text-[#009B75] dark:text-[#009B75]">
                    {formatRupiah(item.price_estimate)}
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => handleAddItem(item)}
                  className="p-2.5 rounded-xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700 text-[#009B75] hover:bg-[#009B75] hover:text-white transition-colors shrink-0"
                  title="Tambahkan ke Ruang 3D"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
};
