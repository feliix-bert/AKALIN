"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import { useRoomStore } from "@/stores/useRoomStore";
import { PlacedFurnitureMesh } from "./placed-furniture-mesh";
import { ProceduralFurniture } from "./procedural-furniture";

export const RoomScene: React.FC = () => {
  const roomLength = useRoomStore((s) => s.roomLength); // Z axis
  const roomWidth = useRoomStore((s) => s.roomWidth); // X axis
  const wallHeight = useRoomStore((s) => s.wallHeight); // Y axis
  const floorColor = useRoomStore((s) => s.floorColor);
  const wallColor = useRoomStore((s) => s.wallColor);
  const floorTexture = useRoomStore((s) => s.floorTexture);
  const lighting = useRoomStore((s) => s.lighting);
  const showGrid = useRoomStore((s) => s.showGrid);
  const items = useRoomStore((s) => s.items);
  const isPlacingNew = useRoomStore((s) => s.isPlacingNew);
  const itemToPlace = useRoomStore((s) => s.itemToPlace);
  const placeItemAt = useRoomStore((s) => s.placeItemAt);
  const selectItem = useRoomStore((s) => s.selectItem);
  const cameraView = useRoomStore((s) => s.cameraView);

  const [hoverFloorPos, setHoverFloorPos] = useState<[number, number, number] | null>(null);

  const floorThickness = 0.1;
  const wallThickness = 0.1;

  // Handle floor clicks for deselecting or placing new item
  const handleFloorPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isPlacingNew && e.point) {
      setHoverFloorPos([e.point.x, 0, e.point.z]);
    }
  };

  const handleFloorPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isPlacingNew && hoverFloorPos) {
      placeItemAt(hoverFloorPos);
      setHoverFloorPos(null);
    } else {
      selectItem(null);
    }
  };

  // Lighting parameters based on preset
  const lightColor = lighting.preset === "warm" ? "#FFF2DE" : "#FFFFFF";
  const ambientColor = lighting.preset === "warm" ? "#FFEEDB" : "#F8FAFC";

  return (
    <>
      {/* CAMERA CONTROLS */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={cameraView === "top" ? 0.05 : Math.PI / 2 - 0.08}
        minDistance={1.5}
        maxDistance={22}
        target={[0, wallHeight * 0.3, 0]}
      />

      {/* LIGHTING & AMBIENCE */}
      <ambientLight intensity={lighting.ambientIntensity} color={ambientColor} />
      <directionalLight
        position={lighting.sunPosition}
        intensity={lighting.directionalIntensity}
        color={lightColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={25}
        shadow-camera-left={-roomWidth}
        shadow-camera-right={roomWidth}
        shadow-camera-top={roomLength}
        shadow-camera-bottom={-roomLength}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-lighting.sunPosition[0], lighting.sunPosition[1] * 0.8, -lighting.sunPosition[2]]}
        intensity={lighting.directionalIntensity * 0.3}
        color="#E2E8F0"
      />

      {/* ROOM FLOOR */}
      <mesh
        position={[0, -floorThickness / 2, 0]}
        receiveShadow
        onPointerMove={handleFloorPointerMove}
        onPointerDown={handleFloorPointerDown}
      >
        <boxGeometry args={[roomWidth, floorThickness, roomLength]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={floorTexture === "wood" ? 0.5 : floorTexture === "tiles" ? 0.3 : 0.9}
          metalness={floorTexture === "tiles" ? 0.1 : 0.02}
        />
      </mesh>

      {/* MEASUREMENT LABELS ALONG EDGES */}
      <group position={[0, 0.02, roomLength / 2 + 0.2]}>
        <Text
          fontSize={0.22}
          color="#64748B"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {`Lebar: ${roomWidth.toFixed(1)} m`}
        </Text>
      </group>

      <group position={[roomWidth / 2 + 0.25, 0.02, 0]}>
        <Text
          fontSize={0.22}
          color="#64748B"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        >
          {`Panjang: ${roomLength.toFixed(1)} m`}
        </Text>
      </group>

      {/* OPTIONAL MEASUREMENT GRID */}
      {showGrid && (
        <Grid
          position={[0, 0.005, 0]}
          args={[Math.max(roomWidth, roomLength) + 2, Math.max(roomWidth, roomLength) + 2]}
          cellSize={0.5}
          cellThickness={0.7}
          cellColor="#D1D5DB"
          sectionSize={1.0}
          sectionThickness={1.2}
          sectionColor="#9CA3AF"
          fadeDistance={20}
          fadeStrength={1.5}
        />
      )}

      {/* WALLS (ARCHITECTURAL CUTAWAY STYLE FOR PERFECT VISIBILITY) */}
      {/* Back Wall (-Z) */}
      <mesh
        position={[0, wallHeight / 2, -roomLength / 2 - wallThickness / 2]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[roomWidth + wallThickness * 2, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Left Wall (-X) */}
      <mesh
        position={[-roomWidth / 2 - wallThickness / 2, wallHeight / 2, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[wallThickness, wallHeight, roomLength]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Right Wall Cutaway Baseboard (+X) */}
      <mesh
        position={[roomWidth / 2 + wallThickness / 2, 0.15, 0]}
        receiveShadow
      >
        <boxGeometry args={[wallThickness, 0.3, roomLength]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Front Wall Cutaway Baseboard (+Z) */}
      <mesh
        position={[0, 0.15, roomLength / 2 + wallThickness / 2]}
        receiveShadow
      >
        <boxGeometry args={[roomWidth + wallThickness * 2, 0.3, wallThickness]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Baseboard trim around inner walls */}
      <mesh position={[0, 0.05, -roomLength / 2 + 0.01]}>
        <boxGeometry args={[roomWidth, 0.1, 0.02]} />
        <meshStandardMaterial color="#DDD5CA" roughness={0.7} />
      </mesh>
      <mesh position={[-roomWidth / 2 + 0.01, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.1, roomLength]} />
        <meshStandardMaterial color="#DDD5CA" roughness={0.7} />
      </mesh>

      {/* PLACED FURNITURE OBJECTS */}
      {items.map((item) => (
        <PlacedFurnitureMesh key={item.instanceId} item={item} />
      ))}

      {/* PLACING NEW ITEM PREVIEW (GHOST MESH) */}
      {isPlacingNew && itemToPlace && hoverFloorPos && (
        <group
          position={[hoverFloorPos[0], itemToPlace.height / 2, hoverFloorPos[2]]}
        >
          <mesh>
            <boxGeometry
              args={[
                itemToPlace.width + 0.05,
                itemToPlace.height + 0.05,
                itemToPlace.depth + 0.05,
              ]}
            />
            <meshBasicMaterial
              color="#10B981"
              wireframe
              transparent
              opacity={0.6}
            />
          </mesh>
          <ProceduralFurniture
            category={itemToPlace.category}
            dimensions={[itemToPlace.width, itemToPlace.height, itemToPlace.depth]}
            color={itemToPlace.color}
          />
        </group>
      )}
    </>
  );
};
