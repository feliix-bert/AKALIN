"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";
import {
  Compass,
  Box,
  Layers,
  Bookmark,
  PlusCircle,
  Menu,
  X,
  ArrowRight,
  LogOut,
  ChevronDown,
  Sparkles,
  User,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  display_name: string;
  avatar_url?: string;
  role: "user" | "admin";
}

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, role")
        .eq("id", userId)
        .single();
      if (data) setProfile(data as Profile);
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      if (user) fetchProfile(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        fetchProfile(newUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menus on outside click or ESC key
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  // If in 3D planner fullscreen, navbar can be omitted
  if (pathname.startsWith("/room-planner")) {
    return null;
  }

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Jelajah", href: "/explore", icon: Compass },
    { label: "Katalog Perabotan", href: "/furniture", icon: Layers },
    { label: "Planner 3D", href: "/room-planner", icon: Box, highlight: true },
    { label: "Desain Saya", href: "/my-designs", icon: Bookmark },
  ];

  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 dark:bg-[#121316]/95 backdrop-blur-md border-b border-[#25251F]/10 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* 1. Left: Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <Logo size="md" />
              </Link>
            </div>

            {/* 2. Center: Desktop Pill Navigation (Shown on lg and above) */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#F0EEE7]/80 dark:bg-stone-900/80 p-1 rounded-full border border-[#25251F]/10 dark:border-stone-800 shrink-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 xl:gap-2 transition-all ${
                      link.highlight
                        ? "bg-[#009B75] hover:bg-[#007D5E] text-white shadow-xs"
                        : isActive
                        ? "bg-white dark:bg-stone-800 text-[#25251F] dark:text-white shadow-2xs font-bold"
                        : "text-[#25251F]/75 dark:text-stone-300 hover:text-[#25251F] dark:hover:text-white hover:bg-white/60 dark:hover:bg-stone-800/50"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          link.highlight ? "text-[#F4D35E]" : ""
                        }`}
                      />
                    )}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* 3. Right: Desktop Actions & Auth (Shown on lg and above) */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              {/* Bagikan Ide (full pill on xl, compact on lg) */}
              <Link
                href="/ideas/new"
                className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#25251F]/15 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-[#25251F] dark:text-stone-200 hover:border-[#009B75] hover:text-[#009B75] transition-colors shadow-2xs"
                title="Bagikan Inspirasi Kamar"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#009B75]" />
                <span>Bagikan Ide</span>
              </Link>

              {/* Bookmark Icon */}
              <Link
                href="/saved"
                className="p-2.5 rounded-full bg-white dark:bg-stone-800 border border-[#25251F]/10 dark:border-stone-700 text-[#25251F] dark:text-stone-300 hover:text-[#009B75] hover:border-[#009B75]/40 transition-colors shadow-2xs"
                title="Inspirasi Tersimpan"
                aria-label="Inspirasi Tersimpan"
              >
                <Bookmark className="w-4 h-4" />
              </Link>

              <div className="w-[1px] h-5 bg-[#25251F]/15 dark:bg-stone-800 mx-0.5" />

              {/* Auth Block */}
              {user ? (
                /* Authenticated User Menu */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-[#25251F]/15 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-[#009B75]/50 transition-colors shadow-2xs group cursor-pointer"
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                  >
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.display_name}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-[#009B75]/30"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#009B75] to-[#00C293] text-white flex items-center justify-center text-[11px] font-black shadow-2xs">
                        {initials}
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-[#25251F] dark:text-stone-100 max-w-[105px] truncate leading-tight">
                        {profile?.display_name ?? user.email?.split("@")[0]}
                      </span>
                      {profile?.role === "admin" && (
                        <span className="text-[9px] font-mono text-[#009B75] font-bold uppercase tracking-wider leading-none">
                          Admin
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#5E5E52] transition-transform duration-200 ${
                        userMenuOpen
                          ? "rotate-180 text-[#009B75]"
                          : "group-hover:text-[#25251F]"
                      }`}
                    />
                  </button>

                  {/* Dropdown Card */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 bg-[#FAF8F5]/80 dark:bg-stone-800/50 border-b border-[#25251F]/08 dark:border-stone-800">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-[#25251F] dark:text-white truncate">
                            {profile?.display_name ?? "Pengguna"}
                          </p>
                          {profile?.role === "admin" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#009B75]/10 text-[#009B75]">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#5E5E52] dark:text-stone-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href="/my-designs"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800 transition-colors"
                        >
                          <Box className="w-4 h-4 text-[#009B75]" />
                          <span>Desain Saya</span>
                        </Link>
                        <Link
                          href="/saved"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-[#009B75]" />
                          <span>Inspirasi Tersimpan</span>
                        </Link>
                        <Link
                          href="/ideas/new"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-[#009B75]" />
                          <span>Bagikan Ide Kamar</span>
                        </Link>
                      </div>

                      <div className="p-1.5 border-t border-[#25251F]/08 dark:border-stone-800">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated Clean Paired Pill */
                <div className="flex items-center gap-1 bg-[#F0EEE7]/70 dark:bg-stone-900/70 p-1 rounded-full border border-[#25251F]/10 dark:border-stone-800">
                  <Link
                    href="/login"
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full text-[#25251F] dark:text-stone-200 hover:text-[#009B75] hover:bg-white/80 dark:hover:bg-stone-800 transition-all"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="text-xs font-bold px-4 py-1.5 rounded-full bg-[#009B75] hover:bg-[#007D5E] text-white transition-all shadow-xs hover:shadow"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Tablet & Mobile Controls (Shown below lg) */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Quick 3D Planner CTA on Mobile & Tablet */}
              <Link
                href="/room-planner"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#009B75] text-white text-[11px] sm:text-xs font-bold shadow-xs active:scale-95 transition-transform"
              >
                <Box className="w-3.5 h-3.5 text-[#F4D35E]" />
                <span>Planner 3D</span>
              </Link>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 sm:p-2.5 rounded-2xl border border-[#25251F]/15 dark:border-stone-700 bg-white dark:bg-stone-800 text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800 transition-colors shadow-2xs"
                aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#009B75]" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 5. Mobile & Tablet Menu Overlay & Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#25251F]/10 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#15171B] px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-150">
            {/* Header in Mobile Menu */}
            {user ? (
              /* Logged In User Card */
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#009B75]/30 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#009B75] to-[#00C293] text-white flex items-center justify-center text-sm font-black shrink-0 shadow-2xs">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-[#25251F] dark:text-white truncate">
                        {profile?.display_name ?? "Pengguna"}
                      </p>
                      {profile?.role === "admin" && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#009B75]/10 text-[#009B75]">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5E5E52] dark:text-stone-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 bg-[#009B75]/10 px-2 py-1 rounded-full">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#009B75]" />
                  <span className="text-[10px] font-mono text-[#009B75] font-bold">
                    Aktif
                  </span>
                </div>
              </div>
            ) : (
              /* Not Logged In Clean Welcome Card */
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E0F5EE] to-[#FAF8F5] dark:from-stone-900 dark:to-stone-900/60 border border-[#009B75]/25 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#009B75] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Sparkles className="w-4 h-4 text-[#F4D35E]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#25251F] dark:text-white">
                      Selamat Datang di Akalin
                    </h4>
                    <p className="text-[11px] text-[#5E5E52] dark:text-stone-300">
                      Simpan inspirasi & atur kamar kos secara 3D
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold rounded-xl border border-[#25251F]/15 dark:border-stone-700 bg-white dark:bg-stone-800 text-[#25251F] dark:text-stone-100 hover:bg-stone-50 transition-colors shadow-2xs"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold rounded-xl bg-[#009B75] hover:bg-[#007D5E] text-white transition-all shadow-xs flex items-center justify-center gap-1"
                  >
                    <span>Daftar Akun</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#009B75] text-white shadow-xs"
                        : link.highlight
                        ? "bg-white dark:bg-stone-800 border border-[#009B75]/30 text-[#25251F] dark:text-stone-100"
                        : "text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <Icon
                          className={`w-4 h-4 ${
                            link.highlight ? "text-[#F4D35E]" : ""
                          }`}
                        />
                      )}
                      <span>{link.label}</span>
                    </div>
                    {link.highlight && (
                      <span className="badge-butter text-[10px] px-2 py-0.5">
                        3D
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions & Bookmarks in Drawer */}
            <div className="pt-2 border-t border-[#25251F]/10 dark:border-stone-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/ideas/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#25251F]/10 dark:border-stone-700 text-xs font-bold text-[#25251F] dark:text-white hover:border-[#009B75]/50 transition-colors shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#009B75]" />
                  <span>Bagikan Ide</span>
                </Link>

                <Link
                  href="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#25251F]/10 dark:border-stone-700 text-xs font-bold text-[#25251F] dark:text-white hover:border-[#009B75]/50 transition-colors shadow-2xs"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#009B75]" />
                  <span>Tersimpan</span>
                </Link>
              </div>

              {/* Logout button if authenticated */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition-colors cursor-pointer mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akalin</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-xs z-30 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};
