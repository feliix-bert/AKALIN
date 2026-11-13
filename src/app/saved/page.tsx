"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DataService } from "@/lib/data-service";
import { Inspiration } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Bookmark, Compass, ArrowRight, Trash2, Box } from "lucide-react";

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
      console.error("Load saved error:", err);
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
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Pentagram Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#25251F]/15 dark:border-stone-800 pb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2 mb-2">
              <span>04</span>
              <span className="w-8 h-[1px] bg-[#009B75]" />
              <span>KOLEKSI PILIHAN</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#25251F] dark:text-white tracking-tight leading-[1.12]">
              Inspirasi <span className="font-editorial-serif italic font-normal text-[#009B75]">Tersimpan.</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5E5E52] dark:text-stone-300 font-sans leading-relaxed">
              Kumpulan ide dan penataan kamar kost favorit yang telah kamu tandai untuk persiapan penataan ruangan.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white dark:bg-stone-800 border border-[#25251F]/15 text-[#25251F] dark:text-white font-bold text-xs hover:bg-[#F0EEE7] transition-all shadow-2xs active:scale-95 shrink-0"
          >
            <Compass className="w-4 h-4 text-[#009B75]" />
            <span>Jelajahi Inspirasi Lain</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-[#5E5E52]">
            Memuat inspirasi tersimpan...
          </div>
        ) : savedInspirations.length === 0 ? (
          <div className="py-24 max-w-md mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white border border-[#25251F]/15 flex items-center justify-center mx-auto text-[#5E5E52]">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#25251F] dark:text-white">
              Belum Ada Inspirasi Tersimpan
            </h3>
            <p className="text-xs text-[#5E5E52] leading-relaxed">
              Jelajahi galeri inspirasi kamar dan tekan tombol bookmark pada desain yang kamu sukai.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#009B75] text-white hover:bg-[#006B52] font-bold text-xs transition-all shadow-sm"
            >
              <span>Jelajahi Inspirasi Kamar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedInspirations.map((ins) => {
              const length = ins.room_length ?? 3.0;
              const width = ins.room_width ?? 3.0;

              return (
                <div
                  key={ins.id}
                  className="group rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={ins.cover_image_url}
                        alt={ins.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleRemove(ins.id, e)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-[#25251F]/80 text-white hover:bg-rose-600 transition-colors shadow-sm"
                        title="Hapus dari Tersimpan"
                        aria-label="Hapus dari Tersimpan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-[#25251F] text-[10px] font-bold uppercase tracking-wider shadow-2xs font-mono">
                        {ins.category?.name || "Kamar Kos"}
                      </div>
                      <div className="absolute bottom-3 left-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#25251F]/85 backdrop-blur-sm text-white text-[10px] font-mono font-medium">
                          {length.toFixed(1)} × {width.toFixed(1)} m
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      <h3 className="font-bold text-base text-[#25251F] dark:text-white group-hover:text-[#009B75] transition-colors line-clamp-1">
                        {ins.title}
                      </h3>
                      <p className="text-xs text-[#5E5E52] dark:text-stone-300 line-clamp-2 leading-relaxed">
                        {ins.description}
                      </p>
                      <div className="pt-2 text-xs font-mono font-bold text-[#009B75]">
                        Estimasi {formatRupiah(ins.estimated_budget)}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center gap-2">
                    <Link
                      href={`/ideas/${ins.id}`}
                      className="flex-1 py-2.5 rounded-full bg-[#FAF8F5] dark:bg-stone-800 hover:bg-[#F0EEE7] text-[#25251F] dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#25251F]/10"
                    >
                      <span>Rincian</span>
                    </Link>
                    <Link
                      href={`/room-planner?preset=${length <= 3 ? "3x3" : "3x4"}&title=${encodeURIComponent(ins.title)}`}
                      className="flex-1 py-2.5 rounded-full bg-[#25251F] hover:bg-[#009B75] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Buka 3D</span>
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
