import { createClient } from "./supabase/client";
import {
  Category,
  FurnitureItem,
  Inspiration,
  InspirationStatus,
  RoomDesign,
} from "@/types";
import {
  MOCK_CATEGORIES,
  MOCK_FURNITURE,
  MOCK_INSPIRATIONS,
} from "./mock-data";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder"));
}

const LOCAL_STORAGE_KEY_DESIGNS = "akalin_user_room_designs";
const LOCAL_STORAGE_KEY_SAVED = "akalin_user_saved_inspirations";
const LOCAL_STORAGE_KEY_INSPIRATIONS = "akalin_user_inspirations";
const LOCAL_STORAGE_KEY_FURNITURE = "akalin_furniture_catalog";

export const DataService = {
  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase categories fetch error, using local fallback:", err);
      }
    }
    return MOCK_CATEGORIES;
  },

  // FURNITURE ITEMS
  async getFurnitureItems(category?: string): Promise<FurnitureItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase.from("furniture_items").select("*").eq("is_active", true);
        if (category && category !== "all") {
          query = query.eq("category", category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase furniture fetch error, using local fallback:", err);
      }
    }

    // Local / fallback mode
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_FURNITURE);
      if (stored) {
        try {
          const list: FurnitureItem[] = JSON.parse(stored);
          if (category && category !== "all") {
            return list.filter((item) => item.category === category);
          }
          return list;
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (category && category !== "all") {
      return MOCK_FURNITURE.filter((item) => item.category === category);
    }
    return MOCK_FURNITURE;
  },

  async addFurnitureItem(item: Omit<FurnitureItem, "id">): Promise<FurnitureItem> {
    const newItem: FurnitureItem = {
      ...item,
      id: "f-" + Date.now(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("furniture_items").insert(item).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase insert furniture error:", err);
      }
    }

    if (typeof window !== "undefined") {
      const current = await this.getFurnitureItems();
      const updated = [newItem, ...current];
      localStorage.setItem(LOCAL_STORAGE_KEY_FURNITURE, JSON.stringify(updated));
    }
    return newItem;
  },

  // INSPIRATIONS
  async getInspirations(params?: {
    categorySlug?: string;
    search?: string;
    sortBy?: "newest" | "popular";
    status?: InspirationStatus;
  }): Promise<Inspiration[]> {
    let items: Inspiration[] = [...MOCK_INSPIRATIONS];

    if (typeof window !== "undefined") {
      const userAdded = localStorage.getItem(LOCAL_STORAGE_KEY_INSPIRATIONS);
      if (userAdded) {
        try {
          const parsed: Inspiration[] = JSON.parse(userAdded);
          items = [...parsed, ...items];
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase
          .from("inspirations")
          .select("*, author:profiles(display_name, avatar_url), category:categories(*)")
          .order("created_at", { ascending: false });

        if (params?.status) {
          query = query.eq("status", params.status);
        } else {
          query = query.eq("status", "published");
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          items = data;
        }
      } catch (err) {
        console.warn("Supabase inspirations fetch error, using local fallback:", err);
      }
    }

    // Filter by category
    if (params?.categorySlug && params.categorySlug !== "all") {
      items = items.filter(
        (item) => item.category?.slug === params.categorySlug || item.category_id === params.categorySlug
      );
    }

    // Search query
    if (params?.search && params.search.trim() !== "") {
      const query = params.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.materials.some((m) => m.name.toLowerCase().includes(query))
      );
    }

    // Sorting
    if (params?.sortBy === "popular") {
      items.sort((a, b) => b.likes_count + b.saves_count - (a.likes_count + a.saves_count));
    } else {
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return items;
  },

  async getInspirationById(id: string): Promise<Inspiration | null> {
    const list = await this.getInspirations();
    const found = list.find((item) => item.id === id || item.slug === id);
    return found || null;
  },

  async createInspiration(
    inspiration: Omit<Inspiration, "id" | "likes_count" | "saves_count" | "created_at" | "updated_at">
  ): Promise<Inspiration> {
    const newInspiration: Inspiration = {
      ...inspiration,
      id: "ins-" + Date.now(),
      likes_count: 0,
      saves_count: 0,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("inspirations").insert(newInspiration).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.error("Supabase insert inspiration error:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_INSPIRATIONS);
      const list: Inspiration[] = stored ? JSON.parse(stored) : [];
      list.unshift(newInspiration);
      localStorage.setItem(LOCAL_STORAGE_KEY_INSPIRATIONS, JSON.stringify(list));
    }

    return newInspiration;
  },

  async moderateInspiration(id: string, status: "published" | "rejected"): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("inspirations").update({ status }).eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.error("Supabase update error:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_INSPIRATIONS);
      if (stored) {
        const list: Inspiration[] = JSON.parse(stored);
        const target = list.find((item) => item.id === id);
        if (target) {
          target.status = status;
          localStorage.setItem(LOCAL_STORAGE_KEY_INSPIRATIONS, JSON.stringify(list));
          return true;
        }
      }
    }
    return true;
  },

  // SAVED INSPIRATIONS (BOOKMARKS)
  async getSavedInspirationIds(): Promise<string[]> {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : ["ins-001", "ins-002"];
    } catch {
      return ["ins-001", "ins-002"];
    }
  },

  async toggleSaveInspiration(id: string): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const saved = await this.getSavedInspirationIds();
    let isSavedNow = false;
    let nextSaved: string[] = [];

    if (saved.includes(id)) {
      nextSaved = saved.filter((item) => item !== id);
      isSavedNow = false;
    } else {
      nextSaved = [...saved, id];
      isSavedNow = true;
    }

    localStorage.setItem(LOCAL_STORAGE_KEY_SAVED, JSON.stringify(nextSaved));

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          if (isSavedNow) {
            await supabase.from("saved_inspirations").insert({ user_id: user.id, inspiration_id: id });
          } else {
            await supabase
              .from("saved_inspirations")
              .delete()
              .eq("user_id", user.id)
              .eq("inspiration_id", id);
          }
        }
      } catch (err) {
        console.warn("Supabase toggle save error:", err);
      }
    }

    return isSavedNow;
  },

  // ROOM DESIGNS (CRUD)
  async getRoomDesigns(): Promise<RoomDesign[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("room_designs")
          .select("*")
          .order("updated_at", { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase getRoomDesigns error:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_DESIGNS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Default sample design
    const defaultDesign: RoomDesign = {
      id: "design-sample-kos-3x3",
      owner_id: "user-demo",
      title: "Desain Kos 3x3 Japandi Santai",
      room_type: "kos_standar",
      room_length: 3.0,
      room_width: 3.0,
      wall_height: 2.8,
      floor_color: "#E2DCD5",
      wall_color: "#F6F5F2",
      visibility: "public",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      scene_data: {
        lighting: {
          ambientIntensity: 0.7,
          directionalIntensity: 0.9,
          sunPosition: [5, 8, 5],
          preset: "daylight",
        },
        items: [
          {
            instanceId: "inst-1",
            furnitureId: "f1000000-0000-0000-0000-000000000001",
            name: "Kasur Single 90x200 Minimalis",
            category: "bed",
            position: [-0.95, 0.25, 0],
            rotation: [0, 0, 0],
            dimensions: [0.9, 0.5, 2.0],
            color: "#E2DCD5",
          },
          {
            instanceId: "inst-2",
            furnitureId: "f1000000-0000-0000-0000-000000000003",
            name: "Meja Belajar Kayu Compact",
            category: "desk",
            position: [0.85, 0.375, -0.8],
            rotation: [0, -Math.PI / 2, 0],
            dimensions: [1.0, 0.75, 0.6],
            color: "#C29B6C",
          },
          {
            instanceId: "inst-3",
            furnitureId: "f1000000-0000-0000-0000-000000000004",
            name: "Kursi Kerja Ergonomis Mesh",
            category: "chair",
            position: [0.35, 0.475, -0.8],
            rotation: [0, Math.PI / 2, 0],
            dimensions: [0.6, 0.95, 0.6],
            color: "#333333",
          },
          {
            instanceId: "inst-4",
            furnitureId: "f1000000-0000-0000-0000-000000000005",
            name: "Lemari Pakaian 2 Pintu Minimalis",
            category: "wardrobe",
            position: [0.95, 0.9, 0.9],
            rotation: [0, -Math.PI / 2, 0],
            dimensions: [0.8, 1.8, 0.5],
            color: "#DFD8D0",
          },
        ],
      },
    };

    return [defaultDesign];
  },

  async getRoomDesignById(id: string): Promise<RoomDesign | null> {
    const designs = await this.getRoomDesigns();
    return designs.find((d) => d.id === id) || null;
  },

  async saveRoomDesign(design: Omit<RoomDesign, "id" | "created_at" | "updated_at"> & { id?: string }): Promise<RoomDesign> {
    const isNew = !design.id;
    const finalDesign: RoomDesign = {
      ...design,
      id: design.id || "design-" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        if (isNew) {
          const { data, error } = await supabase.from("room_designs").insert(finalDesign).select().single();
          if (!error && data) return data;
        } else {
          const { data, error } = await supabase
            .from("room_designs")
            .update(finalDesign)
            .eq("id", finalDesign.id)
            .select()
            .single();
          if (!error && data) return data;
        }
      } catch (err) {
        console.error("Supabase save room design error:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_DESIGNS);
      let list: RoomDesign[] = stored ? JSON.parse(stored) : [];
      const index = list.findIndex((d) => d.id === finalDesign.id);
      if (index >= 0) {
        list[index] = finalDesign;
      } else {
        list.unshift(finalDesign);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY_DESIGNS, JSON.stringify(list));
    }

    return finalDesign;
  },

  async deleteRoomDesign(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("room_designs").delete().eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.error("Supabase delete room design error:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_DESIGNS);
      if (stored) {
        const list: RoomDesign[] = JSON.parse(stored);
        const filtered = list.filter((d) => d.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY_DESIGNS, JSON.stringify(filtered));
      }
    }
    return true;
  },
};

