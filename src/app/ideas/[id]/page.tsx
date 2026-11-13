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
  ArrowRight,
  ShieldCheck,
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
        console.error("Detail load error:", err);
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
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#009B75] border-t-transparent rounded-full animate-spin" />
        <span className="mt-4 text-xs font-mono text-[#5E5E52]">
          Memuat kurasi ruangan...
        </span>
      </div>
    );
  }

  if (!inspiration) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-[#25251F] dark:text-white">
          Inspirasi Tidak Ditemukan
        </h2>
        <p className="mt-2 text-xs text-[#5E5E52] max-w-sm">
          Ide penataan ini mungkin telah dipindahkan atau belum dipublikasikan.
        </p>
        <Link
          href="/explore"
          className="mt-6 px-6 py-3 rounded-full bg-[#25251F] text-white text-xs font-bold hover:bg-black transition-all"
        >
          Kembali ke Jelajah
        </Link>
      </div>
    );
  }

  const length = inspiration.room_length ?? 3.0;
  const width = inspiration.room_width ?? 3.0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between border-b border-[#25251F]/15 dark:border-stone-800 pb-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#25251F] dark:text-stone-300 hover:text-[#009B75] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2 rounded-full border border-[#25251F]/15 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-bold text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] flex items-center gap-1.5 transition-all shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#009B75]" /> : <Share2 className="w-3.5 h-3.5 text-[#5E5E52]" />}
              <span>{copied ? "Tautan Disalin!" : "Bagikan"}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSave}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-2xs ${
                isSaved
                  ? "bg-[#009B75] text-[#F4D35E] shadow-sm"
                  : "bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-800 text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7]"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-[#F4D35E]" : ""}`} />
              <span className={isSaved ? "text-white" : ""}>{isSaved ? "Tersimpan" : "Simpan Ide"}</span>
            </button>
          </div>
        </div>

        {/* Pentagram Editorial Title & Metadata */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#E0F5EE] border border-[#009B75]/20 text-[#006B52] text-[11px] font-bold uppercase tracking-wider">
              {inspiration.category?.name || "Kamar Kos Cerdas"}
            </span>
            <span className="text-xs text-[#5E5E52] font-mono">•</span>
            <span className="text-xs text-[#25251F] font-mono font-semibold">
              Skala Dimensi {length.toFixed(1)} × {width.toFixed(1)} m
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#25251F] dark:text-white tracking-tight leading-[1.14]">
            {inspiration.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5E5E52] dark:text-stone-300 font-normal leading-relaxed">
            {inspiration.description}
          </p>

          {/* Author Byline (Aesop style) */}
          <div className="pt-2 flex items-center gap-3 text-xs text-[#5E5E52]">
            <div className="w-7 h-7 rounded-full bg-stone-300 overflow-hidden relative">
              {inspiration.author?.avatar_url && (
                <img
                  src={inspiration.author.avatar_url}
                  alt={inspiration.author.display_name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span>
              Dikurasi oleh{" "}
              <strong className="text-[#25251F] dark:text-white font-bold">
                {inspiration.author?.display_name || "Desainer AKALIN"}
              </strong>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#009B75] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Pas untuk Kos
            </span>
          </div>
        </div>

        {/* Main Image Showcase */}
        <div className="space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[2rem] overflow-hidden bg-stone-200 shadow-xl border border-[#25251F]/10">
            <img
              src={activeImage || inspiration.cover_image_url}
              alt={inspiration.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-[#25251F]/85 backdrop-blur-md text-white text-xs font-mono font-medium">
              Foto Representasi Sudut Ruangan
            </div>
          </div>

          {/* Thumbnail Strip */}
          {inspiration.gallery_images && inspiration.gallery_images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {inspiration.gallery_images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img
                      ? "border-[#009B75] scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Sudut ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Handover Banner to 3D Planner */}
        <div className="rounded-[2rem] bg-[#25251F] text-white p-8 sm:p-10 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#009B75] tracking-wider">
              <Box className="w-4 h-4 text-[#009B75]" />
              <span>Simulasi Denah Langsung</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ingin mencoba penataan ini di kamarmu?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Buka ukuran {length.toFixed(1)} × {width.toFixed(1)} m di 3D Room Planner.
              Kamu bisa menggeser posisi kasur, meja belajar, dan lemari secara bebas.
            </p>
          </div>

          <Link
            href={`/room-planner?preset=${length <= 3 ? "3x3" : "3x4"}&title=${encodeURIComponent(inspiration.title)}`}
            className="px-8 py-4 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 shrink-0 relative z-10 group"
          >
            <Box className="w-4 h-4 text-[#F4D35E] group-hover:rotate-12 transition-transform" />
            <span>Buka di Planner 3D</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Two-Column Editorial Details: Materials & Step-by-Step Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
          {/* Left Column: Material & Budget Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#25251F]/15 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#25251F]/10 dark:border-stone-800 pb-4 mb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#5E5E52] block font-mono">
                    Estimasi Total Biaya
                  </span>
                  <div className="text-2xl font-black font-mono text-[#009B75] flex items-center gap-2">
                    <span>{formatRupiah(inspiration.estimated_budget)}</span>
                    <span className="badge-butter text-[10px] px-2 py-0.5 font-sans font-bold">
                      Hemat
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 flex items-center justify-center text-[#25251F] dark:text-white">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#25251F] dark:text-white mb-4 font-mono">
                Rincian Perabot & Bahan:
              </h4>

              <div className="space-y-3">
                {inspiration.materials.map((mat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-2 border-b border-stone-100 dark:border-stone-800 last:border-0"
                  >
                    <span className="font-semibold text-[#25251F] dark:text-stone-200 pr-2">
                      {mat.name}
                    </span>
                    <span className="font-mono font-bold text-[#5E5E52] shrink-0">
                      {mat.estimate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Step-by-Step Layout Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#25251F]/15 dark:border-stone-800 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75]">
                  Panduan Bertahap
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#25251F] dark:text-white mt-1">
                  Filosofi Penataan Ruang
                </h3>
                <p className="text-xs text-[#5E5E52] mt-1">
                  Ikuti urutan langkah ini agar kamar kos tetap rapi dan sirkulasi udara lancar.
                </p>
              </div>

              <div className="space-y-6">
                {inspiration.instructions.map((inst) => (
                  <div key={inst.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/20 dark:border-stone-700 font-mono text-xs font-bold text-[#25251F] dark:text-white flex items-center justify-center shrink-0">
                      0{inst.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#25251F] dark:text-white">
                        {inst.title}
                      </h4>
                      <p className="text-xs text-[#5E5E52] leading-relaxed">
                        {inst.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
