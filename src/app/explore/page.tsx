"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { DataService } from "@/lib/data-service";
import { Category, Inspiration } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  Heart,
  Compass,
  ArrowUpDown,
  PlusCircle,
  Loader2,
  Box,
  ArrowRight,
  X,
  Maximize2,
} from "lucide-react";

export default function ExplorePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [roomSizeFilter, setRoomSizeFilter] = useState<"all" | "3x3" | "3x4" | "studio">("all");
  const [budgetRange, setBudgetRange] = useState<"all" | "low" | "medium" | "high">("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, ins, saved] = await Promise.all([
          DataService.getCategories(),
          DataService.getInspirations({ sortBy }),
          DataService.getSavedInspirationIds(),
        ]);
        setCategories(cats);
        setInspirations(ins);
        setSavedIds(saved);
      } catch (err) {
        console.error("Explore fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sortBy]);

  // Client-side filtering
  const filteredInspirations = useMemo(() => {
    return inspirations.filter((item) => {
      // Category match
      const matchCat =
        selectedCategory === "all" ||
        item.category?.slug === selectedCategory ||
        item.category_id === selectedCategory;

      // Search match
      const query = searchTerm.toLowerCase();
      const matchSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category?.name.toLowerCase().includes(query);

      // Dimension filter
      const length = item.room_length ?? 3.0;
      const width = item.room_width ?? 3.0;
      let matchSize = true;
      if (roomSizeFilter === "3x3") {
        matchSize = (length <= 3 && width <= 3) || item.title.includes("3x3");
      } else if (roomSizeFilter === "3x4") {
        matchSize = (length >= 3.5 || width >= 3.5) || item.title.includes("4x3") || item.title.includes("3x4");
      } else if (roomSizeFilter === "studio") {
        matchSize = length >= 4 || item.title.toLowerCase().includes("studio");
      }

      // Budget filter
      let matchBudget = true;
      if (budgetRange === "low") {
        matchBudget = item.estimated_budget <= 1500000;
      } else if (budgetRange === "medium") {
        matchBudget =
          item.estimated_budget > 1500000 && item.estimated_budget <= 2500000;
      } else if (budgetRange === "high") {
        matchBudget = item.estimated_budget > 2500000;
      }

      return matchCat && matchSearch && matchSize && matchBudget;
    });
  }, [inspirations, selectedCategory, searchTerm, roomSizeFilter, budgetRange]);

  const handleToggleSave = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = await DataService.toggleSaveInspiration(id);
    if (isSaved) {
      setSavedIds((prev) => [...prev, id]);
    } else {
      setSavedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (roomSizeFilter !== "all" ? 1 : 0) +
    (budgetRange !== "all" ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("all");
    setRoomSizeFilter("all");
    setBudgetRange("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Pentagram Header (Matching User References) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#25251F]/15 dark:border-stone-800 pb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2 mb-2">
              <span>01</span>
              <span className="w-8 h-[1px] bg-[#009B75]" />
              <span>GALERI INSPIRASI</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#25251F] dark:text-white tracking-tight leading-[1.12]">
              Jelajahi Inspirasi{" "}
              {/* "Kamar." — emerald serif italic + butter yellow sweep behind */}
              <span className="relative inline-block">
                <span className="relative z-10 font-editorial-serif italic font-normal text-[#009B75]">Kamar.</span>
                <span
                  className="absolute inset-x-0 bottom-[6%] h-[42%] rounded-sm -z-0"
                  style={{ background: "rgba(244,211,94,0.45)" }}
                />
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5E5E52] dark:text-stone-300 font-sans leading-relaxed">
              Kumpulan denah cerdas dan tata letak kamar kos dengan rincian perabot fisik skala 1:1,
              panduan pencahayaan, serta estimasi budget transparan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/room-planner"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <Box className="w-4 h-4 text-emerald-light" />
              <span>Buka Planner 3D</span>
            </Link>
            <Link
              href="/ideas/new"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white dark:bg-stone-800 border border-[#25251F]/15 text-[#25251F] dark:text-white text-xs font-bold hover:bg-[#F0EEE7] transition-all shadow-2xs active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#009B75]" />
              <span>Bagikan Ide</span>
            </Link>
          </div>
        </div>

        {/* Airbnb-style Segmented Search & Filter Capsule */}
        <div className="bg-white dark:bg-stone-900 rounded-full border border-[#25251F]/15 dark:border-stone-800 shadow-md p-2 flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-5xl mx-auto">
          {/* Search Box */}
          <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800">
            <Search className="w-4 h-4 text-[#5E5E52] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Cari gaya Japandi, ranjang sudut, meja dekat jendela..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-semibold bg-transparent outline-none text-[#25251F] dark:text-white placeholder:text-[#5E5E52]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-1 text-stone-400 hover:text-[#25251F]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dimension Dropdown */}
          <div className="flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 gap-2">
            <span className="text-[11px] font-bold text-[#5E5E52] uppercase font-mono">
              Ukuran:
            </span>
            <select
              value={roomSizeFilter}
              onChange={(e) => setRoomSizeFilter(e.target.value as any)}
              className="text-xs font-bold text-[#25251F] dark:text-stone-200 bg-transparent outline-none cursor-pointer"
            >
              <option value="all">Semua Ukuran</option>
              <option value="3x3">3.0 × 3.0 m (Standar)</option>
              <option value="3x4">3.0 × 4.0 m (Lega)</option>
              <option value="studio">Studio 4.0 × 5.0 m</option>
            </select>
          </div>

          {/* Budget Dropdown */}
          <div className="flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 gap-2">
            <span className="text-[11px] font-bold text-[#5E5E52] uppercase font-mono">
              Budget:
            </span>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value as any)}
              className="text-xs font-bold text-[#25251F] dark:text-stone-200 bg-transparent outline-none cursor-pointer"
            >
              <option value="all">Semua Budget</option>
              <option value="low">&lt; Rp 1,5 Juta</option>
              <option value="medium">Rp 1,5 - 2,5 Juta</option>
              <option value="high">&gt; Rp 2,5 Juta</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center px-4 py-2 gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5E5E52]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-[#25251F] dark:text-stone-200 bg-transparent outline-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="popular">Paling Populer</option>
            </select>
          </div>
        </div>

        {/* Category Pills (High Contrast & Clear Active State) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
              selectedCategory === "all"
                ? "bg-[#009B75] text-white shadow-sm"
                : "bg-white dark:bg-stone-900 text-[#25251F] dark:text-stone-200 border border-[#25251F]/15 dark:border-stone-700 hover:bg-[#F0EEE7]"
            }`}
          >
            Semua Gaya
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                selectedCategory === cat.slug
                  ? "bg-[#009B75] text-white shadow-sm"
                  : "bg-white dark:bg-stone-900 text-[#25251F] dark:text-stone-200 border border-[#25251F]/15 dark:border-stone-700 hover:bg-[#F0EEE7]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-[#5E5E52]">
          <div>
            Menampilkan{" "}
            <strong className="text-[#25251F] dark:text-white font-bold">
              {filteredInspirations.length}
            </strong>{" "}
            ide ruangan
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-3 text-[#009B75] font-bold underline hover:text-[#006B52]"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#009B75] animate-spin" />
            <span className="text-xs font-mono text-[#5E5E52]">
              Memuat kurasi ruangan...
            </span>
          </div>
        ) : filteredInspirations.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white border border-[#25251F]/15 flex items-center justify-center mx-auto text-[#5E5E52]">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#25251F] dark:text-white">
              Tidak Ada Inspirasi yang Cocok
            </h3>
            <p className="text-xs text-[#5E5E52]">
              Coba sesuaikan kata kunci atau bersihkan filter ukuran dan budget.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-[#25251F] text-white text-xs font-bold hover:bg-black transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInspirations.map((item) => {
              const isSaved = savedIds.includes(item.id);
              const isLiked = likedIds.includes(item.id);
              const length = item.room_length ?? 3.0;
              const width = item.room_width ?? 3.0;

              return (
                <div
                  key={item.id}
                  className="group rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={item.cover_image_url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badges & Actions */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-[#25251F] dark:text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                            {item.category?.name || "Kamar Kos"}
                          </span>
                          {item.estimated_budget <= 1500000 && (
                            <span className="badge-butter text-[10px] px-2.5 py-0.5 uppercase tracking-wider font-mono">
                              Hemat
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleToggleLike(item.id, e)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                              isLiked
                                ? "bg-rose-500 text-white shadow-md"
                                : "bg-white/80 hover:bg-white text-[#25251F] shadow-2xs"
                            }`}
                            aria-label="Sukai Ide"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleToggleSave(item.id, e)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                              isSaved
                                ? "bg-[#009B75] text-[#F4D35E] shadow-md"
                                : "bg-white/80 hover:bg-white text-[#25251F] shadow-2xs"
                            }`}
                            aria-label="Simpan Ide"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-[#F4D35E]" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Dimension Pill Overlay */}
                      <div className="absolute bottom-3 left-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#25251F]/85 backdrop-blur-sm text-white text-[10px] font-mono font-medium">
                          {length.toFixed(1)} × {width.toFixed(1)} m
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-bold text-[#25251F] dark:text-white group-hover:text-[#009B75] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#5E5E52] dark:text-stone-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-2 text-xs font-mono font-bold text-[#009B75]">
                        Estimasi Biaya: {formatRupiah(item.estimated_budget)}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-[#25251F]/5 dark:border-stone-800 mt-2">
                    <Link
                      href={`/ideas/${item.id}`}
                      className="text-xs font-bold text-[#25251F] dark:text-stone-200 hover:text-[#009B75] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Lihat Rincian</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/room-planner?preset=${length <= 3 ? "3x3" : "3x4"}&title=${encodeURIComponent(item.title)}`}
                      className="px-4 py-2 rounded-full bg-[#FAF8F5] dark:bg-stone-800 hover:bg-[#009B75] hover:text-white text-xs font-bold text-[#25251F] dark:text-white flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Buka di 3D</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
