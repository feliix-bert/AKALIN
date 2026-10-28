import { create } from "zustand";
import {
  FurnitureCategory,
  FurnitureItem,
  PlacedFurniture,
  RoomDesign,
  RoomLightingConfig,
} from "@/types";
import { clampItemToRoomBounds, checkItemCollisions } from "@/lib/collision";

interface RoomStoreState {
  // Room Metadata & Dimensions
  designId: string | null;
  roomName: string;
  roomType: string;
  roomLength: number; // Z axis (meters)
  roomWidth: number; // X axis (meters)
  wallHeight: number; // Y axis (meters)
  floorColor: string;
  wallColor: string;
  floorTexture: "wood" | "tiles" | "concrete" | "carpet";

  // Lighting & Environment
  lighting: RoomLightingConfig;

  // Items in scene
  items: PlacedFurniture[];
  selectedId: string | null;
  collidingIds: string[];

  // Placement mode
  isPlacingNew: boolean;
  itemToPlace: FurnitureItem | null;

  // View & Grid
  showGrid: boolean;
  gridSnap: boolean;
  cameraView: "perspective" | "top" | "isometric";
  cameraResetKey: number;

  // Status
  hasUnsavedChanges: boolean;
  isSaving: boolean;

  // Actions
  initRoom: (params: {
    name: string;
    type: string;
    length: number;
    width: number;
    height: number;
  }) => void;
  loadDesign: (design: RoomDesign) => void;
  setDimensions: (length: number, width: number, height: number) => void;
  setFloorColor: (color: string) => void;
  setWallColor: (color: string) => void;
  setFloorTexture: (texture: "wood" | "tiles" | "concrete" | "carpet") => void;
  setLightingPreset: (preset: "daylight" | "warm" | "night") => void;

  // Item placement and manipulation
  startPlacing: (furniture: FurnitureItem) => void;
  cancelPlacing: () => void;
  placeItemAt: (pos: [number, number, number]) => void;
  selectItem: (id: string | null) => void;
  updateItemPosition: (id: string, newPos: [number, number, number]) => void;
  updateItemRotation: (id: string, rotY: number) => void;
  rotateSelectedItem: (angleRads?: number) => void;
  duplicateSelectedItem: () => void;
  deleteSelectedItem: () => void;

  // Scene UI controls
  toggleGrid: () => void;
  toggleGridSnap: () => void;
  setCameraView: (view: "perspective" | "top" | "isometric") => void;
  resetCamera: () => void;
  setHasUnsavedChanges: (val: boolean) => void;
  setIsSaving: (val: boolean) => void;
  clearScene: () => void;
}

export const useRoomStore = create<RoomStoreState>((set, get) => ({
  designId: null,
  roomName: "Kamar Kost Baru",
  roomType: "kos_standar",
  roomLength: 3.0,
  roomWidth: 3.0,
  wallHeight: 2.8,
  floorColor: "#DED6C9",
  wallColor: "#F7F5F0",
  floorTexture: "wood",

  lighting: {
    ambientIntensity: 0.7,
    directionalIntensity: 0.85,
    sunPosition: [5, 8, 5],
    preset: "daylight",
  },

  items: [],
  selectedId: null,
  collidingIds: [],

  isPlacingNew: false,
  itemToPlace: null,

  showGrid: true,
  gridSnap: true,
  cameraView: "perspective",
  cameraResetKey: 0,

  hasUnsavedChanges: false,
  isSaving: false,

  initRoom: ({ name, type, length, width, height }) => {
    set({
      designId: null,
      roomName: name,
      roomType: type,
      roomLength: Math.max(1.5, Math.min(15, length)),
      roomWidth: Math.max(1.5, Math.min(15, width)),
      wallHeight: Math.max(2.0, Math.min(5, height)),
      items: [],
      selectedId: null,
      collidingIds: [],
      hasUnsavedChanges: false,
    });
  },

  loadDesign: (design: RoomDesign) => {
    set({
      designId: design.id,
      roomName: design.title,
      roomType: design.room_type,
      roomLength: design.room_length,
      roomWidth: design.room_width,
      wallHeight: design.wall_height,
      floorColor: design.floor_color || "#DED6C9",
      wallColor: design.wall_color || "#F7F5F0",
      floorTexture: design.scene_data.floorTexture || "wood",
      lighting: design.scene_data.lighting || {
        ambientIntensity: 0.7,
        directionalIntensity: 0.85,
        sunPosition: [5, 8, 5],
        preset: "daylight",
      },
      items: design.scene_data.items || [],
      selectedId: null,
      collidingIds: [],
      hasUnsavedChanges: false,
    });
  },

  setDimensions: (length, width, height) => {
    const validL = Math.max(1.5, Math.min(15, length));
    const validW = Math.max(1.5, Math.min(15, width));
    const validH = Math.max(2.0, Math.min(5, height));

    const state = get();
    // Clamp all existing items to fit new dimensions
    const updatedItems = state.items.map((item) => {
      const clampedPos = clampItemToRoomBounds(
        item.position,
        item.rotation,
        item.dimensions,
        validW,
        validL
      );
      return {
        ...item,
        position: clampedPos,
      };
    });

    set({
      roomLength: validL,
      roomWidth: validW,
      wallHeight: validH,
      items: updatedItems,
      hasUnsavedChanges: true,
    });
  },

  setFloorColor: (color) => set({ floorColor: color, hasUnsavedChanges: true }),
  setWallColor: (color) => set({ wallColor: color, hasUnsavedChanges: true }),
  setFloorTexture: (texture) => set({ floorTexture: texture, hasUnsavedChanges: true }),

  setLightingPreset: (preset) => {
    let ambientIntensity = 0.7;
    let directionalIntensity = 0.85;
    let sunPosition: [number, number, number] = [5, 8, 5];

    if (preset === "warm") {
      ambientIntensity = 0.8;
      directionalIntensity = 0.6;
      sunPosition = [4, 6, 3];
    } else if (preset === "night") {
      ambientIntensity = 0.25;
      directionalIntensity = 0.3;
      sunPosition = [2, 4, 2];
    }

    set({
      lighting: {
        preset,
        ambientIntensity,
        directionalIntensity,
        sunPosition,
      },
      hasUnsavedChanges: true,
    });
  },

  startPlacing: (furniture) => {
    set({
      isPlacingNew: true,
      itemToPlace: furniture,
      selectedId: null,
    });
  },

  cancelPlacing: () => {
    set({
      isPlacingNew: false,
      itemToPlace: null,
    });
  },

  placeItemAt: (pos) => {
    const state = get();
    if (!state.itemToPlace) return;

    const furniture = state.itemToPlace;
    const dimensions: [number, number, number] = [
      furniture.width,
      furniture.height,
      furniture.depth,
    ];
    const rotation: [number, number, number] = [0, 0, 0];

    const clampedPos = clampItemToRoomBounds(
      pos,
      rotation,
      dimensions,
      state.roomWidth,
      state.roomLength
    );

    const newItem: PlacedFurniture = {
      instanceId: "inst-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      furnitureId: furniture.id,
      name: furniture.name,
      category: furniture.category as FurnitureCategory,
      position: clampedPos,
      rotation: rotation,
      dimensions: dimensions,
      color: furniture.color,
    };

    const nextItems = [...state.items, newItem];
    const collisions = checkItemCollisions(newItem, nextItems);

    set({
      items: nextItems,
      selectedId: newItem.instanceId,
      isPlacingNew: false,
      itemToPlace: null,
      collidingIds: collisions,
      hasUnsavedChanges: true,
    });
  },

  selectItem: (id) => {
    const state = get();
    if (!id) {
      set({ selectedId: null, collidingIds: [] });
      return;
    }
    const item = state.items.find((i) => i.instanceId === id);
    const collisions = item ? checkItemCollisions(item, state.items) : [];
    set({ selectedId: id, collidingIds: collisions });
  },

  updateItemPosition: (id, newPos) => {
    const state = get();
    const item = state.items.find((i) => i.instanceId === id);
    if (!item) return;

    let targetX = newPos[0];
    let targetZ = newPos[2];

    // Optional 0.05m grid snapping
    if (state.gridSnap) {
      const snap = 0.05;
      targetX = Math.round(targetX / snap) * snap;
      targetZ = Math.round(targetZ / snap) * snap;
    }

    const clamped = clampItemToRoomBounds(
      [targetX, item.dimensions[1] / 2, targetZ],
      item.rotation,
      item.dimensions,
      state.roomWidth,
      state.roomLength
    );

    const updatedItems = state.items.map((i) =>
      i.instanceId === id ? { ...i, position: clamped } : i
    );

    const activeItem = updatedItems.find((i) => i.instanceId === id)!;
    const collisions = checkItemCollisions(activeItem, updatedItems);

    set({
      items: updatedItems,
      collidingIds: collisions,
      hasUnsavedChanges: true,
    });
  },

  updateItemRotation: (id, rotY) => {
    const state = get();
    const item = state.items.find((i) => i.instanceId === id);
    if (!item) return;

    const newRotation: [number, number, number] = [0, rotY, 0];
    const clampedPos = clampItemToRoomBounds(
      item.position,
      newRotation,
      item.dimensions,
      state.roomWidth,
      state.roomLength
    );

    const updatedItems = state.items.map((i) =>
      i.instanceId === id
        ? { ...i, rotation: newRotation, position: clampedPos }
        : i
    );

    const activeItem = updatedItems.find((i) => i.instanceId === id)!;
    const collisions = checkItemCollisions(activeItem, updatedItems);

    set({
      items: updatedItems,
      collidingIds: collisions,
      hasUnsavedChanges: true,
    });
  },

  rotateSelectedItem: (angleRads = Math.PI / 2) => {
    const state = get();
    if (!state.selectedId) return;
    const item = state.items.find((i) => i.instanceId === state.selectedId);
    if (!item) return;

    const nextRotY = (item.rotation[1] + angleRads) % (Math.PI * 2);
    state.updateItemRotation(state.selectedId, nextRotY);
  },

  duplicateSelectedItem: () => {
    const state = get();
    if (!state.selectedId) return;
    const item = state.items.find((i) => i.instanceId === state.selectedId);
    if (!item) return;

    const offset = 0.2;
    const newPos: [number, number, number] = [
      item.position[0] + offset,
      item.position[1],
      item.position[2] + offset,
    ];

    const clampedPos = clampItemToRoomBounds(
      newPos,
      item.rotation,
      item.dimensions,
      state.roomWidth,
      state.roomLength
    );

    const duplicated: PlacedFurniture = {
      ...item,
      instanceId: "inst-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      position: clampedPos,
    };

    const nextItems = [...state.items, duplicated];
    const collisions = checkItemCollisions(duplicated, nextItems);

    set({
      items: nextItems,
      selectedId: duplicated.instanceId,
      collidingIds: collisions,
      hasUnsavedChanges: true,
    });
  },

  deleteSelectedItem: () => {
    const state = get();
    if (!state.selectedId) return;
    set({
      items: state.items.filter((i) => i.instanceId !== state.selectedId),
      selectedId: null,
      collidingIds: [],
      hasUnsavedChanges: true,
    });
  },

  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleGridSnap: () => set((s) => ({ gridSnap: !s.gridSnap })),
  setCameraView: (view) => set({ cameraView: view }),
  resetCamera: () => set((s) => ({ cameraResetKey: s.cameraResetKey + 1 })),
  setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),
  setIsSaving: (val) => set({ isSaving: val }),
  clearScene: () =>
    set({
      items: [],
      selectedId: null,
      collidingIds: [],
      hasUnsavedChanges: true,
    }),
}));
