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
    <footer className="w-full bg-[#F3EFEA] dark:bg-[#16181B] border-t border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/">
              <Logo />
            </Link>
            <p className="text-xs text-stone-500 leading-relaxed">
              Platform inspirasi dan penataan kamar kost cerdas dengan 3D Interactive Room Planner.
              Rancang sebelum beli, hemat waktu dan biaya.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-3">
              Fitur Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/room-planner" className="hover:text-emerald-600 transition-colors">
                  Interactive 3D Room Planner
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-emerald-600 transition-colors">
                  Inspirasi Kamar Kos
                </Link>
              </li>
              <li>
                <Link href="/furniture" className="hover:text-emerald-600 transition-colors">
                  Katalog Perabotan Standar
                </Link>
              </li>
              <li>
                <Link href="/my-designs" className="hover:text-emerald-600 transition-colors">
                  Simpan Desain Ruangan
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-3">
              Kategori Ruang
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore?category=kamar-kos-minimalis" className="hover:text-emerald-600 transition-colors">
                  Kamar Kos 3x3 Minimalis
                </Link>
              </li>
              <li>
                <Link href="/explore?category=kamar-kos-estetik" className="hover:text-emerald-600 transition-colors">
                  Kamar Nuansa Earthy Estetik
                </Link>
              </li>
              <li>
                <Link href="/explore?category=ruang-belajar-produktif" className="hover:text-emerald-600 transition-colors">
                  Setup Ruang Belajar Skripsi
                </Link>
              </li>
              <li>
                <Link href="/explore?category=desain-hemat-budget" className="hover:text-emerald-600 transition-colors">
                  Dekorasi di Bawah 1 Juta
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-200 uppercase tracking-wider mb-3">
              Komunitas
            </h4>
            <p className="text-xs text-stone-500 mb-3 leading-relaxed">
              Punya ide penataan kamar kost yang menarik? Bagikan kreasi dan rincian budget-mu sekarang!
            </p>
            <Link
              href="/ideas/new"
              className="inline-block px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              Kirim Desain Kamarmu
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Akalin. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat untuk mahasiswa dan pejuang ruang mungil di Indonesia <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

