"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Compass,
  ArrowRight,
  Maximize2,
  Sliders,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Layers,
  Heart,
  Bookmark,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { Category, Inspiration } from "@/types";
import { formatRupiah } from "@/lib/utils";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const [cats, ins, saved] = await Promise.all([
        DataService.getCategories(),
        DataService.getInspirations({ sortBy: "popular" }),
        DataService.getSavedInspirationIds(),
      ]);
      setCategories(cats);
      setInspirations(ins.slice(0, 4));
      setSavedIds(saved);
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
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-[1.15]">
            Temukan inspirasi. <br className="hidden sm:inline" />
            <span className="text-emerald-700 dark:text-emerald-400">Rancang ruanganmu.</span> <br />
            Wujudkan idemu.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Platform visual untuk menata kamar kos 3x3, apartemen studio, dan ruang mungil.
            Simulasikan posisi kasur, meja belajar, dan lemari dalam 3D presisi sebelum keluar uang beli perabot.
          </p>

          {/* Strong CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/room-planner"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-stone-800 dark:hover:bg-white shadow-card hover:shadow-elevated transition-all"
            >
              <Box className="w-4 h-4 text-emerald-400 dark:text-emerald-700" />
              <span>Mulai Rancang Ruangan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 transition-all shadow-subtle"
            >
              <Compass className="w-4 h-4 text-stone-500" />
              <span>Jelajahi Inspirasi</span>
            </Link>
          </div>

          {/* Social Proof Tags */}
          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Skala 1:1 Meter
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bebas Instalasi
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Gratis
            </span>
          </div>
        </div>

        {/* 3D PLANNER VISUAL PREVIEW HERO CARD */}
        <div className="mt-12 md:mt-16 relative rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-elevated bg-stone-900 group">
          <div className="aspect-[16/9] md:aspect-[21/9] w-full relative">
            <img
              src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1600&auto=format&fit=crop&q=80"
              alt="Akalin 3D Room Planner Preview"
              className="w-full h-full object-cover opacity-85 group-hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

            {/* Floating 3D Editor Overlay Mockup Tag */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-600/90 text-white text-xs font-semibold backdrop-blur-md mb-2">
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Viewport Editor</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Simulasi Kamar Kos 3 x 3 Meter
                </h3>
                <p className="text-xs text-stone-300 max-w-md mt-1">
                  Atur letak kasur single, meja belajar, dan lemari pakaian dengan sistem rotasi dan collision check real-time.
                </p>
              </div>

              <Link
                href="/room-planner"
                className="px-5 py-2.5 rounded-xl bg-white text-stone-900 font-semibold text-xs flex items-center gap-2 hover:bg-stone-100 transition-colors shadow-lg shrink-0"
              >
                <span>Buka Editor 3D Langsung</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Cara Kerja Sederhana
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
            Tiga Langkah Mudah Menata Kamarmu
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Tidak perlu keahlian 3D atau software arsitektur yang rumit. Semuanya siap pakai di browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/70 dark:border-stone-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5">
                Tentukan Ukuran Ruangan
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Pilih ukuran preset kamar kos (seperti 3x3m atau 4x3m) atau ketik panjang dan lebar sesuai ukuran fisik ruangan aslimu.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/70 dark:border-stone-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5">
                Pilih & Letakkan Perabotan
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Pilih kasur, meja kerja, rak buku, dan lemari dari katalog. Tarik dan letakkan di lantai 3D, putar posisinya sesuai selera.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/70 dark:border-stone-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5">
                Simpan & Belanja Tanpa Ragu
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Simpan layout desain ruanganmu. Gunakan ukuran tepat sebagai acuan saat membeli perabot di marketplace atau toko mebel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Kategori Populer
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              Jelajahi Berdasarkan Kebutuhanmu
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Lihat Semua Kategori</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.slug}`}
              className="p-4 rounded-2xl bg-white dark:bg-[#1E2126] border border-stone-200/70 dark:border-stone-800 hover:border-emerald-600/50 hover:shadow-md transition-all group flex flex-col justify-between text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FEATURED INSPIRATIONS FEED ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Inspirasi Pilihan
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
              Desain Kamar Nyata dari Komunitas
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Lengkap dengan estimasi budget, rincian perabot, dan ukuran ruangan.
            </p>
          </div>
          <Link
            href="/explore"
            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-200 transition-colors shrink-0"
          >
            Jelajahi Semua Inspirasi
          </Link>
        </div>

        {/* Pinterest-like Masonry Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inspirations.map((ins) => {
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
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-[10px] font-medium">
                    {ins.category?.name || "Kamar Kos"}
                  </div>
                  {/* Save Bookmark Button */}
                  <button
                    onClick={(e) => handleToggleSave(ins.id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-90 ${
                      isSaved
                        ? "bg-rose-500 text-white"
                        : "bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-200 hover:bg-white"
                    }`}
                    title={isSaved ? "Tersimpan" : "Simpan Ide Ini"}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {ins.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                      {ins.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Est. Budget</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        {formatRupiah(ins.estimated_budget)}
                      </span>
                    </div>

                    <Link
                      href={`/ideas/${ins.id}`}
                      className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-[11px] transition-colors"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= BENEFITS SECTION ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-stone-900 text-white p-8 md:p-14 relative overflow-hidden">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Kenapa Harus Merancang Dulu?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Hindari Kamar Sempit yang Penuh Sesak dan Meja yang Mentok Pintu
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Banyak anak kos memesan meja atau kasur secara online, tapi saat barang tiba ukurannya tidak muat atau menutup akses pintu kamar mandi.
              Dengan Akalin, kamu bisa pastikan sirkulasi jalan lapang dan nyaman sebelum checkout barang.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold">Hemat Anggaran</h4>
                  <p className="text-[11px] text-stone-400">
                    Tidak ada lagi uang terbuang untuk perabotan yang salah ukuran atau tidak terpakai.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold">Sirkulasi Udara Optimal</h4>
                  <p className="text-[11px] text-stone-400">
                    Atur posisi ranjang dekat jendela dan jauhkan lemari dari jalur keluar masuk.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/room-planner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold text-xs transition-colors shadow-lg"
              >
                <span>Coba 3D Room Planner Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

