"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { RoomDesign } from "@/types";
import {
  Box,
  Plus,
  Trash2,
  Maximize2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function MyDesignsPage() {
  const [designs, setDesigns] = useState<RoomDesign[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const list = await DataService.getRoomDesigns();
      setDesigns(list);
    } catch (err) {
      console.error("Load designs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Apakah kamu yakin ingin menghapus desain "${title}"?`)) {
      await DataService.deleteRoomDesign(id);
      loadDesigns();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Pentagram Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#25251F]/15 dark:border-stone-800 pb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75] flex items-center gap-2 mb-2">
              <span>03</span>
              <span className="w-8 h-[1px] bg-[#009B75]" />
              <span>ARSIP DESAIN PRIBADI</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#25251F] dark:text-white tracking-tight leading-[1.12]">
              Desain Ruangan{" "}
              {/* "Saya." — emerald serif italic + butter yellow sweep behind */}
              <span className="relative inline-block">
                <span className="relative z-10 font-editorial-serif italic font-normal text-[#009B75]">Saya.</span>
                <span
                  className="absolute inset-x-0 bottom-[6%] h-[42%] rounded-sm -z-0"
                  style={{ background: "rgba(244,211,94,0.45)" }}
                />
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5E5E52] dark:text-stone-300 font-sans leading-relaxed">
              Kelola dan tinjau kembali tata letak kamar kos yang telah kamu rancang.
              Gunakan sebagai panduan penataan nyata saat membeli perabot.
            </p>
          </div>

          <Link
            href="/room-planner"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white font-bold text-xs transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Rancangan Baru</span>
          </Link>
        </div>

        {/* Designs Grid or Empty State */}
        {loading ? (
          <div className="py-24 text-center text-xs font-mono text-[#5E5E52]">
            Memuat daftar desain tersimpan...
          </div>
        ) : designs.length === 0 ? (
          <div className="py-24 max-w-md mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white border border-[#25251F]/15 flex items-center justify-center mx-auto text-[#5E5E52]">
              <Box className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#25251F] dark:text-white">
              Belum Ada Desain Tersimpan
            </h3>
            <p className="text-xs text-[#5E5E52] leading-relaxed">
              Mulai simulasikan posisi kasur, meja belajar, dan lemari pakaian dalam 3D skala 1:1 meter sesuai ukuran kamarmu.
            </p>
            <Link
              href="/room-planner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25251F] text-white hover:bg-black font-bold text-xs transition-all shadow-sm"
            >
              <span>Mulai Rancang Ruangan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((design) => {
              const itemCount = design.scene_data?.items?.length || 0;
              return (
                <div
                  key={design.id}
                  className="group rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    {/* Dimension Tag & Delete Button */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#E0F5EE] text-[#006B52] text-[11px] font-mono font-bold">
                        {design.room_length.toFixed(1)} × {design.room_width.toFixed(1)} m
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(design.id, design.title, e)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Desain"
                        aria-label="Hapus Desain"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#25251F] dark:text-white group-hover:text-[#009B75] transition-colors line-clamp-1">
                      {design.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="space-y-1.5 text-xs text-[#5E5E52] font-mono">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#5E5E52]" />
                        <span>{itemCount} perabot aktif di ruangan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#5E5E52]" />
                        <span>
                          Disimpan pada{" "}
                          {new Date(design.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="p-6 pt-0">
                    <Link
                      href={`/room-planner/${design.id}`}
                      className="w-full py-3 rounded-full bg-[#FAF8F5] dark:bg-stone-800 hover:bg-[#009B75] hover:text-white text-[#25251F] dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs group-hover:bg-[#009B75] group-hover:text-white"
                    >
                      <Box className="w-4 h-4" />
                      <span>Buka & Edit di Planner 3D</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
