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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

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
    <nav className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 dark:bg-[#121316]/95 backdrop-blur-md border-b border-[#25251F]/10 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size="md" />
              <div className="hidden sm:flex flex-col border-l border-[#25251F]/15 dark:border-stone-800 pl-3">
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#009B75] font-mono">
                  Ruang Kos Cerdas
                </span>
                <span className="text-[10px] text-[#5E5E52] dark:text-stone-400 font-sans">
                  3D Spatial Interior Planner
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-[#F0EEE7]/80 dark:bg-stone-900/80 p-1.5 rounded-full border border-[#25251F]/10 dark:border-stone-800">
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                    link.highlight
                      ? "bg-[#009B75] hover:bg-[#006B52] text-white shadow-sm"
                      : isActive
                      ? "bg-white dark:bg-stone-800 text-[#25251F] dark:text-white shadow-xs font-bold"
                      : "text-[#25251F]/80 dark:text-stone-300 hover:text-[#25251F] dark:hover:text-white hover:bg-white/60 dark:hover:bg-stone-800/50"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3.5 h-3.5 ${link.highlight ? "text-[#F4D35E]" : ""}`}
                    />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Actions & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/ideas/new"
              className="px-3.5 py-2 rounded-full border border-[#25251F]/15 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-[#25251F] dark:text-stone-200 hover:border-[#009B75] hover:text-[#009B75] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#009B75]" />
              <span>Bagikan Ide</span>
            </Link>

            <Link
              href="/saved"
              className="p-2.5 rounded-full bg-white dark:bg-stone-800 border border-[#25251F]/10 dark:border-stone-700 text-[#25251F] dark:text-stone-300 hover:text-[#009B75] transition-colors shadow-2xs"
              title="Inspirasi Tersimpan"
              aria-label="Inspirasi Tersimpan"
            >
              <Bookmark className="w-4 h-4" />
            </Link>

            <div className="w-[1px] h-5 bg-[#25251F]/15 dark:bg-stone-800 mx-1" />

            {user ? (
              /* Authenticated */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-[#25251F]/15 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-[#009B75]/50 transition-colors shadow-2xs"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#009B75] text-white flex items-center justify-center text-[10px] font-black">
                      {initials}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#25251F] dark:text-stone-100 max-w-[90px] truncate">
                    {profile?.display_name ?? user.email?.split("@")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-[#5E5E52] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white dark:bg-stone-900 border border-[#25251F]/10 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#25251F]/08 dark:border-stone-800">
                      <p className="text-xs font-black text-[#25251F] dark:text-white truncate">
                        {profile?.display_name ?? "Pengguna"}
                      </p>
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
                        Desain Saya
                      </Link>
                      <Link
                        href="/saved"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-[#009B75]" />
                        Inspirasi Tersimpan
                      </Link>
                      <Link
                        href="/ideas/new"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#009B75]" />
                        Bagikan Ide
                      </Link>
                    </div>
                    <div className="p-1.5 border-t border-[#25251F]/08 dark:border-stone-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not Authenticated */
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold px-3 py-2 text-[#25251F] dark:text-stone-300 hover:text-[#009B75] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-bold px-5 py-2.5 rounded-full bg-[#25251F] dark:bg-stone-100 text-white dark:text-[#25251F] hover:bg-black transition-all shadow-sm"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/room-planner"
              className="px-3.5 py-1.5 rounded-full bg-[#009B75] text-white text-xs font-bold shadow-xs"
            >
              Planner 3D
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800 transition-colors"
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#25251F]/10 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#1A1C20] px-4 pt-3 pb-6 space-y-2">
          {/* Mobile user info */}
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl bg-white dark:bg-stone-800 border border-[#25251F]/10">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#009B75] text-white flex items-center justify-center text-xs font-black shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-black text-[#25251F] dark:text-white truncate">
                  {profile?.display_name ?? "Pengguna"}
                </p>
                <p className="text-[10px] text-[#5E5E52] dark:text-stone-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

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
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-[#009B75] text-white"
                    : link.highlight
                    ? "bg-white dark:bg-stone-800 border border-[#009B75]/30 text-[#25251F] dark:text-stone-100"
                    : "text-[#25251F] dark:text-stone-200 hover:bg-[#F0EEE7] dark:hover:bg-stone-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 ${link.highlight ? "text-[#F4D35E]" : ""}`}
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

          <div className="pt-3 border-t border-[#25251F]/10 dark:border-stone-800 space-y-2">
            <Link
              href="/ideas/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-[#25251F]/10 text-xs font-bold text-[#25251F] dark:text-white"
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#009B75]" />
                <span>Bagikan Ide Kamar</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5E5E52]" />
            </Link>

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold border border-rose-200 rounded-full text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Akalin
              </button>
            ) : (
              <div className="flex items-center gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold border border-[#25251F]/15 dark:border-stone-700 rounded-full text-[#25251F] dark:text-stone-200 bg-white dark:bg-stone-800"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold bg-[#009B75] text-white rounded-full shadow-sm"
                >
                  Daftar Akun
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
