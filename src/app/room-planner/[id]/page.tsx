"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useRoomStore } from "@/stores/useRoomStore";
import { DataService } from "@/lib/data-service";
import { EditorToolbar } from "@/components/room-planner/editor-toolbar";
import { CatalogSidebar } from "@/components/room-planner/catalog-sidebar";
import { PropertiesSidebar } from "@/components/room-planner/properties-sidebar";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const RoomCanvas = dynamic(
  () => import("@/components/room-planner/room-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-900 text-stone-500 text-sm">
        Memuat Ruang 3D...
      </div>
    ),
  }
);

export default function RoomPlannerEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const loadDesign = useRoomStore((s) => s.loadDesign);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobilePanel, setMobilePanel] = useState<"catalog" | "properties" | null>(null);

  useEffect(() => {
    async function fetchDesign() {
      if (!id) return;
      try {
        const design = await DataService.getRoomDesignById(id);
        if (design) {
          loadDesign(design);
        } else {
          setError("Desain ruangan tidak ditemukan.");
        }
      } catch (err) {
        console.error("Failed to load design:", err);
        setError("Terjadi kesalahan saat memuat desain.");
      } finally {
        setLoading(false);
      }
    }
    fetchDesign();
  }, [id, loadDesign]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-3 bg-stone-50 dark:bg-[#121316]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
          Mempersiapkan Ruangan 3D...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-stone-50 dark:bg-[#121316] p-6 text-center">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">{error}</h2>
        <Link
          href="/my-designs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Desain Saya</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-stone-100 dark:bg-[#121316] overflow-hidden">
      <EditorToolbar
        onToggleCatalog={() =>
          setMobilePanel(mobilePanel === "catalog" ? null : "catalog")
        }
        onToggleProperties={() =>
          setMobilePanel(mobilePanel === "properties" ? null : "properties")
        }
      />

      <div className="flex-1 flex overflow-hidden relative">
        <div className="hidden md:block h-full">
          <CatalogSidebar />
        </div>

        <main className="flex-1 h-full relative overflow-hidden">
          <RoomCanvas />
        </main>

        <div className="hidden md:block h-full">
          <PropertiesSidebar />
        </div>

        {mobilePanel === "catalog" && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/40 flex">
            <div className="w-80 max-w-[85%] h-full bg-white dark:bg-stone-900 shadow-xl">
              <CatalogSidebar onCloseMobile={() => setMobilePanel(null)} />
            </div>
            <div
              className="flex-1 h-full"
              onClick={() => setMobilePanel(null)}
            />
          </div>
        )}

        {mobilePanel === "properties" && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/40 flex justify-end">
            <div
              className="flex-1 h-full"
              onClick={() => setMobilePanel(null)}
            />
            <div className="w-80 max-w-[85%] h-full bg-white dark:bg-stone-900 shadow-xl">
              <PropertiesSidebar onCloseMobile={() => setMobilePanel(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
