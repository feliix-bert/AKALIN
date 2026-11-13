"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DataService } from "@/lib/data-service";
import { Category } from "@/types";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Upload,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

const inspirationSchema = z.object({
  title: z
    .string()
    .min(5, "Judul inspirasi minimal 5 karakter")
    .max(100, "Judul maksimal 100 karakter"),
  category_id: z.string().min(1, "Pilih salah satu kategori"),
  description: z
    .string()
    .min(20, "Deskripsi minimal 20 karakter agar jelas bagi pembaca"),
  cover_image_url: z.string().url("Masukkan URL gambar yang valid"),
  estimated_budget: z
    .number({ invalid_type_error: "Budget harus berupa angka" })
    .min(0, "Budget tidak boleh minus"),
  room_length: z.number().min(1.0).max(15.0),
  room_width: z.number().min(1.0).max(15.0),
  materials: z.array(
    z.object({
      name: z.string().min(1, "Nama bahan/perabot tidak boleh kosong"),
      estimate: z.string().optional(),
    })
  ),
  instructions: z.array(
    z.object({
      step: z.number(),
      title: z.string().min(1, "Judul langkah tidak boleh kosong"),
      description: z.string().min(1, "Deskripsi langkah tidak boleh kosong"),
    })
  ),
});

type InspirationFormData = z.infer<typeof inspirationSchema>;

export default function NewInspirationPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [authError, setAuthError] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InspirationFormData>({
    resolver: zodResolver(inspirationSchema),
    defaultValues: {
      title: "",
      category_id: "",
      description: "",
      cover_image_url:
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format&fit=crop&q=80",
      estimated_budget: 1500000,
      room_length: 3.0,
      room_width: 3.0,
      materials: [
        { name: "Kasur Busa Single 90x200", estimate: "Rp 700.000" },
        { name: "Meja Belajar Minimalis", estimate: "Rp 350.000" },
      ],
      instructions: [
        {
          step: 1,
          title: "Bersihkan dan kosongkan ruangan",
          description: "Catat letak colokan listrik dan arah bukaan pintu utama.",
        },
      ],
    },
  });

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: "materials",
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "instructions",
  });

  useEffect(() => {
    async function fetchCats() {
      // Check auth — redirect to login if not logged in
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login?redirect=/ideas/new");
          return;
        }
      } catch {
        // If Supabase not configured, allow access (offline mode)
      }

      const cats = await DataService.getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setValue("category_id", cats[0].id);
      }
    }
    fetchCats();
  }, [setValue, router]);

  const onSubmit = async (data: InspirationFormData) => {
    setSubmitting(true);
    try {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await DataService.createInspiration({
        author_id: "user-current", // auto-resolved to real user.id inside DataService
        category_id: data.category_id,
        title: data.title,
        slug: slug + "-" + Date.now().toString().slice(-4),
        description: data.description,
        cover_image_url: data.cover_image_url,
        gallery_images: [data.cover_image_url],
        estimated_budget: data.estimated_budget,
        room_length: data.room_length,
        room_width: data.room_width,
        materials: data.materials.map((m) => ({ name: m.name, estimate: m.estimate || "" })),
        instructions: data.instructions,
        status: "pending",
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        router.push("/explore");
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirimkan inspirasi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#25251F] dark:text-stone-300 hover:text-[#009B75] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#009B75]">
            Formulir Komunitas
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#25251F] dark:text-white tracking-tight mt-1">
            Bagikan Inspirasi <span className="font-editorial-serif italic font-normal text-[#009B75]">Kamarmu.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5E52] dark:text-stone-300 mt-2 leading-relaxed">
            Bantu sesama anak kos menata kamar dengan membagikan foto, rincian budget, dan langkah penataan nyata.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="p-8 sm:p-12 rounded-[2rem] bg-[#E0F5EE] border border-[#009B75]/30 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#009B75] mx-auto" />
            <h2 className="text-xl font-extrabold text-[#006B52]">
              Inspirasi Berhasil Dikirim!
            </h2>
            <p className="text-xs sm:text-sm text-[#006B52] max-w-md mx-auto leading-relaxed">
              Karyamu telah masuk antrean moderasi admin (status: pending). Setelah diverifikasi, inspirasimu akan tampil di galeri publik.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section: Main Info */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-800 shadow-2xs space-y-5">
              <div>
                <label className="text-xs font-bold text-[#25251F] dark:text-white block mb-1.5">
                  Judul Inspirasi *
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="Contoh: Kamar Kos 3x3 Japandi Estetik Hemat Tempat"
                  className="w-full px-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-[#009B75]/30 focus:outline-none text-[#25251F] dark:text-white placeholder:text-[#5E5E52]"
                />
                {errors.title && (
                  <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#25251F] dark:text-white block mb-1.5">
                    Kategori *
                  </label>
                  <select
                    {...register("category_id")}
                    className="w-full px-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl focus:outline-none cursor-pointer text-[#25251F] dark:text-white font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#25251F] dark:text-white block mb-1.5">
                    Perkiraan Total Budget (IDR) *
                  </label>
                  <input
                    type="number"
                    {...register("estimated_budget", { valueAsNumber: true })}
                    className="w-full px-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl font-mono text-[#25251F] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#25251F] dark:text-white block mb-1.5">
                  Deskripsi Lengkap *
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  placeholder="Ceritakan konsep ruangan, posisi colokan listrik, atau tips penataan ruang simpan..."
                  className="w-full px-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl focus:outline-none text-[#25251F] dark:text-white placeholder:text-[#5E5E52]"
                />
                {errors.description && (
                  <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#25251F] dark:text-white block mb-1.5">
                  URL Foto Cover *
                </label>
                <input
                  type="url"
                  {...register("cover_image_url")}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl focus:outline-none font-mono text-[#25251F] dark:text-white"
                />
              </div>

              {/* Room Dimensions */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-[#25251F] dark:text-white block mb-1.5">
                    Panjang Ruangan (meter)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register("room_length", { valueAsNumber: true })}
                    className="w-full px-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl font-mono text-[#25251F] dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#25251F] dark:text-white block mb-1.5">
                    Lebar Ruangan (meter)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register("room_width", { valueAsNumber: true })}
                    className="w-full px-4 py-3 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-2xl font-mono text-[#25251F] dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section: Materials List */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#25251F] dark:text-white uppercase tracking-wider font-mono">
                  Daftar Perabotan & Bahan
                </h3>
                <button
                  type="button"
                  onClick={() => appendMaterial({ name: "", estimate: "" })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#25251F]/20 text-xs font-bold text-[#25251F] hover:bg-[#F0EEE7]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Item</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {materialFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      {...register(`materials.${index}.name` as const)}
                      placeholder="Nama perabot / bahan"
                      className="flex-1 px-4 py-2.5 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-xl focus:outline-none text-[#25251F] dark:text-white"
                    />
                    <input
                      type="text"
                      {...register(`materials.${index}.estimate` as const)}
                      placeholder="Est. harga (opsional)"
                      className="w-36 px-4 py-2.5 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#25251F]/15 dark:border-stone-700 rounded-xl focus:outline-none font-mono text-[#25251F] dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="p-2.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Step-by-Step Instructions */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#25251F] dark:text-white uppercase tracking-wider font-mono">
                  Langkah-Langkah Penataan
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendInstruction({
                      step: instructionFields.length + 1,
                      title: "",
                      description: "",
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#25251F]/20 text-xs font-bold text-[#25251F] hover:bg-[#F0EEE7]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Langkah</span>
                </button>
              </div>

              <div className="space-y-4">
                {instructionFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800/50 border border-[#25251F]/10 dark:border-stone-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#009B75] font-mono">
                        Langkah {index + 1}
                      </span>
                      {instructionFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstruction(index)}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      {...register(`instructions.${index}.title` as const)}
                      placeholder="Judul langkah (contoh: Posisikan kasur di sudut)"
                      className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-700 rounded-xl focus:outline-none text-[#25251F] dark:text-white font-semibold"
                    />
                    <textarea
                      rows={2}
                      {...register(`instructions.${index}.description` as const)}
                      placeholder="Penjelasan detail..."
                      className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-900 border border-[#25251F]/15 dark:border-stone-700 rounded-xl focus:outline-none text-[#25251F] dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-4 rounded-full bg-[#009B75] hover:bg-[#006B52] text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{submitting ? "Mengirimkan..." : "Kirimkan Inspirasi"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
