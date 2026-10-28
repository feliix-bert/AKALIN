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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Apakah kamu yakin ingin menghapus desain ruangan ini?")) {
      await DataService.deleteRoomDesign(id);
      loadDesigns();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
            <Box className="w-3.5 h-3.5" />
            Koleksi Pribadi
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Desain Ruangan Saya
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Kelola dan edit kembali tata letak kamar kos yang telah kamu simpan sebelumnya.
          </p>
        </div>

        <Link
          href="/room-planner"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Desain Baru</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">
          Memuat daftar desain tersimpan...
        </div>
      ) : designs.length === 0 ? (
        <div className="py-20 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Belum Ada Desain Tersimpan
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
              Rancang kamar kost pertamamu dan simpan hasilnya di sini untuk referensi berbelanja.
            </p>
          </div>
          <Link
            href="/room-planner"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Rancang Ruangan</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => {
            const itemCount = design.scene_data?.items?.length || 0;
            return (
              <div
                key={design.id}
                className="group rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
              >
                {/* 3D Blueprint Visual Schematic */}
                <div className="aspect-[16/10] w-full bg-stone-900 p-5 relative overflow-hidden flex flex-col justify-between text-white">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-stone-800/80 backdrop-blur-md text-[10px] font-mono text-emerald-400">
                      {design.room_length} x {design.room_width} meter
                    </span>
                    <button
                      onClick={(e) => handleDelete(design.id, e)}
                      className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-red-500/80 text-stone-300 hover:text-white transition-colors"
                      title="Hapus Desain"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-2">
                      <Box className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-stone-300 font-mono">
                      {itemCount} Perabotan Ditempatkan
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {design.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500 pt-1 font-mono">
                      <span>Tinggi: {design.wall_height}m</span>
                      <span>•</span>
                      <span>Lantai: {design.scene_data?.floorTexture || "Wood"}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">
                      Diperbarui {new Date(design.updated_at).toLocaleDateString("id-ID")}
                    </span>

                    <Link
                      href={`/room-planner/${design.id}`}
                      className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Buka di 3D</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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

