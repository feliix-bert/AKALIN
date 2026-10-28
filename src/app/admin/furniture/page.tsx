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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Admin Panel</span>
        </Link>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Perabot Baru</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Manajemen Katalog Perabotan
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Daftar master perabotan 3D yang dapat digunakan di dalam 3D Room Planner.
        </p>
      </div>

      {/* Add Furniture Form Modal / Box */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200 dark:border-stone-800 shadow-card space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Formulir Tambah Perabot
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Nama Perabot
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Rak Susun Buku 3 Tier"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
              >
                <option value="bed">Kasur / Ranjang</option>
                <option value="desk">Meja</option>
                <option value="chair">Kursi</option>
                <option value="wardrobe">Lemari Pakaian</option>
                <option value="storage">Rak & Simpan</option>
                <option value="sofa">Sofa</option>
                <option value="table">Meja Samping</option>
                <option value="lighting">Lampu</option>
                <option value="decor">Karpet & Dekorasi</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Estimasi Harga (IDR)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Lebar (X - meter)
              </label>
              <input
                type="number"
                step="0.05"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Panjang / Tebal (Z - meter)
              </label>
              <input
                type="number"
                step="0.05"
                value={depth}
                onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Tinggi (Y - meter)
              </label>
              <input
                type="number"
                step="0.05"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
            >
              Simpan ke Katalog
            </button>
          </div>
        </form>
      )}

      {/* Furniture List Table */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 dark:bg-stone-900/40 border-b border-stone-100 dark:border-stone-800 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Dimensi (LxPxT)</th>
              <th className="py-3 px-4">Est. Harga</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30">
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <img
                      src={item.thumbnail_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {item.model_type} 3D
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 uppercase text-[10px] font-mono font-bold text-stone-500">
                  {item.category}
                </td>
                <td className="py-3 px-4 font-mono text-stone-700 dark:text-stone-300">
                  {item.width} x {item.depth} x {item.height} m
                </td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {formatRupiah(item.price_estimate)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold uppercase">
                    Aktif
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
