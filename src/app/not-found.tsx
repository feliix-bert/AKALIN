import Link from "next/link";
import { Box, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
        <Box className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
          404 — Ruangan Tidak Ditemukan
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Halaman yang Kamu Cari Tidak Ada
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          Tautan mungkin rusak, halaman telah dipindahkan, atau ruangan belum dibuat.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Jelajah Inspirasi</span>
        </Link>
      </div>
    </div>
  );
}
