"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Lock, Mail, Loader2, Shield } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/explore";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Map Supabase errors to Indonesian
        const msg = authError.message;
        if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
          setError("Email atau kata sandi salah. Silakan periksa kembali.");
        } else if (msg.includes("Email not confirmed")) {
          setError("Email belum dikonfirmasi. Periksa inbox atau folder spam-mu.");
        } else if (msg.includes("Too many requests")) {
          setError("Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.");
        } else {
          setError(msg);
        }
        return;
      }

      // Check role - if user is admin and default redirect, take them straight to /admin
      if (authData?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profile?.role === "admin" && (!searchParams.get("redirect") || redirectTo === "/explore")) {
          router.push("/admin");
          router.refresh();
          return;
        }
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setError("Terjadi kesalahan koneksi. Silakan coba kembali.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] dark:bg-[#121316] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-800 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <p className="text-xs text-[#5E5E52] pt-1">
            Akses desain 3D kamarmu dan simpan ide penataan favorit.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#25251F] dark:text-stone-300 block mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5E52]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@kampus.ac.id"
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-[#009B75]/30 focus:outline-none text-[#25251F] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#25251F] dark:text-stone-300 block mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5E52]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-[#009B75]/30 focus:outline-none text-[#25251F] dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Masuk ke Akalin</span>}
          </button>
        </form>

        {/* Quick Admin Demo Helper */}
        <div className="pt-2 border-t border-[#25251F]/10 dark:border-stone-800">
          <button
            type="button"
            onClick={() => {
              setEmail("admin@gmail.com");
              setPassword("123456");
            }}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/90 dark:bg-amber-950/30 dark:hover:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-left">
              <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Login Cepat Admin: <code className="font-mono font-bold bg-amber-200/50 dark:bg-amber-900/40 px-1 py-0.5 rounded">admin@gmail.com</code></span>
            </div>
            <span className="text-[10px] underline font-bold text-amber-700 dark:text-amber-300 group-hover:text-amber-900 shrink-0">Isi Form</span>
          </button>
        </div>

        <p className="text-center text-xs text-[#5E5E52]">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-[#009B75] hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
