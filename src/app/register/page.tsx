"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Box, Lock, Mail, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        if (
          process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
          signUpError.message.includes("fetch")
        ) {
          localStorage.setItem(
            "akalin_demo_user",
            JSON.stringify({ email, display_name: name, role: "user" })
          );
          router.push("/explore");
          return;
        }
        setError(signUpError.message);
      } else {
        localStorage.setItem(
          "akalin_demo_user",
          JSON.stringify({ email, display_name: name, role: "user" })
        );
        router.push("/explore");
      }
    } catch (err: any) {
      localStorage.setItem(
        "akalin_demo_user",
        JSON.stringify({ email, display_name: name, role: "user" })
      );
      router.push("/explore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <Box className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Buat Akun Akalin
          </h1>
          <p className="text-xs text-stone-500">
            Mulai rancang kamar impianmu dan bergabung dengan komunitas.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rizky Pratama"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Daftar Akun</span>}
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
            Masuk Saja
          </Link>
        </p>
      </div>
    </div>
  );
}
