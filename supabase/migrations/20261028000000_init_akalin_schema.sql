-- ==============================================================================
-- AKALIN DATABASE INITIAL SCHEMA MIGRATION
-- Production-ready schema with Row Level Security (RLS) & Role Checks
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inspiration_status AS ENUM ('pending', 'published', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE room_visibility AS ENUM ('private', 'public');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to create profile automatically on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to prevent privilege escalation (cannot upgrade to admin via regular update)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role != OLD.role THEN
        -- Only allow if the executing user is already an admin
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Unauthorized: Users cannot modify their own role.';
        END IF;
    END IF;
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT DEFAULT 'Compass',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. FURNITURE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.furniture_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- 'bed', 'desk', 'chair', 'wardrobe', 'storage', 'sofa', 'table', 'lighting', 'decor'
    description TEXT,
    width NUMERIC(5,2) NOT NULL,  -- in meters
    depth NUMERIC(5,2) NOT NULL,  -- in meters
    height NUMERIC(5,2) NOT NULL, -- in meters
    thumbnail_url TEXT NOT NULL,
    model_url TEXT,
    model_type TEXT NOT NULL DEFAULT 'procedural', -- 'procedural' | 'glb'
    price_estimate NUMERIC(12,2), -- in IDR
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_furniture_category ON public.furniture_items(category);
CREATE INDEX IF NOT EXISTS idx_furniture_active ON public.furniture_items(is_active);

-- 6. ROOM DESIGNS TABLE
CREATE TABLE IF NOT EXISTS public.room_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    room_type TEXT NOT NULL DEFAULT 'kos_standar',
    room_length NUMERIC(5,2) NOT NULL DEFAULT 4.0, -- length in meters
    room_width NUMERIC(5,2) NOT NULL DEFAULT 3.0,  -- width in meters
    wall_height NUMERIC(5,2) NOT NULL DEFAULT 2.8, -- height in meters
    floor_color TEXT NOT NULL DEFAULT '#E8DEC8',
    wall_color TEXT NOT NULL DEFAULT '#F8F6F0',
    scene_data JSONB NOT NULL DEFAULT '{"items": [], "lighting": {"ambient": 0.6, "directional": 0.8}, "camera": {"position": [0, 5, 7]}}'::jsonb,
    visibility room_visibility NOT NULL DEFAULT 'private',
    preview_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_room_designs_owner ON public.room_designs(owner_id);
CREATE INDEX IF NOT EXISTS idx_room_designs_visibility ON public.room_designs(visibility);

-- 7. INSPIRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.inspirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
    estimated_budget NUMERIC(12,2) NOT NULL DEFAULT 0,
    room_length NUMERIC(5,2),
    room_width NUMERIC(5,2),
    materials JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    room_design_id UUID REFERENCES public.room_designs(id) ON DELETE SET NULL,
    status inspiration_status NOT NULL DEFAULT 'pending',
    likes_count INT NOT NULL DEFAULT 0,
    saves_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inspirations_status ON public.inspirations(status);
CREATE INDEX IF NOT EXISTS idx_inspirations_category ON public.inspirations(category_id);
CREATE INDEX IF NOT EXISTS idx_inspirations_author ON public.inspirations(author_id);
CREATE INDEX IF NOT EXISTS idx_inspirations_created_at ON public.inspirations(created_at DESC);

-- 8. SAVED INSPIRATIONS (BOOKMARKS) TABLE
CREATE TABLE IF NOT EXISTS public.saved_inspirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    inspiration_id UUID NOT NULL REFERENCES public.inspirations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_inspiration UNIQUE(user_id, inspiration_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_user ON public.saved_inspirations(user_id);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.furniture_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_inspirations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- CATEGORIES POLICIES
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert categories"
    ON public.categories FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories"
    ON public.categories FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Only admins can delete categories"
    ON public.categories FOR DELETE
    USING (public.is_admin());

-- FURNITURE ITEMS POLICIES
CREATE POLICY "Active furniture items are viewable by everyone"
    ON public.furniture_items FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage furniture"
    ON public.furniture_items FOR ALL
    USING (public.is_admin());

-- ROOM DESIGNS POLICIES
CREATE POLICY "Users can view public designs or their own"
    ON public.room_designs FOR SELECT
    USING (visibility = 'public' OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Authenticated users can create their own room designs"
    ON public.room_designs FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own room designs"
    ON public.room_designs FOR UPDATE
    USING (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Users can delete their own room designs"
    ON public.room_designs FOR DELETE
    USING (auth.uid() = owner_id OR public.is_admin());

-- INSPIRATIONS POLICIES
CREATE POLICY "Published inspirations are viewable by all"
    ON public.inspirations FOR SELECT
    USING (status = 'published' OR auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit inspirations"
    ON public.inspirations FOR INSERT
    WITH CHECK (auth.uid() = author_id AND status = 'pending');

CREATE POLICY "Authors can update their own pending inspirations or admins can update any"
    ON public.inspirations FOR UPDATE
    USING ((auth.uid() = author_id AND status = 'pending') OR public.is_admin());

CREATE POLICY "Authors or admins can delete inspirations"
    ON public.inspirations FOR DELETE
    USING (auth.uid() = author_id OR public.is_admin());

-- SAVED INSPIRATIONS POLICIES
CREATE POLICY "Users can view their own saved inspirations"
    ON public.saved_inspirations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save inspirations"
    ON public.saved_inspirations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave inspirations"
    ON public.saved_inspirations FOR DELETE
    USING (auth.uid() = user_id);

-- 10. STORAGE BUCKETS CONFIGURATION (Documented for Supabase Storage)
-- Run via Supabase SQL Editor if storage schema is accessible:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('inspirations', 'inspirations', true),
       ('avatars', 'avatars', true),
       ('room-previews', 'room-previews', true)
ON CONFLICT (id) DO NOTHING;
