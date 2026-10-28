"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DataService } from "@/lib/data-service";
import { Inspiration } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  ArrowLeft,
  Bookmark,
  Box,
  Compass,
  CheckCircle2,
  Calendar,
  User,
  Maximize2,
  Wallet,
  Layers,
  Sparkles,
  Share2,
  Check,
} from "lucide-react";

export default function InspirationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [inspiration, setInspiration] = useState<Inspiration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const item = await DataService.getInspirationById(id);
        if (item) {
          setInspiration(item);
          setActiveImage(item.cover_image_url);
          const savedIds = await DataService.getSavedInspirationIds();
          setIsSaved(savedIds.includes(item.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleToggleSave = async () => {
    if (!inspiration) return;
    const nextSaved = await DataService.toggleSaveInspiration(inspiration.id);
    setIsSaved(nextSaved);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-stone-500">
        Memuat detail inspirasi...
      </div>
    );
  }

  if (!inspiration) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Inspirasi Tidak Ditemukan
        </h2>
        <p className="text-xs text-stone-500">
          Ide desain ruangan yang kamu cari mungkin telah dihapus atau belum disetujui.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Jelajah</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Top Back & Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 text-xs flex items-center gap-1.5"
            title="Salin Tautan"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? "Tersalin" : "Bagikan"}</span>
          </button>

          <button
            onClick={handleToggleSave}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isSaved
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
            <span>{isSaved ? "Tersimpan" : "Simpan Ide"}</span>
          </button>
        </div>
      </div>

      {/* Hero Image Showcase */}
      <div className="space-y-3">
        <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-elevated relative">
          <img
            src={activeImage || inspiration.cover_image_url}
            alt={inspiration.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-semibold">
            {inspiration.category?.name || "Kamar Kos"}
          </div>
        </div>

        {/* Gallery Thumbnails (if multiple) */}
        {inspiration.gallery_images && inspiration.gallery_images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {inspiration.gallery_images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img
                    ? "border-emerald-600 scale-105 shadow-sm"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details & 3D Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Title, Instructions, Materials */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {inspiration.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
              {inspiration.description}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          {inspiration.instructions && inspiration.instructions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Tahapan Penataan Ruangan</span>
              </h3>
              <div className="space-y-3">
                {inspiration.instructions.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E2126] border border-stone-200/70 dark:border-stone-800 flex gap-3.5"
                  >
                    <span className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {step.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials & Furniture Required */}
          {inspiration.materials && inspiration.materials.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Rincian Perabotan & Bahan</span>
              </h3>
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E2126] overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
                {inspiration.materials.map((mat, idx) => (
                  <div key={idx} className="p-3 px-4 flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {mat.name}
                    </span>
                    {mat.estimate && (
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                        {mat.estimate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Meta Info Card & 3D Planner CTA */}
        <div className="space-y-6">
          {/* Quick Specs Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Informasi Spesifikasi
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600" /> Estimasi Biaya
                </span>
                <span className="font-bold text-sm font-mono text-emerald-700 dark:text-emerald-400">
                  {formatRupiah(inspiration.estimated_budget)}
                </span>
              </div>

              {inspiration.room_length && inspiration.room_width && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-stone-400" /> Ukuran Ruang
                  </span>
                  <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
                    {inspiration.room_length} x {inspiration.room_width} m
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 flex items-center gap-2">
                  <User className="w-4 h-4 text-stone-400" /> Penata Ruang
                </span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {inspiration.author?.display_name || "Komunitas Akalin"}
                </span>
              </div>
            </div>

            {/* OPEN IN 3D PLANNER BUTTON */}
            <div className="pt-2">
              <Link
                href={`/room-planner`}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Box className="w-4 h-4" />
                <span>Buka di Room Planner 3D</span>
              </Link>
              <p className="text-[11px] text-stone-400 text-center mt-2">
                Simulasikan dan modifikasi susunan tata letak ini secara langsung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

