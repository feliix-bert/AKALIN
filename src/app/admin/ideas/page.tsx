"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { Inspiration } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminIdeasPage() {
  const [items, setItems] = useState<Inspiration[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const all = await DataService.getInspirations();
      setItems(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModerate = async (id: string, status: "published" | "rejected") => {
    const success = await DataService.moderateInspiration(id, status);
    if (success) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Bar Navigation & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-[#009B75] dark:hover:text-[#009B75] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Admin Panel</span>
          </Link>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-900 p-1.5 rounded-full border border-stone-200 dark:border-stone-800 text-xs">
            {[
              { id: "all", label: "Semua" },
              { id: "pending", label: "Pending" },
              { id: "published", label: "Disetujui" },
              { id: "rejected", label: "Ditolak" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                  filterStatus === tab.id
                    ? "bg-[#009B75] text-white shadow-sm font-semibold"
                    : "text-stone-600 dark:text-stone-400 hover:text-[#25251F] dark:hover:text-stone-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#009B75] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Kurasi & Review Desain</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#25251F] dark:text-stone-100">
            Moderasi <span className="font-editorial-serif italic font-normal text-[#009B75]">Inspirasi Komunitas</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Tinjau kiriman desain penataan kamar dari pengguna sebelum dipublikasikan ke halaman jelajah publik.
          </p>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-24 text-center text-xs text-stone-500 bg-white dark:bg-[#1E2126] rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm">
            Memuat daftar kiriman inspirasi...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 rounded-[2rem] bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 shadow-sm">
            Tidak ada kiriman inspirasi pada filter ini.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-[1.75rem] bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-700">
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                          item.status === "published"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : item.status === "rejected"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-900 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        Oleh: <strong className="text-[#25251F] dark:text-stone-200">{item.author?.display_name || "Pengguna"}</strong>
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#25251F] dark:text-stone-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1 max-w-xl">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs pt-0.5">
                      <span className="font-semibold text-[#009B75] dark:text-[#009B75]">
                        Budget: {formatRupiah(item.estimated_budget)}
                      </span>
                      <span className="text-stone-300 dark:text-stone-700">•</span>
                      <span className="font-mono text-stone-500">
                        Ukuran: {(item.room_length ?? 3.0).toFixed(1)} × {(item.room_width ?? 3.0).toFixed(1)} m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Link
                    href={`/ideas/${item.id}`}
                    className="px-3.5 py-2 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Pratinjau Halaman"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </Link>

                  <button
                    onClick={() => handleModerate(item.id, "published")}
                    disabled={item.status === "published"}
                    className="px-4 py-2 rounded-full bg-[#009B75] hover:bg-[#007F60] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Setujui</span>
                  </button>

                  <button
                    onClick={() => handleModerate(item.id, "rejected")}
                    disabled={item.status === "rejected"}
                    className="px-4 py-2 rounded-full border border-rose-300 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Tolak</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
