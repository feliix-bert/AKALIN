"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { DataService } from "@/lib/data-service";
import { FurnitureItem } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Layers,
  Search,
  Box,
  ArrowRight,
  Maximize2,
  Tag,
  Loader2,
  X,
} from "lucide-react";

const CATEGORIES = [
  { label: "Semua Perabot", value: "all" },
  { label: "Kasur & Ranjang", value: "bed" },
  { label: "Meja Kerja & Belajar", value: "desk" },
  { label: "Kursi Ergonomis", value: "chair" },
  { label: "Lemari Pakaian", value: "wardrobe" },
  { label: "Rak & Ambalan", value: "storage" },
  { label: "Sofa Santai", value: "sofa" },
  { label: "Meja Samping", value: "table" },
  { label: "Lampu Tidur", value: "lighting" },
  { label: "Karpet & Dekorasi", value: "decor" },
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
        console.error("Furniture fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFurniture();
  }, [selectedCategory]);

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Pentagram Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#25251F]/15 dark:border-stone-800 pb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2 mb-2">
              <span>02</span>
              <span className="w-8 h-[1px] bg-[#009B75]" />
              <span>KATALOG PERABOTAN FISIK</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#25251F] dark:text-white tracking-tight leading-[1.12]">
              Katalog Perabotan{" "}
              {/* "Standar 3D." — emerald serif italic + butter yellow sweep behind */}
              <span className="relative inline-block">
                <span className="relative z-10 font-editorial-serif italic font-normal text-[#009B75]">Standar 3D.</span>
                <span
                  className="absolute inset-x-0 bottom-[6%] h-[42%] rounded-sm -z-0"
                  style={{ background: "rgba(244,211,94,0.45)" }}
                />
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5E5E52] dark:text-stone-300 font-sans leading-relaxed">
              Semua modul perabot memiliki proporsi skala 1:1 meter nyata.
              Dirancang dengan material netral Japandi untuk menciptakan kenyamanan maksimal di kamar kos.
            </p>
          </div>

          <Link
            href="/room-planner"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white font-bold text-xs transition-all shadow-md active:scale-95 shrink-0"
          >
            <Box className="w-4 h-4 text-emerald-light" />
            <span>Buka Planner 3D</span>
          </Link>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5E52]" />
            <input
              type="text"
              placeholder="Cari kasur single, meja belajar, lemari 2 pintu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-full bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-[#009B75]/30 text-xs font-semibold text-[#25251F] dark:text-white placeholder:text-[#5E5E52] shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#25251F]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills (High Contrast) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                    isActive
                      ? "bg-[#009B75] text-white shadow-sm"
                      : "bg-white dark:bg-stone-900 text-[#25251F] dark:text-stone-200 border border-[#25251F]/15 dark:border-stone-700 hover:bg-[#F0EEE7]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="text-xs text-[#5E5E52]">
          Menampilkan <strong className="text-[#25251F] dark:text-white font-bold">{filteredItems.length}</strong> modul perabot siap simulasi
        </div>

        {/* Furniture Cards Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#009B75] animate-spin" />
            <span className="text-xs font-mono text-[#5E5E52]">
              Memuat katalog perabotan...
            </span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/15 text-center space-y-3 max-w-md mx-auto">
            <p className="text-base font-bold text-[#25251F] dark:text-white">
              Perabotan Tidak Ditemukan
            </p>
            <p className="text-xs text-[#5E5E52]">
              Coba ubah kata kunci atau pilih kategori perabot lain.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="px-5 py-2 rounded-full bg-[#25251F] text-white text-xs font-bold hover:bg-black transition-all"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                    <img
                      src={item.thumbnail_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-[#25251F] dark:text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs font-mono">
                        {item.category}
                      </span>
                      {item.price_estimate <= 500000 && (
                        <span className="badge-butter text-[9px] px-2 py-0.5 uppercase tracking-wider font-mono">
                          Terjangkau
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#25251F]/85 backdrop-blur-sm text-white text-[10px] font-mono font-medium">
                        {item.width} × {item.depth} × {item.height} m
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-sm text-[#25251F] dark:text-white group-hover:text-[#009B75] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#5E5E52] dark:text-stone-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#009B75] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F4D35E]" />
                      <span>Skala 1:1 • Siap disimulasikan</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="p-5 pt-0 border-t border-[#25251F]/5 dark:border-stone-800 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5E5E52] block font-mono">
                      Estimasi
                    </span>
                    <span className="text-xs sm:text-sm font-black text-[#25251F] dark:text-white font-mono">
                      {formatRupiah(item.price_estimate)}
                    </span>
                  </div>

                  <Link
                    href={`/room-planner?add=${item.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] dark:bg-stone-800 hover:bg-[#009B75] hover:text-white text-[#25251F] dark:text-white text-xs font-bold transition-all shadow-2xs active:scale-95 group/btn"
                    title="Bawa modul ini ke 3D Room Planner"
                  >
                    <Box className="w-3.5 h-3.5 text-[#009B75] group-hover/btn:text-[#F4D35E] transition-colors" />
                    <span>Coba di 3D</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
