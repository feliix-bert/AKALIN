"use client";

import React from "react";
import { FurnitureCategory } from "@/types";

interface ProceduralFurnitureProps {
  category: FurnitureCategory;
  dimensions: [number, number, number]; // [width (X), height (Y), depth (Z)]
  color?: string;
  isColliding?: boolean;
  isSelected?: boolean;
}

export const ProceduralFurniture: React.FC<ProceduralFurnitureProps> = ({
  category,
  dimensions,
  color,
  isColliding,
  isSelected,
}) => {
  const [w, h, d] = dimensions;

  // Selection & collision feedback
  const overrideColor = isColliding ? "#EF4444" : undefined;

  switch (category) {
    case "bed":
      return (
        <group>
          {/* Bed Base / Frame */}
          <mesh position={[0, -h / 2 + 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.2, d]} />
            <meshStandardMaterial
              color={overrideColor || "#8B5A2B"}
              roughness={0.7}
            />
          </mesh>

          {/* Headboard */}
          <mesh
            position={[0, 0.05, -d / 2 + 0.05]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w, h * 0.7, 0.1]} />
            <meshStandardMaterial
              color={overrideColor || "#654321"}
              roughness={0.8}
            />
          </mesh>

          {/* Mattress */}
          <mesh
            position={[0, -h / 2 + 0.3, 0.05]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.94, 0.22, d * 0.88]} />
            <meshStandardMaterial
              color={overrideColor || "#F8F7F4"}
              roughness={0.9}
            />
          </mesh>

          {/* Blanket / Quilt */}
          <mesh
            position={[0, -h / 2 + 0.32, d * 0.12]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.95, 0.23, d * 0.55]} />
            <meshStandardMaterial
              color={overrideColor || color || "#496956"}
              roughness={0.8}
            />
          </mesh>

          {/* Pillows */}
          {w > 1.2 ? (
            // Double pillows for double bed
            <>
              <mesh
                position={[-w * 0.23, -h / 2 + 0.43, -d / 2 + 0.3]}
                rotation={[-0.2, 0, 0]}
                castShadow
              >
                <boxGeometry args={[w * 0.38, 0.12, 0.35]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
              </mesh>
              <mesh
                position={[w * 0.23, -h / 2 + 0.43, -d / 2 + 0.3]}
                rotation={[-0.2, 0, 0]}
                castShadow
              >
                <boxGeometry args={[w * 0.38, 0.12, 0.35]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
              </mesh>
            </>
          ) : (
            // Single pillow
            <mesh
              position={[0, -h / 2 + 0.43, -d / 2 + 0.3]}
              rotation={[-0.2, 0, 0]}
              castShadow
            >
              <boxGeometry args={[w * 0.65, 0.12, 0.35]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
          )}
        </group>
      );

    case "desk":
      const legThickness = 0.04;
      const legHeight = h - 0.04;
      return (
        <group>
          {/* Tabletop */}
          <mesh position={[0, h / 2 - 0.02, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.04, d]} />
            <meshStandardMaterial
              color={overrideColor || color || "#C29B6C"}
              roughness={0.5}
            />
          </mesh>

          {/* 4 Legs */}
          {[
            [-w / 2 + 0.04, -d / 2 + 0.04],
            [w / 2 - 0.04, -d / 2 + 0.04],
            [-w / 2 + 0.04, d / 2 - 0.04],
            [w / 2 - 0.04, d / 2 - 0.04],
          ].map(([lx, lz], i) => (
            <mesh
              key={i}
              position={[lx, -0.02, lz]}
              castShadow
            >
              <boxGeometry args={[legThickness, legHeight, legThickness]} />
              <meshStandardMaterial color="#2B2B2B" roughness={0.6} />
            </mesh>
          ))}

          {/* Side Drawer Unit */}
          <mesh
            position={[w / 2 - 0.18, 0.05, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.3, 0.4, d * 0.9]} />
            <meshStandardMaterial
              color={overrideColor || "#A47B4C"}
              roughness={0.7}
            />
          </mesh>

          {/* Laptop Prop */}
          <mesh position={[-0.05, h / 2 + 0.01, 0]} castShadow>
            <boxGeometry args={[0.3, 0.015, 0.2]} />
            <meshStandardMaterial color="#666666" metalness={0.8} />
          </mesh>
        </group>
      );

    case "chair":
      return (
        <group>
          {/* Seat Cushion */}
          <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.75, 0.08, d * 0.75]} />
            <meshStandardMaterial
              color={overrideColor || color || "#2B2B2B"}
              roughness={0.8}
            />
          </mesh>

          {/* Backrest */}
          <mesh
            position={[0, h * 0.22, -d * 0.32]}
            rotation={[-0.05, 0, 0]}
            castShadow
          >
            <boxGeometry args={[w * 0.7, h * 0.42, 0.05]} />
            <meshStandardMaterial
              color={overrideColor || color || "#1A1A1A"}
              roughness={0.9}
            />
          </mesh>

          {/* Central Stem */}
          <mesh position={[0, -h * 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, h * 0.35, 12]} />
            <meshStandardMaterial color="#555555" metalness={0.8} />
          </mesh>

          {/* 5-Star Caster Base */}
          <mesh position={[0, -h / 2 + 0.04, 0]} castShadow>
            <cylinderGeometry args={[w * 0.4, w * 0.4, 0.03, 5]} />
            <meshStandardMaterial color="#222222" metalness={0.7} />
          </mesh>
        </group>
      );

    case "wardrobe":
      return (
        <group>
          {/* Main Body */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={overrideColor || color || "#E6DFD5"}
              roughness={0.8}
            />
          </mesh>

          {/* Door divider groove */}
          <mesh position={[0, 0, d / 2 + 0.002]}>
            <boxGeometry args={[0.01, h * 0.95, 0.005]} />
            <meshStandardMaterial color="#333333" />
          </mesh>

          {/* Left Handle */}
          <mesh position={[-0.05, 0, d / 2 + 0.02]} castShadow>
            <boxGeometry args={[0.02, 0.2, 0.02]} />
            <meshStandardMaterial color="#222222" metalness={0.9} />
          </mesh>

          {/* Right Handle */}
          <mesh position={[0.05, 0, d / 2 + 0.02]} castShadow>
            <boxGeometry args={[0.02, 0.2, 0.02]} />
            <meshStandardMaterial color="#222222" metalness={0.9} />
          </mesh>
        </group>
      );

    case "storage":
      // Bookshelf or cabinet
      const shelfCount = 4;
      const shelfHeight = h / (shelfCount + 1);
      return (
        <group>
          {/* Left and Right Side Panels */}
          <mesh position={[-w / 2 + 0.02, 0, 0]} castShadow>
            <boxGeometry args={[0.03, h, d]} />
            <meshStandardMaterial
              color={overrideColor || color || "#A67C52"}
              roughness={0.7}
            />
          </mesh>
          <mesh position={[w / 2 - 0.02, 0, 0]} castShadow>
            <boxGeometry args={[0.03, h, d]} />
            <meshStandardMaterial
              color={overrideColor || color || "#A67C52"}
              roughness={0.7}
            />
          </mesh>
          {/* Back panel */}
          <mesh position={[0, 0, -d / 2 + 0.01]} castShadow>
            <boxGeometry args={[w, h, 0.02]} />
            <meshStandardMaterial
              color={overrideColor || color || "#8B653E"}
              roughness={0.8}
            />
          </mesh>

          {/* Shelves */}
          {Array.from({ length: shelfCount }).map((_, i) => (
            <group key={i} position={[0, -h / 2 + (i + 1) * shelfHeight, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[w - 0.04, 0.025, d]} />
                <meshStandardMaterial
                  color={overrideColor || "#B88E5A"}
                  roughness={0.7}
                />
              </mesh>
              {/* Colorful Books on some shelves */}
              {i % 2 === 0 && (
                <mesh position={[-w * 0.2, 0.1, 0]} castShadow>
                  <boxGeometry args={[0.15, 0.18, d * 0.6]} />
                  <meshStandardMaterial
                    color={i === 0 ? "#436856" : "#D95D39"}
                    roughness={0.8}
                  />
                </mesh>
              )}
            </group>
          ))}
        </group>
      );

    case "sofa":
      return (
        <group>
          {/* Main Seat Cushion */}
          <mesh position={[0, -h * 0.15, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.88, h * 0.35, d * 0.75]} />
            <meshStandardMaterial
              color={overrideColor || color || "#8D9B91"}
              roughness={0.9}
            />
          </mesh>

          {/* Back Cushion */}
          <mesh
            position={[0, h * 0.18, -d / 2 + 0.12]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.88, h * 0.55, 0.2]} />
            <meshStandardMaterial
              color={overrideColor || color || "#8D9B91"}
              roughness={0.9}
            />
          </mesh>

          {/* Left Armrest */}
          <mesh
            position={[-w / 2 + 0.08, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.15, h * 0.6, d * 0.85]} />
            <meshStandardMaterial
              color={overrideColor || color || "#76867B"}
              roughness={0.9}
            />
          </mesh>

          {/* Right Armrest */}
          <mesh
            position={[w / 2 - 0.08, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.15, h * 0.6, d * 0.85]} />
            <meshStandardMaterial
              color={overrideColor || color || "#76867B"}
              roughness={0.9}
            />
          </mesh>

          {/* 4 Wooden Feet */}
          {[
            [-w / 2 + 0.1, -d / 2 + 0.1],
            [w / 2 - 0.1, -d / 2 + 0.1],
            [-w / 2 + 0.1, d / 2 - 0.1],
            [w / 2 - 0.1, d / 2 - 0.1],
          ].map(([fx, fz], idx) => (
            <mesh
              key={idx}
              position={[fx, -h / 2 + 0.05, fz]}
              castShadow
            >
              <cylinderGeometry args={[0.025, 0.015, 0.1, 8]} />
              <meshStandardMaterial color="#4A2E18" roughness={0.6} />
            </mesh>
          ))}
        </group>
      );

    case "table":
      // Nightstand or round coffee table
      const isRound = w === d;
      if (isRound) {
        return (
          <group>
            {/* Round Top */}
            <mesh position={[0, h / 2 - 0.02, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[w / 2, w / 2, 0.03, 32]} />
              <meshStandardMaterial
                color={overrideColor || color || "#C8A17D"}
                roughness={0.6}
              />
            </mesh>
            {/* 3 Tripod Legs */}
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rad, idx) => {
              const lx = Math.cos(rad) * (w * 0.35);
              const lz = Math.sin(rad) * (d * 0.35);
              return (
                <mesh
                  key={idx}
                  position={[lx, -0.02, lz]}
                  rotation={[0.1 * Math.sin(rad), 0, -0.1 * Math.cos(rad)]}
                  castShadow
                >
                  <cylinderGeometry args={[0.015, 0.01, h - 0.04, 8]} />
                  <meshStandardMaterial color="#222222" metalness={0.7} />
                </mesh>
              );
            })}
          </group>
        );
      } else {
        // Bedside nightstand
        return (
          <group>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial
                color={overrideColor || color || "#D5C8B8"}
                roughness={0.7}
              />
            </mesh>
            {/* Drawer handle */}
            <mesh position={[0, h * 0.15, d / 2 + 0.015]} castShadow>
              <boxGeometry args={[0.08, 0.02, 0.02]} />
              <meshStandardMaterial color="#333333" metalness={0.8} />
            </mesh>
          </group>
        );
      }

    case "lighting":
      return (
        <group>
          {/* Tripod Legs */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rad, i) => {
            const rx = Math.cos(rad) * 0.22;
            const rz = Math.sin(rad) * 0.22;
            return (
              <mesh
                key={i}
                position={[rx, -h * 0.2, rz]}
                rotation={[0.08 * Math.sin(rad), 0, -0.08 * Math.cos(rad)]}
                castShadow
              >
                <cylinderGeometry args={[0.012, 0.01, h * 0.7, 8]} />
                <meshStandardMaterial color="#5C4033" roughness={0.7} />
              </mesh>
            );
          })}

          {/* Lampshade */}
          <mesh
            position={[0, h / 2 - 0.18, 0]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.16, 0.2, 0.32, 24]} />
            <meshStandardMaterial
              color={overrideColor || "#FFF8EE"}
              roughness={0.9}
            />
          </mesh>

          {/* Warm glow mesh */}
          <mesh position={[0, h / 2 - 0.18, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#FFECB3" />
          </mesh>
        </group>
      );

    case "decor":
      // Rug / Carpet
      return (
        <mesh position={[0, -h / 2 + 0.01, 0]} receiveShadow>
          <boxGeometry args={[w, 0.02, d]} />
          <meshStandardMaterial
            color={overrideColor || color || "#D4CFC7"}
            roughness={0.95}
          />
        </mesh>
      );

    default:
      // Generic box fallback
      return (
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color={overrideColor || color || "#94A3B8"}
            roughness={0.7}
          />
        </mesh>
      );
  }
};
