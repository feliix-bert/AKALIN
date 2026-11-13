"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/room-planner")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#F0EEE7] dark:bg-[#16181B] border-t border-stone-200 dark:border-stone-800 text-[#25251F] dark:text-stone-300 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3.5">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm">
              Platform inspirasi dan penataan kamar kost cerdas dengan 3D Interactive Room Planner.
              Rancang sebelum beli, maksimalkan setiap jengkal ruang, hemat waktu dan biaya.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-bold text-[#25251F] dark:text-stone-100 uppercase tracking-wider mb-3.5">
              Fitur Utama
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/room-planner" className="hover:text-[#009B75] transition-colors font-medium">
                  Interactive 3D Room Planner
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#009B75] transition-colors font-medium">
                  Inspirasi Kamar Kos
                </Link>
              </li>
              <li>
                <Link href="/furniture" className="hover:text-[#009B75] transition-colors font-medium">
                  Katalog Perabotan Standar
                </Link>
              </li>
              <li>
                <Link href="/my-designs" className="hover:text-[#009B75] transition-colors font-medium">
                  Simpan Desain Ruangan
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-bold text-[#25251F] dark:text-stone-100 uppercase tracking-wider mb-3.5">
              Kategori Ruang
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/explore?category=kamar-kos-minimalis" className="hover:text-[#009B75] transition-colors font-medium">
                  Kamar Kos 3×3 Minimalis
                </Link>
              </li>
              <li>
                <Link href="/explore?category=kamar-kos-estetik" className="hover:text-[#009B75] transition-colors font-medium">
                  Kamar Nuansa Earthy Estetik
                </Link>
              </li>
              <li>
                <Link href="/explore?category=ruang-belajar-produktif" className="hover:text-[#009B75] transition-colors font-medium">
                  Setup Ruang Belajar Skripsi
                </Link>
              </li>
              <li>
                <Link href="/explore?category=desain-hemat-budget" className="hover:text-[#009B75] transition-colors font-medium">
                  Dekorasi di Bawah 1 Juta
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-bold text-[#25251F] dark:text-stone-100 uppercase tracking-wider mb-3.5">
              Komunitas
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
              Punya ide penataan kamar kost yang menarik? Bagikan kreasi dan rincian budget-mu sekarang!
            </p>
            <Link
              href="/ideas/new"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#009B75] hover:bg-[#007F60] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Kirim Desain Kamarmu
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-300/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} AKALIN — Ruang Kos Cerdas. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1.5 font-medium">
            Dibuat untuk mahasiswa dan pejuang ruang mungil di Indonesia{" "}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
