"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { Inspiration } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Bookmark, Compass, ArrowRight, Trash2 } from "lucide-react";

export default function SavedInspirationsPage() {
  const [savedInspirations, setSavedInspirations] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    setLoading(true);
    try {
      const [savedIds, allIns] = await Promise.all([
        DataService.getSavedInspirationIds(),
        DataService.getInspirations(),
      ]);
      const filtered = allIns.filter((ins) => savedIds.includes(ins.id));
      setSavedInspirations(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleRemove = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await DataService.toggleSaveInspiration(id);
    loadSaved();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
          <Bookmark className="w-3.5 h-3.5" />
          Koleksi Pilihan
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Inspirasi Kamar Tersimpan
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Kumpulan ide dan penataan kamar kost favorit yang telah kamu tandai.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">
          Memuat inspirasi tersimpan...
        </div>
      ) : savedInspirations.length === 0 ? (
        <div className="py-20 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Belum Ada Inspirasi Tersimpan
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
              Temukan inspirasi kamar kos yang menarik di galeri jelajah dan klik tombol bookmark.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
          >
            <Compass className="w-4 h-4" />
            <span>Jelajahi Inspirasi</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedInspirations.map((ins) => (
            <div
              key={ins.id}
              className="group rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                  <img
                    src={ins.cover_image_url}
                    alt={ins.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => handleRemove(ins.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/80 text-white hover:bg-rose-600 transition-colors shadow-sm"
                    title="Hapus dari Tersimpan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-[10px] font-medium">
                    {ins.category?.name || "Kamar Kos"}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                    {ins.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {ins.description}
                  </p>
                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    Est. {formatRupiah(ins.estimated_budget)}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/ideas/${ins.id}`}
                  className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-stone-800 transition-colors"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
