"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { Inspiration, InspirationStatus } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Shield,
  ArrowLeft,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Admin Panel</span>
        </Link>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs">
          {[
            { id: "all", label: "Semua" },
            { id: "pending", label: "Pending" },
            { id: "published", label: "Disetujui" },
            { id: "rejected", label: "Ditolak" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterStatus === tab.id
                  ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Moderasi Inspirasi Komunitas
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Tinjau konten yang dikirim pengguna sebelum ditayangkan ke publik.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">
          Memuat daftar kiriman...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
          Tidak ada kiriman inspirasi pada filter ini.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={item.cover_image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                        item.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Oleh: {item.author?.display_name || "Pengguna"}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                    Budget: {formatRupiah(item.estimated_budget)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <Link
                  href={`/ideas/${item.id}`}
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs flex items-center gap-1.5"
                  title="Pratinjau Halaman"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </Link>

                <button
                  onClick={() => handleModerate(item.id, "published")}
                  disabled={item.status === "published"}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Setujui</span>
                </button>

                <button
                  onClick={() => handleModerate(item.id, "rejected")}
                  disabled={item.status === "rejected"}
                  className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tolak</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
