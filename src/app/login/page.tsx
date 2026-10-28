"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // If placeholder or mock env, provide friendly offline/demo login
        if (
          process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
          authError.message.includes("fetch")
        ) {
          localStorage.setItem("akalin_demo_user", JSON.stringify({ email, role: "user" }));
          router.push("/explore");
          return;
        }
        setError(authError.message);
      } else {
        router.push("/explore");
      }
    } catch (err: any) {
      // Local fallback
      localStorage.setItem("akalin_demo_user", JSON.stringify({ email, role: "user" }));
      router.push("/explore");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: "user" | "admin") => {
    localStorage.setItem(
      "akalin_demo_user",
      JSON.stringify({
        email: role === "admin" ? "admin@akalin.id" : "anak_kos@akalin.id",
        role,
      })
    );
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-elevated space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <p className="text-xs text-stone-500 pt-1">
            Akses desain 3D kamarmu dan simpan ide penataan favorit.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@kampus.ac.id"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Masuk</span>}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <span className="text-[10px] text-stone-400 text-center block uppercase tracking-wider font-semibold">
            Atau Coba Instan (Demo Mode)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("user")}
              className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-[11px] font-medium text-stone-700 dark:text-stone-300"
            >
              Akun Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100 text-[11px] font-medium text-emerald-800 dark:text-emerald-300"
            >
              Akun Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

