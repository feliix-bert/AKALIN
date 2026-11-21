"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { FurnitureCategory, FurnitureItem } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Layers,
  ArrowLeft,
  Plus,
  Box,
  Trash2,
  CheckCircle,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function AdminFurniturePage() {
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // New item form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FurnitureCategory>("bed");
  const [description, setDescription] = useState("");
  const [width, setWidth] = useState<number>(1.0);
  const [depth, setDepth] = useState<number>(0.6);
  const [height, setHeight] = useState<number>(0.75);
  const [price, setPrice] = useState<number>(500000);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60"
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const all = await DataService.getFurnitureItems();
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await DataService.addFurnitureItem({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      description,
      width,
      depth,
      height,
      thumbnail_url: thumbnailUrl,
      model_type: "procedural",
      price_estimate: price,
      is_active: true,
    });

    setIsAdding(false);
    setName("");
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Bar Navigation & Add Button */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-[#009B75] dark:hover:text-[#009B75] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Admin Panel</span>
          </Link>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#009B75] hover:bg-[#007F60] text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Perabot Baru</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#009B75] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Master Data 3D Assets</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#25251F] dark:text-stone-100">
            Manajemen <span className="font-editorial-serif italic font-normal text-[#009B75]">Katalog Perabotan</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Daftar master perabotan standar yang dapat diletakkan pengguna di dalam canvas 3D Room Planner.
          </p>
        </div>

        {/* Add Furniture Form Modal / Box */}
        {isAdding && (
          <form
            onSubmit={handleCreate}
            className="p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 shadow-md space-y-5 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <h3 className="text-base font-bold text-[#25251F] dark:text-stone-100 flex items-center gap-2">
                <Box className="w-4 h-4 text-[#009B75]" />
                <span>Formulir Tambah Perabot Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-[#25251F] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Nama Perabot
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rak Susun Buku 3 Tier"
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
                >
                  <option value="bed">Kasur / Ranjang</option>
                  <option value="desk">Meja Belajar / Kerja</option>
                  <option value="chair">Kursi Ergonomis</option>
                  <option value="wardrobe">Lemari Pakaian</option>
                  <option value="storage">Rak & Simpan</option>
                  <option value="sofa">Sofa Minimalis</option>
                  <option value="table">Meja Samping</option>
                  <option value="lighting">Lampu & Penerangan</option>
                  <option value="decor">Karpet & Aksesori</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Estimasi Harga (IDR)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Lebar (X - meter)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Panjang / Kedalaman (Z - meter)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={depth}
                  onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Tinggi (Y - meter)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                URL Foto Thumbnail
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono focus:border-[#009B75] focus:ring-1 focus:ring-[#009B75] text-[#25251F] dark:text-stone-100 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#009B75] hover:bg-[#007F60] text-white text-xs font-bold shadow-sm transition-colors"
              >
                Simpan ke Katalog 3D
              </button>
            </div>
          </form>
        )}

        {/* Furniture List Table */}
        <div className="rounded-[2rem] bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Item Perabot</th>
                  <th className="py-4 px-4">Kategori</th>
                  <th className="py-4 px-4">Dimensi (LxPxT)</th>
                  <th className="py-4 px-4">Est. Harga</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-stone-500">
                      Memuat katalog...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-stone-500">
                      Belum ada perabot di katalog.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-900/30 transition-colors">
                      <td className="py-3.5 px-6 flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-700">
                          <img
                            src={item.thumbnail_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60";
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#25251F] dark:text-stone-100 block">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-stone-500 font-mono">
                            {item.model_type} 3D Mesh
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[10px] font-mono font-bold text-stone-600 dark:text-stone-400">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-700 dark:text-stone-300">
                        {item.width} × {item.depth} × {item.height} m
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#009B75] dark:text-[#009B75]">
                        {formatRupiah(item.price_estimate)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider">
                          Aktif
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
