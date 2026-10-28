"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DataService } from "@/lib/data-service";
import { Category } from "@/types";
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
      const cats = await DataService.getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setValue("category_id", cats[0].id);
      }
    }
    fetchCats();
  }, [setValue]);

  const onSubmit = async (data: InspirationFormData) => {
    setSubmitting(true);
    try {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await DataService.createInspiration({
        author_id: "user-current",
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
        status: "pending", // Pending admin moderation as required!
        author: {
          display_name: "Mahasiswa Kreatif",
        },
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full space-y-6">
      {/* Top back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Formulir Komunitas
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
          Bagikan Inspirasi Desain Kamarmu
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Bantu sesama anak kos menata kamar dengan membagikan foto, rincian budget, dan langkah penataanmu.
        </p>
      </div>

      {submittedSuccess ? (
        <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
            Inspirasi Berhasil Dikirim!
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
            Karyamu telah masuk antrean moderasi admin (status: pending). Setelah disetujui, inspirasi akan tampil di galeri publik.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section: Main Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Judul Inspirasi *
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="Contoh: Kamar Kos 3x3 Japandi Estetik Hemat Tempat"
                className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-emerald-600/30 focus:outline-none text-stone-900 dark:text-stone-100"
              />
              {errors.title && (
                <span className="text-[11px] text-red-500 mt-1 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Kategori *
                </label>
                <select
                  {...register("category_id")}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none cursor-pointer text-stone-800 dark:text-stone-200"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Perkiraan Total Budget (IDR) *
                </label>
                <input
                  type="number"
                  {...register("estimated_budget", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Deskripsi Lengkap *
              </label>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Ceritakan konsep ruangan, trik pencahayaan, atau penataan ruang simpan..."
                className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
              />
              {errors.description && (
                <span className="text-[11px] text-red-500 mt-1 block">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                URL Foto Cover *
              </label>
              <input
                type="url"
                {...register("cover_image_url")}
                placeholder="https://..."
                className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none font-mono"
              />
            </div>

            {/* Room Dimensions */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Panjang Ruangan (meter)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("room_length", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Lebar Ruangan (meter)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("room_width", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Materials List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Daftar Perabotan & Bahan
              </h3>
              <button
                type="button"
                onClick={() => appendMaterial({ name: "", estimate: "" })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium hover:bg-stone-50"
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
                    className="flex-1 px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                  />
                  <input
                    type="text"
                    {...register(`materials.${index}.estimate` as const)}
                    placeholder="Est. harga (opsional)"
                    className="w-36 px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-stone-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Step-by-Step Instructions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2126] border border-stone-200/80 dark:border-stone-800 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium hover:bg-stone-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Langkah</span>
              </button>
            </div>

            <div className="space-y-4">
              {instructionFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">
                      Langkah {index + 1}
                    </span>
                    {instructionFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="text-stone-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    {...register(`instructions.${index}.title` as const)}
                    placeholder="Judul langkah"
                    className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    {...register(`instructions.${index}.description` as const)}
                    placeholder="Penjelasan detail..."
                    className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
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
              className="px-7 py-3.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{submitting ? "Mengirimkan..." : "Kirimkan Inspirasi"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

