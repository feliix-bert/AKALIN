"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import {
  Shield,
  Layers,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Inspiration } from "@/types";

export default function AdminDashboardPage() {
  const [pendingCount, setPendingCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [furnitureCount, setFurnitureCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const [allIns, furniture] = await Promise.all([
        DataService.getInspirations(),
        DataService.getFurnitureItems(),
      ]);
      setPublishedCount(allIns.filter((i) => i.status === "published").length);
      setPendingCount(allIns.filter((i) => i.status === "pending").length);
      setFurnitureCount(furniture.length);
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-[#25251F]/15 dark:border-stone-800 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2 mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>MODERASI & MANAJEMEN</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#25251F] dark:text-white tracking-tight leading-[1.12]">
              Admin Panel <span className="font-editorial-serif italic font-normal text-[#009B75]">Akalin.</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5E5E52] dark:text-stone-300 font-sans leading-relaxed">
              Kelola antrean moderasi kiriman inspirasi komunitas dan master katalog perabotan standar 3D.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/ideas"
              className="px-5 py-2.5 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white text-xs font-bold transition-all shadow-sm"
            >
              Moderasi Inspirasi
            </Link>
            <Link
              href="/admin/furniture"
              className="px-5 py-2.5 rounded-full border border-[#25251F]/15 bg-white hover:bg-[#F0EEE7] text-[#25251F] text-xs font-bold transition-all shadow-2xs"
            >
              Kelola Perabotan
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-amber-700">
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold">
                Menunggu Review
              </span>
            </div>
            <h3 className="text-4xl font-black text-[#25251F] dark:text-white font-mono">
              {pendingCount}
            </h3>
            <p className="text-xs text-[#5E5E52]">Inspirasi pengguna menunggu persetujuan</p>
            <div className="pt-2">
              <Link
                href="/admin/ideas"
                className="text-xs font-bold text-[#009B75] hover:underline flex items-center gap-1"
              >
                <span>Review antrean sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-[#009B75]">
              <CheckCircle className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase bg-[#E0F5EE] text-[#006B52] px-2.5 py-1 rounded-full font-bold">
                Terpublikasi
              </span>
            </div>
            <h3 className="text-4xl font-black text-[#25251F] dark:text-white font-mono">
              {publishedCount}
            </h3>
            <p className="text-xs text-[#5E5E52]">Inspirasi aktif di katalog publik</p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="text-xs font-bold text-[#009B75] hover:underline flex items-center gap-1"
              >
                <span>Lihat galeri publik</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-[#25251F] dark:text-white">
              <Layers className="w-5 h-5 text-[#009B75]" />
              <span className="text-[10px] font-mono uppercase bg-[#FAF8F5] text-[#25251F] px-2.5 py-1 rounded-full font-bold border border-[#25251F]/10">
                Katalog Master
              </span>
            </div>
            <h3 className="text-4xl font-black text-[#25251F] dark:text-white font-mono">
              {furnitureCount}
            </h3>
            <p className="text-xs text-[#5E5E52]">Item perabotan standar 3D</p>
            <div className="pt-2">
              <Link
                href="/admin/furniture"
                className="text-xs font-bold text-[#009B75] hover:underline flex items-center gap-1"
              >
                <span>Kelola perabot master</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
