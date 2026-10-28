export type UserRole = "user" | "admin";
export type InspirationStatus = "pending" | "published" | "rejected";
export type RoomVisibility = "private" | "public";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name?: string;
  created_at?: string;
}

export type FurnitureCategory =
  | "bed"
  | "desk"
  | "chair"
  | "wardrobe"
  | "storage"
  | "sofa"
  | "table"
  | "lighting"
  | "decor";

export interface FurnitureItem {
  id: string;
  name: string;
  slug: string;
  category: FurnitureCategory;
  description: string;
  width: number; // in meters (X axis)
  depth: number; // in meters (Z axis)
  height: number; // in meters (Y axis)
  thumbnail_url: string;
  model_url?: string | null;
  model_type: "procedural" | "glb";
  price_estimate: number; // in IDR
  is_active: boolean;
  color?: string;
  created_at?: string;
}

export interface PlacedFurniture {
  instanceId: string; // unique UUID per placed item in scene
  furnitureId: string;
  name: string;
  category: FurnitureCategory;
  position: [number, number, number]; // [x, y, z] in 3D world units (meters)
  rotation: [number, number, number]; // [x, y, z] in radians
  dimensions: [number, number, number]; // [width, height, depth]
  color?: string;
}

export interface RoomLightingConfig {
  ambientIntensity: number;
  directionalIntensity: number;
  sunPosition: [number, number, number];
  preset: "daylight" | "warm" | "night";
}

export interface RoomCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export interface SceneData {
  items: PlacedFurniture[];
  lighting: RoomLightingConfig;
  camera?: RoomCameraConfig;
  floorTexture?: "wood" | "tiles" | "concrete" | "carpet";
}

export interface RoomDesign {
  id: string;
  owner_id: string;
  title: string;
  room_type: string;
  room_length: number; // in meters
  room_width: number; // in meters
  wall_height: number; // in meters
  floor_color: string;
  wall_color: string;
  scene_data: SceneData;
  visibility: RoomVisibility;
  preview_image_url?: string;
  created_at: string;
  updated_at: string;
  owner?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface Inspiration {
  id: string;
  author_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  gallery_images: string[];
  estimated_budget: number;
  room_length?: number;
  room_width?: number;
  materials: { name: string; estimate?: string }[];
  instructions: { step: number; title: string; description: string }[];
  room_design_id?: string;
  status: InspirationStatus;
  likes_count: number;
  saves_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    display_name: string;
    avatar_url?: string;
  };
  category?: Category;
  is_saved?: boolean;
}

export interface RoomPreset {
  id: string;
  name: string;
  description: string;
  length: number;
  width: number;
  height: number;
  type: string;
  tag: string;
}
