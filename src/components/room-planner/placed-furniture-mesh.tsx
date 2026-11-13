"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { PlacedFurniture } from "@/types";
import { useRoomStore } from "@/stores/useRoomStore";
import { ProceduralFurniture } from "./procedural-furniture";

interface PlacedFurnitureMeshProps {
  item: PlacedFurniture;
}

// ── GLB sub-component ──────────────────────────────────────────────────────
function GlbFurnitureMesh({
  url,
  dimensions,
}: {
  url: string;
  dimensions: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    // Auto-scale the loaded mesh to fit declared dimensions
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    if (size.x > 0 && size.y > 0 && size.z > 0) {
      const scaleX = dimensions[0] / size.x;
      const scaleY = dimensions[1] / size.y;
      const scaleZ = dimensions[2] / size.z;
      const uniform = Math.min(scaleX, scaleY, scaleZ);
      cloned.scale.set(uniform, uniform, uniform);
    }
    // Center the mesh on the origin, bottom at Y=0
    const newBox = new THREE.Box3().setFromObject(cloned);
    const center = newBox.getCenter(new THREE.Vector3());
    const minY = newBox.min.y;
    cloned.position.set(-center.x, -minY, -center.z);
  }, [cloned, dimensions]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cloned.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            (mesh.material as THREE.Material)?.dispose();
          }
        }
      });
    };
  }, [cloned]);

  return <primitive object={cloned} castShadow receiveShadow />;
}

// Fallback box shown while GLB loads
function GlbLoadingFallback({ dimensions }: { dimensions: [number, number, number] }) {
  return (
    <mesh>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial color="#A7AE91" roughness={0.8} wireframe />
    </mesh>
  );
}

export const PlacedFurnitureMesh: React.FC<PlacedFurnitureMeshProps> = ({ item }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const selectedId = useRoomStore((s) => s.selectedId);
  const collidingIds = useRoomStore((s) => s.collidingIds);
  const selectItem = useRoomStore((s) => s.selectItem);
  const updateItemPosition = useRoomStore((s) => s.updateItemPosition);
  const isPlacingNew = useRoomStore((s) => s.isPlacingNew);

  const isSelected = selectedId === item.instanceId;
  const isColliding = collidingIds.includes(item.instanceId);

  const { raycaster, camera, scene } = useThree();
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const planeIntersection = useRef(new THREE.Vector3());

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (isPlacingNew) return;
    e.stopPropagation();

    // Select this item
    selectItem(item.instanceId);
    setIsDragging(true);

    // Capture pointer
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || isPlacingNew) return;
    e.stopPropagation();

    // Raycast against the horizontal floor plane at Y = 0
    if (raycaster.ray.intersectPlane(dragPlane.current, planeIntersection.current)) {
      const hit = planeIntersection.current;
      updateItemPosition(item.instanceId, [hit.x, item.position[1], hit.z]);
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    }
  };

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={(e) => {
        if (!isPlacingNew) {
          e.stopPropagation();
          setIsHovered(true);
        }
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* 3D Visual Mesh — GLB or Procedural */}
      {item.model_url ? (
        <Suspense fallback={<GlbLoadingFallback dimensions={item.dimensions} />}>
          <GlbFurnitureMesh url={item.model_url} dimensions={item.dimensions} />
        </Suspense>
      ) : (
        <ProceduralFurniture
          category={item.category}
          dimensions={item.dimensions}
          color={item.color}
          isColliding={isColliding}
          isSelected={isSelected}
        />
      )}

      {/* Selection Bounding Highlight */}
      {isSelected && (
        <group>
          {/* Wireframe selection box */}
          <lineSegments position={[0, 0, 0]}>
            <edgesGeometry
              args={[
                new THREE.BoxGeometry(
                  item.dimensions[0] + 0.04,
                  item.dimensions[1] + 0.04,
                  item.dimensions[2] + 0.04
                ),
              ]}
            />
            <lineBasicMaterial
              color={isColliding ? "#EF4444" : "#10B981"}
              linewidth={2}
            />
          </lineSegments>

          {/* Glowing floor ring indicator */}
          <mesh
            position={[0, -item.dimensions[1] / 2 + 0.005, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[
                Math.max(item.dimensions[0], item.dimensions[2]) * 0.52,
                Math.max(item.dimensions[0], item.dimensions[2]) * 0.58,
                32,
              ]}
            />
            <meshBasicMaterial
              color={isColliding ? "#EF4444" : "#10B981"}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Hover ring (if not selected) */}
      {isHovered && !isSelected && !isPlacingNew && (
        <mesh
          position={[0, -item.dimensions[1] / 2 + 0.004, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry
            args={[
              Math.max(item.dimensions[0], item.dimensions[2]) * 0.5,
              Math.max(item.dimensions[0], item.dimensions[2]) * 0.54,
              32,
            ]}
          />
          <meshBasicMaterial
            color="#487A63"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

