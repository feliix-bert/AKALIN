"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { FurnitureItem } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Layers,
  Search,
  Box,
  ArrowRight,
  Sparkles,
  Maximize2,
  Tag,
} from "lucide-react";

const CATEGORIES = [
  { label: "Semua", value: "all" },
  { label: "Kasur & Ranjang", value: "bed" },
  { label: "Meja Kerja", value: "desk" },
  { label: "Kursi", value: "chair" },
  { label: "Lemari Pakaian", value: "wardrobe" },
  { label: "Rak & Kabinet", value: "storage" },
  { label: "Sofa Santai", value: "sofa" },
  { label: "Meja Samping", value: "table" },
  { label: "Lampu", value: "lighting" },
  { label: "Dekorasi & Karpet", value: "decor" },
];

export default function FurnitureCatalogPage() {
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFurniture() {
      setLoading(true);
      try {
        const data = await DataService.getFurnitureItems(
          selectedCategory === "all" ? undefined : selectedCategory
        );
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFurniture();
  }, [selectedCategory]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5" />
            Katalog Perabotan 3D
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Perabotan Standar Kamar Kos & Ruang Sempit
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Semua perabotan memiliki skala dimensi fisik 1:1 meter dan siap disimulasikan dalam 3D Room Planner.
          </p>
        </div>

        <Link
          href="/room-planner"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 shadow-sm shrink-0"
        >
          <Box className="w-4 h-4" />
          <span>Buka 3D Room Planner</span>
        </Link>
      </div>

      {/* Search & Categories Bar */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari kasur, kursi ergonomis, lemari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-xs text-stone-900 dark:text-stone-100 shadow-subtle"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all shadow-subtle ${
                selectedCategory === cat.value
                  ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                  : "bg-white dark:bg-[#1E2126] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Furniture Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">
          Memuat katalog perabotan...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 text-center space-y-2">
          <p className="text-stone-700 font-semibold text-sm">Perabotan tidak ditemukan.</p>
          <p className="text-xs text-stone-500">Coba ubah kata kunci atau pilih kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                  <img
                    src={item.thumbnail_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-[10px] font-mono">
                    3D Mesh Ready
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Dimensions Chip */}
                  <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-300 flex items-center justify-between">
                    <span>Dimensi (PxLxT):</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {item.width} x {item.depth} x {item.height} m
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Price & Action */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono">Est. Harga</span>
                    <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                      {formatRupiah(item.price_estimate)}
                    </span>
                  </div>

                  <Link
                    href="/room-planner"
                    className="px-3.5 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[11px] font-semibold hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Coba di 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
