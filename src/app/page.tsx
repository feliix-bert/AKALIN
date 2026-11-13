"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Compass,
  ArrowRight,
  Maximize2,
  Sliders,
  Sparkles,
  CheckCircle2,
  Layers,
  Heart,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  RotateCw,
  Sun,
  Grid,
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { Category, Inspiration } from "@/types";
import { formatRupiah } from "@/lib/utils";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<"3x3" | "3x4" | "studio">("3x3");

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, ins, saved] = await Promise.all([
          DataService.getCategories(),
          DataService.getInspirations({ sortBy: "popular" }),
          DataService.getSavedInspirationIds(),
        ]);
        setCategories(cats);
        setInspirations(ins.slice(0, 6));
        setSavedIds(saved);
      } catch (err) {
        console.error("Load home data error:", err);
      }
    }
    loadData();
  }, []);

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
    <div className="flex flex-col gap-20 sm:gap-28 pb-24 overflow-x-hidden bg-[#FAF8F5]">
      {/* ========================================================================= */}
      {/* 01. HERO SECTION (Inspired by Image 1 "Arcdev" & Image 3 "DNOIN.INC")       */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography & Dual Action Pills */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Main Headline: Charcoal + Emerald + Butter Yellow palette combination */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
              {/* Line 1: "Ruang" charcoal weight + "Kecil." butter yellow underline accent */}
              <span className="text-[#25251F]">Ruang </span>
              <span className="relative inline-block text-[#25251F]">
                Kecil.
                <span
                  className="absolute bottom-0 left-0 w-full h-[6px] rounded-full"
                  style={{ background: "linear-gradient(90deg, #F4D35E 60%, #E9C348 100%)" }}
                />
              </span>
              <br />
              {/* Line 2: "Kemungkinan" charcoal + "Besar." emerald editorial serif italic */}
              <span className="text-[#25251F]">Kemungkinan </span>
              <span className="font-editorial-serif font-normal italic text-[#009B75]">
                Besar.
              </span>
            </h1>

            {/* Supporting Explanation with selective Butter Yellow highlight */}
            <p className="text-base sm:text-lg text-[#5E5E52] leading-relaxed max-w-xl font-normal">
              Temukan inspirasi penataan, atur furnitur dalam visualisasi 3D presisi{" "}
              <span className="highlighter-butter font-semibold text-[#25251F]">skala 1:1</span>,
              dan wujudkan kamar yang nyaman sesuai ukuran serta kebutuhan harianmu.
            </p>

            {/* Dual CTA Buttons (Matching Image 1 "Awarded Project" & "Book a Demo") */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/room-planner"
                className="px-8 py-4 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg active:scale-95 group"
              >
                <Box className="w-4 h-4 text-[#F4D35E] group-hover:rotate-12 transition-transform" />
                <span>Mulai Rancang Ruangan</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/explore"
                className="px-8 py-4 rounded-full bg-white hover:bg-[#F0EEE7] border border-[#25251F]/15 text-[#25251F] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#5E5E52]" />
                <span>Jelajahi Inspirasi</span>
              </Link>
            </div>

            {/* Value Guarantees */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#5E5E52] font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#009B75]" /> Skala 1:1 Meter Nyata
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#009B75]" /> 100% Gratis di Browser
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#009B75]" /> Tanpa Perlu Unduh Aplikasi
              </span>
            </div>
          </div>

          {/* Right Column: Architectural Hero Image Frame with Floating Info Card (Image 1 Arcdev Style) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[2.5rem] overflow-hidden bg-stone-200 border border-[#25251F]/10 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&auto=format&fit=crop&q=85"
                alt="Penataan Kamar Kos Cerdas Japandi"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25251F]/60 via-transparent to-transparent" />

              {/* Bottom Tag */}
              <div className="absolute bottom-6 left-6 z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#25251F] text-xs font-bold font-mono">
                  Kamar Kos Japandi • 3.0 × 3.0 m
                </span>
              </div>
            </div>

            {/* Floating Card (Direct reference to Image 1 Arcdev floating overlay card) */}
            <div className="sm:absolute -bottom-8 -left-6 sm:w-80 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#25251F]/10 shadow-2xl space-y-3 mt-4 sm:mt-0 z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#009B75] flex items-center justify-center text-white">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#25251F] dark:text-white">
                      AKALIN Studio
                    </div>
                    <div className="text-[10px] text-[#5E5E52]">
                      Spatial Architecture
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#25251F] bg-[#F4D35E] px-2.5 py-0.5 rounded-full shadow-2xs">
                  ★ Rekomendasi
                </span>
              </div>

              <div className="pt-1">
                <h4 className="text-sm font-bold text-[#25251F] dark:text-white leading-snug">
                  Tata Kamar Kos Jadi 30% Lebih Lapang
                </h4>
                <p className="text-xs text-[#5E5E52] mt-1 leading-relaxed">
                  Coba penempatan kasur di sudut terjauh dan arahkan meja kerja ke cahaya alami.
                </p>
              </div>

              <Link
                href="/room-planner"
                className="w-full py-2.5 rounded-full border border-[#25251F]/20 hover:border-[#009B75] hover:bg-[#009B75] hover:text-white text-xs font-bold text-[#25251F] flex items-center justify-center gap-2 transition-all"
              >
                <span>Buka Planner 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. EDITORIAL ABOUT US & STAT COUNTERS (Direct reference to Image 2 Grafty) */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-6">
        <div className="border-t border-[#25251F]/15 pt-12 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Numbered Section Tag (Image 2 style: 01 —— ABOUT US) */}
            <div className="lg:col-span-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2">
                <span>01</span>
                <span className="w-8 h-[1px] bg-[#009B75]" />
                <span>TENTANG AKALIN</span>
              </span>
            </div>

            {/* Big Editorial Statement */}
            <div className="lg:col-span-9 space-y-10">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#25251F] font-heading tracking-tight leading-[1.18] uppercase">
                Platform interior spatial cerdas yang dirancang khusus untuk kamar kos, apartemen studio, dan ruang mungil.
              </h2>

              {/* Metrics Grid with Diagonal Arrows (Image 2 Grafty style) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 border-t border-[#25251F]/10">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#5E5E52] uppercase tracking-wider">
                    <span>Kepuasan Pengguna</span>
                    <ArrowUpRight className="w-4 h-4 text-[#25251F]" />
                  </div>
                  <div className="text-5xl sm:text-6xl font-black font-mono text-[#25251F] tracking-tight flex items-baseline gap-2">
                    <span>5.00</span>
                    <span className="text-2xl font-sans text-[#F4D35E]" title="Rating 5 Bintang">★</span>
                  </div>
                  <p className="text-xs text-[#5E5E52]">
                    Berdasarkan 70+ review mahasiswa dan perantau di kota besar.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#5E5E52] uppercase tracking-wider">
                    <span>Presisi Ukuran</span>
                    <ArrowUpRight className="w-4 h-4 text-[#25251F]" />
                  </div>
                  <div className="text-5xl sm:text-6xl font-black font-mono text-[#25251F] tracking-tight">
                    1:1
                  </div>
                  <p className="text-xs text-[#5E5E52]">
                    Skala perabot dan batas dinding akurat sesuai meteran fisik.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#5E5E52] uppercase tracking-wider">
                    <span>Biaya Akses</span>
                    <ArrowUpRight className="w-4 h-4 text-[#25251F]" />
                  </div>
                  <div className="text-5xl sm:text-6xl font-black font-mono text-[#009B75] tracking-tight">
                    <span className="highlighter-butter">Rp 0</span>
                  </div>
                  <p className="text-xs text-[#5E5E52]">
                    Bebas biaya selamanya, langsung dibuka di ponsel atau laptop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. CURATED INSPIRATIONS GALLERY (Matching Image 3 "Recent Projects")       */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="border-t border-[#25251F]/15 pt-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2 mb-2">
                <span>02</span>
                <span className="w-8 h-[1px] bg-[#009B75]" />
                <span>INSPIRASI TERBARU</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#25251F] tracking-tight">
                Karya & <span className="font-editorial-serif italic font-normal text-[#009B75]">Inspirasi</span> Terpilih.
              </h2>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#25251F]/20 hover:border-[#25251F] bg-white text-xs font-bold text-[#25251F] transition-all shadow-2xs self-start md:self-auto"
            >
              <span>Lihat Semua Inspirasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {inspirations.map((item) => {
              const isSaved = savedIds.includes(item.id);
              const length = item.room_length ?? 3.0;
              const width = item.room_width ?? 3.0;

              return (
                <div
                  key={item.id}
                  className="group rounded-3xl bg-white border border-[#25251F]/10 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image with Tag and Bookmark */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={item.cover_image_url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#25251F] text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                          {item.category?.name || "Kamar Kos"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(item.id, e)}
                        className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${
                          isSaved
                            ? "bg-[#009B75] text-[#F4D35E] shadow-md"
                            : "bg-white/80 hover:bg-white text-[#25251F] shadow-2xs"
                        }`}
                        aria-label="Simpan Ide"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-[#F4D35E]" : ""}`} />
                      </button>

                      <div className="absolute bottom-3 left-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#25251F]/80 backdrop-blur-sm text-white text-[10px] font-mono font-medium">
                          {length.toFixed(1)} × {width.toFixed(1)} m
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-bold text-[#25251F] group-hover:text-[#009B75] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#5E5E52] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-2 text-xs font-mono font-bold text-[#009B75]">
                        Estimasi {formatRupiah(item.estimated_budget)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-[#25251F]/5 mt-2">
                    <Link
                      href={`/ideas/${item.id}`}
                      className="text-xs font-bold text-[#25251F] hover:text-[#009B75] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Lihat Rincian</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/room-planner?preset=${length <= 3 ? "3x3" : "3x4"}&title=${encodeURIComponent(item.title)}`}
                      className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#009B75] hover:text-white text-xs font-bold text-[#25251F] flex items-center gap-1.5 transition-all"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Buka 3D</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. 3D ROOM PLANNER PRODUCT SHOWCASE                                       */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-[2.5rem] bg-white border border-[#25251F]/15 p-8 sm:p-14 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2">
                <span>03</span>
                <span className="w-8 h-[1px] bg-[#009B75]" />
                <span>INTERACTIVE 3D PLANNER</span>
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#25251F] tracking-tight leading-[1.12]">
                Rancang Sesuai <br />
                <span className="font-editorial-serif italic font-normal text-[#009B75]">Ukuran Riil</span> Kamarmu.
              </h2>

              <p className="text-sm text-[#5E5E52] leading-relaxed">
                Tentukan panjang dan lebar ruanganmu, pilih furnitur standar kamar kos,
                lalu geser dan putar secara bebas dalam tampilan 3D maupun 2D denah atas.
              </p>

              {/* Dimension Switcher Controls */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#25251F] uppercase tracking-wider font-mono">
                  Pilih Preset Ukuran:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "3x3", label: "3.0 × 3.0 m (Standar)" },
                    { id: "3x4", label: "3.0 × 4.0 m (Lega)" },
                    { id: "studio", label: "Studio 4.0 × 5.0 m" },
                  ].map((dim) => (
                    <button
                      key={dim.id}
                      type="button"
                      onClick={() => setSelectedDimension(dim.id as any)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        selectedDimension === dim.id
                          ? "bg-[#009B75] text-white shadow-sm"
                          : "bg-[#F0EEE7] text-[#25251F] hover:bg-stone-200"
                      }`}
                    >
                      {dim.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/room-planner?preset=${selectedDimension}`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#25251F] hover:bg-black text-white font-bold text-sm transition-all shadow-md active:scale-95 group"
                >
                  <Box className="w-4 h-4 text-[#F4D35E] group-hover:rotate-12 transition-transform" />
                  <span>Buka Planner Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Blueprint Mockup Visual */}
            <div className="lg:col-span-7 bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#25251F]/10 relative">
              <div className="aspect-[4/3] w-full bg-white rounded-2xl border-2 border-dashed border-[#25251F]/20 relative p-6 flex flex-col justify-between shadow-inner">
                {/* Labels */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#25251F] text-white text-[10px] font-mono font-bold">
                  PANJANG: {selectedDimension === "3x3" ? "3.00 m" : selectedDimension === "3x4" ? "4.00 m" : "5.00 m"}
                </div>
                <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 -rotate-90 px-3 py-0.5 rounded-full bg-[#25251F] text-white text-[10px] font-mono font-bold">
                  LEBAR: {selectedDimension === "3x3" ? "3.00 m" : selectedDimension === "3x4" ? "3.00 m" : "4.00 m"}
                </div>

                {/* Furniture Visual Layout */}
                <div className="relative w-full h-full">
                  {/* Bed */}
                  <div className="absolute left-4 top-4 w-28 h-44 rounded-xl bg-amber-100 border-2 border-amber-300 text-amber-900 flex flex-col items-center justify-center p-2 text-center shadow-xs">
                    <span className="text-[11px] font-bold">Kasur Single</span>
                    <span className="text-[9px] text-amber-800/80">0.9 × 2.0 m</span>
                  </div>

                  {/* Desk */}
                  <div className="absolute right-4 top-4 w-32 h-20 rounded-xl bg-stone-200 border-2 border-stone-400 text-stone-900 flex flex-col items-center justify-center p-2 text-center shadow-xs">
                    <span className="text-[11px] font-bold">Meja Belajar Oak</span>
                    <span className="text-[9px] text-stone-600">1.0 × 0.6 m</span>
                  </div>

                  {/* Chair */}
                  <div className="absolute right-14 top-28 w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-900 flex flex-col items-center justify-center text-center shadow-xs">
                    <span className="text-[9px] font-bold">Kursi</span>
                  </div>

                  {/* Wardrobe */}
                  <div className="absolute right-4 bottom-4 w-28 h-20 rounded-xl bg-stone-100 border-2 border-stone-300 text-stone-800 flex flex-col items-center justify-center p-2 text-center shadow-xs">
                    <span className="text-[11px] font-bold">Lemari 2 Pintu</span>
                    <span className="text-[9px] text-stone-500">0.8 × 0.5 m</span>
                  </div>

                  {/* Window & Door */}
                  <div className="absolute top-0 right-16 w-20 h-2 bg-sky-200 border border-sky-400 rounded-sm flex items-center justify-center">
                    <span className="text-[8px] text-sky-800 font-bold uppercase">Jendela</span>
                  </div>
                  <div className="absolute bottom-0 left-6 w-16 h-2 bg-amber-300 border border-amber-500 rounded-sm flex items-center justify-center">
                    <span className="text-[8px] text-amber-900 font-bold uppercase">Pintu</span>
                  </div>
                </div>

                {/* Bottom Legend */}
                <div className="pt-4 border-t border-[#25251F]/10 flex items-center justify-between text-xs text-[#5E5E52] font-mono">
                  <span>Sirkulasi Lapang: 5.4 m²</span>
                  <span className="text-[#009B75] font-bold">Bebas Tabrakan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. THREE STEPS WORKFLOW                                                  */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="border-t border-[#25251F]/15 pt-12">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2 mb-2">
              <span>04</span>
              <span className="w-8 h-[1px] bg-[#009B75]" />
              <span>LANGKAH MUDAH</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#25251F] tracking-tight">
              Dari Ide Menjadi <span className="font-editorial-serif italic font-normal text-[#009B75]">Kenyamanan</span> Nyata.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Temukan Inspirasi",
                desc: "Jelajahi ide tata letak berdasar dimensi kos, budget, dan preferensi gaya ruangan.",
              },
              {
                num: "02",
                title: "Atur Ruanganmu",
                desc: "Masukkan ukuran kamarmu dan coba berbagai posisi kasur, meja, dan lemari dalam 3D.",
              },
              {
                num: "03",
                title: "Wujudkan Ide",
                desc: "Simpan denah rancangan dan gunakan daftar perabot sebagai panduan belanja tanpa salah beli.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-3xl p-8 border border-[#25251F]/10 shadow-2xs hover:shadow-md transition-shadow space-y-4"
              >
                <span className="text-4xl sm:text-5xl font-black font-mono text-[#009B75]/30">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold text-[#25251F]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#5E5E52] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. CONCLUDING CTA BANNER                                                 */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-[2.5rem] bg-[#25251F] text-white p-10 sm:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#009B75] text-xs font-bold uppercase tracking-widest font-mono">
              Mulai Hari Ini
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Kamar Nyaman Dimulai dari <br />
              <span className="font-editorial-serif italic font-normal text-[#F4D35E]">Satu Ide Cerdas.</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Rancang kamar kos atau ruang mungil impianmu sekarang juga.
              Coba tata letak furnitur secara bebas tanpa khawatir salah ukuran.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/room-planner"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg group"
            >
              <Box className="w-4 h-4 text-[#F4D35E] group-hover:rotate-12 transition-transform" />
              <span>Mulai Rancang Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all group"
            >
              <Compass className="w-4 h-4 text-[#F4D35E] group-hover:rotate-45 transition-transform" />
              <span>Jelajahi Inspirasi</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
