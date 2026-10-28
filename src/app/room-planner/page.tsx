"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { EditorToolbar } from "@/components/room-planner/editor-toolbar";
import { CatalogSidebar } from "@/components/room-planner/catalog-sidebar";
import { PropertiesSidebar } from "@/components/room-planner/properties-sidebar";
import { RoomSetupDialog } from "@/components/room-planner/room-setup-dialog";

// Dynamically import 3D canvas with SSR disabled to guarantee no server-side Three.js crashes
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

export default function RoomPlannerPage() {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"catalog" | "properties" | null>(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-stone-100 dark:bg-[#121316] overflow-hidden">
      {/* Top Navigation & Controls Toolbar */}
      <EditorToolbar
        onToggleCatalog={() =>
          setMobilePanel(mobilePanel === "catalog" ? null : "catalog")
        }
        onToggleProperties={() =>
          setMobilePanel(mobilePanel === "properties" ? null : "properties")
        }
      />

      {/* Main 3D Editor Work Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Furniture Catalog (Desktop) */}
        <div className="hidden md:block h-full">
          <CatalogSidebar />
        </div>

        {/* Center: Interactive 3D Canvas */}
        <main className="flex-1 h-full relative overflow-hidden">
          <RoomCanvas />
        </main>

        {/* Right Sidebar: Properties & Room Settings (Desktop) */}
        <div className="hidden md:block h-full">
          <PropertiesSidebar />
        </div>

        {/* Mobile Slide-over Drawer for Catalog */}
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

        {/* Mobile Slide-over Drawer for Properties */}
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

      {/* Room Setup Dialog (if user triggers new design initialization) */}
      <RoomSetupDialog
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onProceed={() => setIsSetupOpen(false)}
      />
    </div>
  );
}
