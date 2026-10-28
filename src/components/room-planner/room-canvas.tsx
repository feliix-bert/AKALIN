"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useRoomStore } from "@/stores/useRoomStore";
import { RoomScene } from "./room-scene";
import { Loader2 } from "lucide-react";

export const RoomCanvas: React.FC = () => {
  const cameraView = useRoomStore((s) => s.cameraView);
  const cameraResetKey = useRoomStore((s) => s.cameraResetKey);
  const roomLength = useRoomStore((s) => s.roomLength);
  const roomWidth = useRoomStore((s) => s.roomWidth);

  // Calculate default camera position based on room size
  const maxDim = Math.max(roomLength, roomWidth);
  const defaultCamPos: [number, number, number] =
    cameraView === "top"
      ? [0, maxDim * 2.5, 0.001]
      : [maxDim * 1.1, maxDim * 1.2, maxDim * 1.5];

  return (
    <div className="relative w-full h-full min-h-[450px] bg-[#ECE9E2] dark:bg-[#121316] overflow-hidden select-none">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-100/80 dark:bg-stone-900/80 z-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
              Menyiapkan Ruang 3D...
            </span>
          </div>
        }
      >
        <Canvas
          key={`${cameraView}-${cameraResetKey}`}
          shadows
          camera={{
            position: defaultCamPos,
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          className="canvas-container w-full h-full cursor-grab active:cursor-grabbing"
        >
          <RoomScene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default RoomCanvas;
