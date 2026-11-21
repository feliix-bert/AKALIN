"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert, Loader2, ArrowLeft, LogOut, Lock, ShieldCheck } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    id: string;
    email?: string;
    display_name?: string;
    role?: "user" | "admin";
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyAdminAuth() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Check if Supabase is running in local fallback / demo mode (unconfigured)
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
          if (!url || url.includes("placeholder")) {
            if (isMounted) {
              setAuthorized(true);
              setChecking(false);
            }
            return;
          }

          // Not authenticated with active Supabase -> redirect to login with return path
          if (isMounted) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
          }
          return;
        }

        // Query user's role from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, display_name, role")
          .eq("id", user.id)
          .single();

        if (!isMounted) return;

        setUserProfile({
          id: user.id,
          email: user.email,
          display_name: profile?.display_name || user.email?.split("@")[0] || "User",
          role: profile?.role || "user",
        });

        if (profile?.role === "admin") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.error("[Admin Auth Guard] Error checking permissions:", err);
        // Fallback: allow if in demo mode, otherwise block
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!url || url.includes("placeholder")) {
          if (isMounted) setAuthorized(true);
        } else {
          if (isMounted) setAuthorized(false);
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    }

    verifyAdminAuth();

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login?redirect=/admin");
    router.refresh();
  };

  // 1. Loading State
  if (checking) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#009B75]/10 flex items-center justify-center mb-4">
          <Loader2 className="w-7 h-7 text-[#009B75] animate-spin" />
        </div>
        <h2 className="text-base font-bold text-[#25251F] dark:text-white">
          Memverifikasi Hak Akses...
        </h2>
        <p className="text-xs text-[#5E5E52] dark:text-stone-400 mt-1">
          Memeriksa otentikasi akun administrator AKALIN.
        </p>
      </div>
    );
  }

  // 2. Unauthorized State (Logged in but role !== 'admin')
  if (!authorized) {
    return (
      <div className="min-h-[85vh] bg-[#FAF8F5] dark:bg-[#121316] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/50 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
              403 • FORBIDDEN
            </span>
            <h1 className="text-2xl font-extrabold text-[#25251F] dark:text-white tracking-tight">
              Akses Ditolak
            </h1>
            <p className="text-xs text-[#5E5E52] dark:text-stone-300 leading-relaxed">
              Halaman ini hanya dapat diakses oleh akun dengan peran <strong>Administrator</strong>.
            </p>
          </div>

          {userProfile && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-left text-xs space-y-1.5">
              <div className="text-[11px] font-medium text-stone-500">Akun Anda saat ini:</div>
              <div className="font-bold text-[#25251F] dark:text-white">
                {userProfile.display_name} ({userProfile.email})
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-stone-500">Role:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                  {userProfile.role || "user"}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Ganti Akun ke Admin</span>
            </button>

            <Link
              href="/"
              className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#25251F] dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized State
  return (
    <div className="relative">
      {/* Top Banner identifying Admin Mode */}
      <div className="bg-[#25251F] text-white text-[11px] py-1.5 px-4 font-mono flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#009B75]" />
          <span className="font-bold tracking-wider uppercase text-[#009B75]">
            AKALIN ADMIN MODE
          </span>
          <span className="text-stone-400 hidden sm:inline">•</span>
          <span className="text-stone-400 hidden sm:inline">
            Logged in as {userProfile?.email || "admin@gmail.com"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="hover:text-stone-300 transition-colors text-[10px] underline"
          >
            Lihat Web Publik →
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
