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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5" />
            Moderasi & Manajemen
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Admin Panel Akalin
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Kelola moderasi kiriman inspirasi komunitas dan master katalog perabotan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/ideas"
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Moderasi Inspirasi
          </Link>
          <Link
            href="/admin/furniture"
            className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
          >
            Kelola Perabotan
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded font-bold">
              Menunggu Review
            </span>
          </div>
          <h3 className="text-3xl font-black text-stone-900 dark:text-stone-100 font-mono">
            {pendingCount}
          </h3>
          <p className="text-xs text-stone-500">Inspirasi berstatus pending</p>
          <div className="pt-2">
            <Link
              href="/admin/ideas"
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Review sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-bold">
              Terpublikasi
            </span>
          </div>
          <h3 className="text-3xl font-black text-stone-900 dark:text-stone-100 font-mono">
            {publishedCount}
          </h3>
          <p className="text-xs text-stone-500">Inspirasi aktif di galeri publik</p>
          <div className="pt-2">
            <Link
              href="/explore"
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Buka galeri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card space-y-2">
          <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-mono uppercase bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded font-bold">
              Katalog
            </span>
          </div>
          <h3 className="text-3xl font-black text-stone-900 dark:text-stone-100 font-mono">
            {furnitureCount}
          </h3>
          <p className="text-xs text-stone-500">Item perabotan 3D terdaftar</p>
          <div className="pt-2">
            <Link
              href="/admin/furniture"
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Kelola perabot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
