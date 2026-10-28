"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Box,
  Layers,
  Bookmark,
  PlusCircle,
  Menu,
  X,
  Shield,
  User,
  ArrowRight,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in 3D planner fullscreen, navbar can be omitted
  if (pathname.startsWith("/room-planner")) {
    return null;
  }

  const navLinks = [
    { label: "Jelajah", href: "/explore", icon: Compass },
    { label: "Katalog Perabotan", href: "/furniture", icon: Layers },
    { label: "Planner 3D", href: "/room-planner", icon: Box, highlight: true },
    { label: "Desain Saya", href: "/my-designs", icon: Bookmark },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900 shadow-sm group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5 text-emerald-400 dark:text-emerald-700" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-stone-900 dark:text-stone-100 leading-none">
                Akalin<span className="text-emerald-600">.</span>
              </span>
              <span className="text-[10px] text-stone-500 font-medium tracking-wide">
                Ruang Kos Cerdas
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    link.highlight
                      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md"
                      : isActive
                      ? "bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Submit Idea, Saved, Admin & Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/ideas/new"
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bagikan Ide</span>
            </Link>

            <Link
              href="/saved"
              className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Inspirasi Tersimpan"
            >
              <Bookmark className="w-4 h-4" />
            </Link>

            <Link
              href="/admin"
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4" />
            </Link>

            <div className="w-[1px] h-5 bg-stone-200 dark:bg-stone-800 mx-1" />

            <Link
              href="/login"
              className="text-xs font-semibold px-3 py-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-900"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 transition-all shadow-sm"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/room-planner"
              className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-medium"
            >
              Planner 3D
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1C20] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
            <Link
              href="/ideas/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Bagikan Ide Desain</span>
            </Link>
            <Link
              href="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100"
            >
              <Bookmark className="w-4 h-4 text-stone-400" />
              <span>Inspirasi Tersimpan</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-100"
            >
              <Shield className="w-4 h-4 text-stone-400" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="pt-4 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold rounded-xl border border-stone-200 text-stone-700"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-semibold rounded-xl bg-stone-900 text-white"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
