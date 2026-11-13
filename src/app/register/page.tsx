"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Lock, Mail, User, Loader2, CheckCircle2, MailCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/explore`,
        },
      });

      if (signUpError) {
        // Map common Supabase errors to Indonesian
        const msg = signUpError.message;
        if (msg.includes("already registered") || msg.includes("already been registered")) {
          setError("Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.");
        } else if (msg.includes("Password")) {
          setError("Kata sandi terlalu lemah. Gunakan minimal 6 karakter.");
        } else if (msg.includes("invalid")) {
          setError("Format email tidak valid.");
        } else {
          setError(msg);
        }
        return;
      }

      // If email confirmation is required, Supabase won't create session immediately
      if (data?.user && !data?.session) {
        // Email confirmation required
        setEmailSent(true);
      } else {
        // Auto-confirmed (email confirm disabled in Supabase settings)
        router.push("/explore");
        router.refresh();
      }
    } catch (err: unknown) {
      setError("Terjadi kesalahan. Silakan coba kembali.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-[85vh] bg-[#FAF8F5] dark:bg-[#121316] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-800 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#E0F5EE] flex items-center justify-center mx-auto">
            <MailCheck className="w-8 h-8 text-[#009B75]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#25251F] dark:text-white">
              Cek Email Kamu!
            </h2>
            <p className="text-xs text-[#5E5E52] dark:text-stone-300 mt-2 leading-relaxed">
              Kami mengirim link konfirmasi ke{" "}
              <span className="font-bold text-[#009B75]">{email}</span>.
              Buka email dan klik link konfirmasi untuk mengaktifkan akun Akalin-mu.
            </p>
          </div>
          <p className="text-[11px] text-[#5E5E52]">
            Sudah konfirmasi?{" "}
            <Link href="/login" className="font-bold text-[#009B75] hover:underline">
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] dark:bg-[#121316] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <p className="text-xs text-[#5E5E52] pt-1">
            Mulai rancang kamar impianmu dan bergabung dengan komunitas.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#25251F] dark:text-stone-300 block mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5E52]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rizky Pratama"
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-[#009B75]/30 focus:outline-none text-[#25251F] dark:text-white"
              />
            </div>
          </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-11 pr-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-[#009B75]/30 focus:outline-none text-[#25251F] dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Daftar Akun Akalin</span>}
          </button>
        </form>

        <p className="text-center text-xs text-[#5E5E52]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-[#009B75] hover:underline">
            Masuk Saja
          </Link>
        </p>
      </div>
    </div>
  );
}
