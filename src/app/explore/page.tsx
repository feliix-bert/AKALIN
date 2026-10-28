"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { Category, Inspiration } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Heart,
  Compass,
  ArrowUpDown,
  Sparkles,
  PlusCircle,
  Loader2,
} from "lucide-react";

export default function ExplorePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
        console.error(err);
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

      // Budget filter
      let matchBudget = true;
      if (budgetRange === "low") {
        matchBudget = item.estimated_budget <= 1000000;
      } else if (budgetRange === "medium") {
        matchBudget =
          item.estimated_budget > 1000000 && item.estimated_budget <= 2500000;
      } else if (budgetRange === "high") {
        matchBudget = item.estimated_budget > 2500000;
      }

      return matchCat && matchSearch && matchBudget;
    });
  }, [inspirations, selectedCategory, searchTerm, budgetRange]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
            <Compass className="w-3.5 h-3.5" />
            Galeri Inspirasi Ruangan
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Eksplorasi Ide Kamar Kos & Ruang Sempit
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Temukan layout cerdas, kombinasi warna, dan rincian budget penataan kamar praktis.
          </p>
        </div>

        <Link
          href="/ideas/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-xs hover:bg-stone-800 shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-700" />
          <span>Bagikan Ide Kamarmu</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari ide kasur, meja belajar, rak ambalan, gaya minimalis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 text-xs text-stone-900 dark:text-stone-100 shadow-subtle"
            />
          </div>

          {/* Budget Range Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 p-1 rounded-2xl text-xs shadow-subtle shrink-0">
            {[
              { id: "all", label: "Semua Budget" },
              { id: "low", label: "< 1 Juta" },
              { id: "medium", label: "1 - 2.5 Juta" },
              { id: "high", label: "> 2.5 Juta" },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setBudgetRange(b.id as any)}
                className={`px-3 py-2 rounded-xl font-medium transition-colors ${
                  budgetRange === b.id
                    ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 px-3 py-1.5 rounded-2xl text-xs shadow-subtle shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="popular">Paling Populer</option>
            </select>
          </div>
        </div>

        {/* Pinterest-like Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all shadow-subtle ${
              selectedCategory === "all"
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-[#1E2126] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50"
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all shadow-subtle ${
                selectedCategory === cat.slug
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-[#1E2126] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Inspiration Cards */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-xs text-stone-500">Memuat galeri inspirasi...</p>
        </div>
      ) : filteredInspirations.length === 0 ? (
        <div className="py-20 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 text-center space-y-3">
          <p className="text-stone-700 dark:text-stone-300 font-semibold text-sm">
            Tidak ada inspirasi yang sesuai filter kamu.
          </p>
          <p className="text-xs text-stone-500">
            Coba ubah kata kunci pencarian atau bersihkan filter budget.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setBudgetRange("all");
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInspirations.map((ins) => {
            const isSaved = savedIds.includes(ins.id);
            return (
              <div
                key={ins.id}
                className="group rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={ins.cover_image_url}
                    alt={ins.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Chip */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-[10px] font-medium">
                    {ins.category?.name || "Kamar Kos"}
                  </div>
                  {/* Save Bookmark */}
                  <button
                    onClick={(e) => handleToggleSave(ins.id, e)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-90 ${
                      isSaved
                        ? "bg-rose-500 text-white"
                        : "bg-white/85 dark:bg-stone-900/85 text-stone-700 dark:text-stone-200 hover:bg-white"
                    }`}
                    title={isSaved ? "Tersimpan" : "Simpan Ide Ini"}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {ins.title}
                    </h2>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {ins.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-mono">
                        Perkiraan Budget
                      </span>
                      <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                        {formatRupiah(ins.estimated_budget)}
                      </span>
                    </div>

                    <Link
                      href={`/ideas/${ins.id}`}
                      className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 text-xs font-semibold transition-colors"
                    >
                      Buka Rincian
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
