-- ==============================================================================
-- AKALIN SEED DATA MIGRATION
-- Production-ready seed for Profiles, Categories, Furniture Catalog,
-- 3D Room Designs, Curated Inspirations, and Bookmarks.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SEED AUTH USERS (IF NOT ALREADY PRESENT IN SUPABASE AUTH SCHEMA)
-- In Supabase, auth.users holds authentication identities.
-- All UUIDs strictly use valid hexadecimal characters [0-9, a-f].
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            recovery_token
        ) VALUES 
        ('00000000-0000-0000-0000-000000000000', 'e1000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'aditya@akalin.id', '$2a$10$abcdefghijklmnopqrstuvwxyz01234567890123456789012345', now(), '{"provider":"email","providers":["email"]}', '{"name":"Aditya Pratama"}', now(), now(), '', ''),
        ('00000000-0000-0000-0000-000000000000', 'e1000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'clarissa@akalin.id', '$2a$10$abcdefghijklmnopqrstuvwxyz01234567890123456789012345', now(), '{"provider":"email","providers":["email"]}', '{"name":"Clarissa Dewi"}', now(), now(), '', ''),
        ('00000000-0000-0000-0000-000000000000', 'e1000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'farhan@akalin.id', '$2a$10$abcdefghijklmnopqrstuvwxyz01234567890123456789012345', now(), '{"provider":"email","providers":["email"]}', '{"name":"Farhan Hakim"}', now(), now(), '', ''),
        ('00000000-0000-0000-0000-000000000000', 'e1000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'nabila@akalin.id', '$2a$10$abcdefghijklmnopqrstuvwxyz01234567890123456789012345', now(), '{"provider":"email","providers":["email"]}', '{"name":"Nabila Putri"}', now(), now(), '', ''),
        ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@akalin.id', '$2a$10$abcdefghijklmnopqrstuvwxyz01234567890123456789012345', now(), '{"provider":"email","providers":["email"]}', '{"name":"Admin Akalin"}', now(), now(), '', '')
        ON CONFLICT (id) DO NOTHING;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- If running outside Supabase superuser context, ignore auth.users error
        NULL;
END $$;

-- 3. SEED PROFILES
-- Ensure prevent_role_escalation function permits seed/migration updates (auth.uid() IS NULL)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role != OLD.role THEN
        IF auth.uid() IS NOT NULL AND NOT EXISTS (
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

ALTER TABLE public.profiles DISABLE TRIGGER trg_prevent_role_escalation;

INSERT INTO public.profiles (id, display_name, avatar_url, role) VALUES
('e1000000-0000-0000-0000-000000000001', 'Aditya Pratama', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 'user'),
('e1000000-0000-0000-0000-000000000002', 'Clarissa Dewi', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', 'user'),
('e1000000-0000-0000-0000-000000000003', 'Farhan Hakim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 'user'),
('e1000000-0000-0000-0000-000000000004', 'Nabila Putri', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', 'user'),
('a0000000-0000-0000-0000-000000000001', 'Admin Akalin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80', 'admin')
ON CONFLICT (id) DO UPDATE SET 
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role;

ALTER TABLE public.profiles ENABLE TRIGGER trg_prevent_role_escalation;

-- 4. SEED CATEGORIES (6 Curated Room Concepts)
INSERT INTO public.categories (id, name, slug, description, icon_name) VALUES
('c1000000-0000-0000-0000-000000000001', 'Kamar Kos Minimalis', 'kamar-kos-minimalis', 'Solusi penataan kamar kost berukuran kompak agar terasa lega, rapi, dan fungsional.', 'Bed'),
('c1000000-0000-0000-0000-000000000002', 'Kamar Kos Estetik', 'kamar-kos-estetik', 'Inspirasi kamar bernuansa warm earthy, sentuhan kayu, dan pencahayaan hangat.', 'Sparkles'),
('c1000000-0000-0000-0000-000000000003', 'Studio Apartment', 'studio-apartment', 'Desain multifungsi untuk hunian tipe studio dengan pemanfaatan ruang vertikal.', 'Home'),
('c1000000-0000-0000-0000-000000000004', 'Ruang Belajar & Produktif', 'ruang-belajar-produktif', 'Sudut kerja dan belajar ergonomis yang nyaman untuk skripsi atau WFH berjam-jam.', 'Laptop'),
('c1000000-0000-0000-0000-000000000005', 'Kamar Skandinavia Mungil', 'kamar-skandinavia-mungil', 'Gaya Scandinavian dengan dominasi warna putih, abu lembut, dan material kayu alami.', 'Palette'),
('c1000000-0000-0000-0000-000000000006', 'Desain Hemat Budget', 'desain-hemat-budget', 'Ide dekorasi dan perabotan ramah kantong mahasiswa di bawah 2 juta rupiah.', 'Wallet')
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name;

-- 5. SEED FURNITURE CATALOG (12 Core Standardized 3D Modules)
INSERT INTO public.furniture_items (id, name, slug, category, description, width, depth, height, thumbnail_url, model_type, price_estimate, color, is_active) VALUES
('f1000000-0000-0000-0000-000000000001', 'Kasur Single 90x200 Minimalis', 'kasur-single-90x200', 'bed', 'Ranjang single kayu solid dengan dipan rendah dan kasur busa empuk, ideal untuk kamar kost standar.', 0.90, 2.00, 0.50, 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=500&auto=format&fit=crop&q=60', 'procedural', 1250000, '#E2DCD5', true),

('f1000000-0000-0000-0000-000000000002', 'Tempat Tidur Queen 160x200', 'tempat-tidur-queen-160x200', 'bed', 'Tempat tidur queen size dengan headboard minimalis berlapis busa linen lembut.', 1.60, 2.00, 0.85, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&auto=format&fit=crop&q=60', 'procedural', 2400000, '#C5BCB3', true),

('f1000000-0000-0000-0000-000000000003', 'Meja Belajar Kayu Compact', 'meja-belajar-kayu-compact', 'desk', 'Meja kerja kayu oak berdesain ramping dilengkapi laci samping untuk laptop dan dokumen.', 1.00, 0.60, 0.75, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60', 'procedural', 650000, '#C29B6C', true),

('f1000000-0000-0000-0000-000000000004', 'Kursi Kerja Ergonomis Mesh', 'kursi-kerja-ergonomis-mesh', 'chair', 'Kursi putar dengan sandaran punggung jaring bernapas dan bantalan duduk tebal.', 0.60, 0.60, 0.95, 'https://images.unsplash.com/photo-1580481077194-e405a108b532?w=500&auto=format&fit=crop&q=60', 'procedural', 550000, '#333333', true),

('f1000000-0000-0000-0000-000000000005', 'Lemari Pakaian 2 Pintu Minimalis', 'lemari-pakaian-2-pintu', 'wardrobe', 'Lemari pakaian 2 pintu dengan sekat gantungan baju dan rak tumpuk di bagian bawah.', 0.80, 0.50, 1.80, 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=500&auto=format&fit=crop&q=60', 'procedural', 1100000, '#DFD8D0', true),

('f1000000-0000-0000-0000-000000000006', 'Rak Buku Terbuka 4 Tingkat', 'rak-buku-terbuka-4-tingkat', 'storage', 'Rak kayu terbuka 4 ambalan kokoh untuk buku kuliah, tanaman pot sukulen, dan hiasan.', 0.60, 0.30, 1.40, 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=60', 'procedural', 380000, '#B88E5A', true),

('f1000000-0000-0000-0000-000000000007', 'Meja Nakas Samping Ranjang', 'meja-nakas-bedside', 'table', 'Meja nakas kubus dengan laci untuk meletakkan lampu tidur, jam weker, dan ponsel.', 0.40, 0.40, 0.50, 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500&auto=format&fit=crop&q=60', 'procedural', 250000, '#D5C8B8', true),

('f1000000-0000-0000-0000-000000000008', 'Sofa Santai 2 Dudukan Modern', 'sofa-santai-2-dudukan', 'sofa', 'Sofa kain fabric warna abu abu lembut dengan bantalan duduk tebal empuk dan kaki kayu solid.', 1.40, 0.75, 0.75, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60', 'procedural', 1850000, '#9EA7A2', true),

('f1000000-0000-0000-0000-000000000009', 'Meja Kopi Bulat Scandinavian', 'meja-kopi-bulat-scandi', 'table', 'Meja bundar minimalis dengan permukaan kayu natural dan kaki silang kokoh.', 0.60, 0.60, 0.45, 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&auto=format&fit=crop&q=60', 'procedural', 320000, '#D0A97E', true),

('f1000000-0000-0000-0000-000000000010', 'Lampu Lantai Nordic Tripod', 'lampu-lantai-nordic-tripod', 'lighting', 'Standing lamp dengan kap kain krem dan kaki kayu tripod yang memberi nuansa warm ambient.', 0.45, 0.45, 1.50, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60', 'procedural', 290000, '#EFE8DA', true),

('f1000000-0000-0000-0000-000000000011', 'Karpet Bulu Pendek Hangat 160x120', 'karpet-bulu-pendek-160x120', 'decor', 'Karpet lantai tenun bermotif geometris lembut untuk menambah kenyamanan di area lesehan.', 1.60, 1.20, 0.02, 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=500&auto=format&fit=crop&q=60', 'procedural', 340000, '#DFDACF', true),

('f1000000-0000-0000-0000-000000000012', 'Kabinet Laci Penyimpanan Kos', 'kabinet-penyimpanan-serbaguna', 'storage', 'Kabinet laci 3 susun kompak warna putih gading untuk perlengkapan mandi, pakaian, dan camilan.', 0.50, 0.40, 0.85, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60', 'procedural', 490000, '#F0ECE5', true)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    width = EXCLUDED.width,
    depth = EXCLUDED.depth,
    height = EXCLUDED.height,
    thumbnail_url = EXCLUDED.thumbnail_url,
    price_estimate = EXCLUDED.price_estimate,
    color = EXCLUDED.color,
    is_active = EXCLUDED.is_active;

-- 6. SEED 3D ROOM DESIGNS
INSERT INTO public.room_designs (
    id,
    owner_id,
    title,
    room_type,
    room_length,
    room_width,
    wall_height,
    floor_color,
    wall_color,
    visibility,
    scene_data
) VALUES
(
    'd1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000001',
    'Desain Kos 3x3 Japandi Santai',
    'kos_standar',
    3.0,
    3.0,
    2.8,
    '#E2DCD5',
    '#F6F5F2',
    'public',
    '{
        "floorTexture": "wood",
        "lighting": {
            "preset": "daylight",
            "ambientIntensity": 0.7,
            "directionalIntensity": 0.9,
            "sunPosition": [5, 8, 5]
        },
        "items": [
            {
                "instanceId": "inst-seed-1",
                "furnitureId": "f1000000-0000-0000-0000-000000000001",
                "name": "Kasur Single 90x200 Minimalis",
                "category": "bed",
                "position": [-0.95, 0.25, 0.0],
                "rotation": [0, 0, 0],
                "dimensions": [0.9, 0.5, 2.0],
                "color": "#E2DCD5"
            },
            {
                "instanceId": "inst-seed-2",
                "furnitureId": "f1000000-0000-0000-0000-000000000003",
                "name": "Meja Belajar Kayu Compact",
                "category": "desk",
                "position": [0.85, 0.375, -0.8],
                "rotation": [0, -1.5707963, 0],
                "dimensions": [1.0, 0.75, 0.6],
                "color": "#C29B6C"
            },
            {
                "instanceId": "inst-seed-3",
                "furnitureId": "f1000000-0000-0000-0000-000000000004",
                "name": "Kursi Kerja Ergonomis Mesh",
                "category": "chair",
                "position": [0.35, 0.475, -0.8],
                "rotation": [0, 1.5707963, 0],
                "dimensions": [0.6, 0.95, 0.6],
                "color": "#333333"
            },
            {
                "instanceId": "inst-seed-4",
                "furnitureId": "f1000000-0000-0000-0000-000000000005",
                "name": "Lemari Pakaian 2 Pintu Minimalis",
                "category": "wardrobe",
                "position": [0.95, 0.9, 0.9],
                "rotation": [0, -1.5707963, 0],
                "dimensions": [0.8, 1.8, 0.5],
                "color": "#DFD8D0"
            }
        ]
    }'::jsonb
),
(
    'd1000000-0000-0000-0000-000000000002',
    'e1000000-0000-0000-0000-000000000003',
    'Setup Ruang Belajar & Skripsi Ergonomis',
    'ruang_belajar',
    2.5,
    2.5,
    2.6,
    '#DED6C9',
    '#F7F5F0',
    'public',
    '{
        "floorTexture": "wood",
        "lighting": {
            "preset": "daylight",
            "ambientIntensity": 0.75,
            "directionalIntensity": 0.85,
            "sunPosition": [4, 7, 4]
        },
        "items": [
            {
                "instanceId": "inst-seed-study-1",
                "furnitureId": "f1000000-0000-0000-0000-000000000003",
                "name": "Meja Belajar Kayu Compact",
                "category": "desk",
                "position": [0.0, 0.375, -0.6],
                "rotation": [0, 0, 0],
                "dimensions": [1.0, 0.75, 0.6],
                "color": "#C29B6C"
            },
            {
                "instanceId": "inst-seed-study-2",
                "furnitureId": "f1000000-0000-0000-0000-000000000004",
                "name": "Kursi Kerja Ergonomis Mesh",
                "category": "chair",
                "position": [0.0, 0.475, 0.0],
                "rotation": [0, 0, 0],
                "dimensions": [0.6, 0.95, 0.6],
                "color": "#333333"
            },
            {
                "instanceId": "inst-seed-study-3",
                "furnitureId": "f1000000-0000-0000-0000-000000000006",
                "name": "Rak Buku Terbuka 4 Tingkat",
                "category": "storage",
                "position": [-0.85, 0.7, 0.2],
                "rotation": [0, 1.5707963, 0],
                "dimensions": [0.6, 1.4, 0.3],
                "color": "#B88E5A"
            }
        ]
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    room_length = EXCLUDED.room_length,
    room_width = EXCLUDED.room_width,
    wall_height = EXCLUDED.wall_height,
    scene_data = EXCLUDED.scene_data;

-- 7. SEED CURATED INSPIRATIONS (6 High-Quality Inspirations)
INSERT INTO public.inspirations (
    id,
    author_id,
    category_id,
    title,
    slug,
    description,
    cover_image_url,
    gallery_images,
    estimated_budget,
    room_length,
    room_width,
    materials,
    instructions,
    room_design_id,
    status,
    likes_count,
    saves_count,
    created_at,
    updated_at
) VALUES
(
    'b1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Kamar Kos 3x3 Japandi Estetik Hemat Tempat',
    'kamar-kos-3x3-japandi-estetik',
    'Penataan kamar kost 3x3 meter dengan sentuhan Japandi (Japan-Scandi). Memanfaatkan kolong ranjang untuk tempat koper dan meja kerja menghadap jendela agar pencahayaan alami melimpah.',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format&fit=crop&q=80',
    '["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80"]'::jsonb,
    1850000,
    3.0,
    3.0,
    '[
        {"name": "Kasur Single Busa Rebonded 90x200", "estimate": "Rp 750.000"},
        {"name": "Meja Kayu Lapis Melamin 100x60", "estimate": "Rp 400.000"},
        {"name": "Lampu Meja Warm White 3000K", "estimate": "Rp 120.000"},
        {"name": "Rak Ambalan Dinding Kayu Pinus", "estimate": "Rp 150.000"},
        {"name": "Sprei Katun Polos Abu & Putih", "estimate": "Rp 180.000"},
        {"name": "Kotak Penyimpanan Underbed Beroda", "estimate": "Rp 250.000"}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Tentukan Zona Tidur Terlebih Dahulu", "description": "Posisikan ranjang single menempel pada dinding terjauh dari pintu masuk untuk menciptakan alur sirkulasi yang lapang saat pintu terbuka."},
        {"step": 2, "title": "Arahkan Meja Kerja ke Sumber Cahaya Alami", "description": "Letakkan meja belajar dekat jendela. Ini mengurangi kelelahan mata saat belajar dan menghemat konsumsi listrik di siang hari."},
        {"step": 3, "title": "Gunakan Rak Vertikal untuk Ruang Simpan", "description": "Hindari lemari berukuran jumbo. Gunakan lemari 2 pintu ramping ditambah ambalan dinding untuk meletakkan buku dan tanaman pot kecil."},
        {"step": 4, "title": "Pilih Palet Warna Netral Hangat", "description": "Kombinasikan warna putih gading, kayu terang, dan sedikit aksen sage green untuk memberi ilusi ruangan terasa 30% lebih lapang."}
    ]'::jsonb,
    'd1000000-0000-0000-0000-000000000001',
    'published',
    142,
    89,
    '2026-10-20T10:00:00Z',
    '2026-10-20T10:00:00Z'
),
(
    'b1000000-0000-0000-0000-000000000002',
    'e1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000002',
    'Kamar Kos Earthy Warm dengan Standing Lamp',
    'kamar-kos-earthy-warm',
    'Transformasi kamar kost monoton menjadi oasis tenang bernuansa kayu dan terakota. Mengutamakan suasana istirahat yang nyaman sepulang kuliah seharian.',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&auto=format&fit=crop&q=80',
    '["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80"]'::jsonb,
    2150000,
    3.5,
    3.0,
    '[
        {"name": "Standing Lamp Nordic Bambu", "estimate": "Rp 320.000"},
        {"name": "Karpet Bulu Pendek Geometris 160x120", "estimate": "Rp 340.000"},
        {"name": "Meja Nakas Samping Kayu Jati Belanda", "estimate": "Rp 260.000"},
        {"name": "Linen Duvet Cover Warna Terracotta", "estimate": "Rp 390.000"},
        {"name": "Cat Dinding Accent Wall Warm Sand", "estimate": "Rp 180.000"}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Atur Sudut Ambient Lighting", "description": "Tempatkan floor lamp di sudut kamar untuk pencahayaan sekunder saat malam hari."},
        {"step": 2, "title": "Pasang Karpet Sebagai Penegas Area Santai", "description": "Karpet lantai di samping kasur memberikan kehangatan dan membuat lantai keramik dingin lebih ramah di kaki."}
    ]'::jsonb,
    NULL,
    'published',
    230,
    145,
    '2026-10-22T14:30:00Z',
    '2026-10-22T14:30:00Z'
),
(
    'b1000000-0000-0000-0000-000000000003',
    'e1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000004',
    'Setup Ruang Belajar & Skripsi Ergonomis Anti-Pegel',
    'setup-ruang-belajar-skripsi-ergonomis',
    'Desain khusus bagi mahasiswa semester akhir yang butuh fokus maksimal. Memadukan kursi ergonomis mesh, meja kayu solid, dan penataan kabel rapi tanpa berantakan.',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&auto=format&fit=crop&q=80',
    '["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80"]'::jsonb,
    1600000,
    2.5,
    2.5,
    '[
        {"name": "Kursi Ergonomis Mesh Lumbar Support", "estimate": "Rp 580.000"},
        {"name": "Monitor Riser Kayu dengan Slot Keyboard", "estimate": "Rp 140.000"},
        {"name": "Pegboard Dinding Besi Putih", "estimate": "Rp 210.000"},
        {"name": "Desk Mat Kulit Sintetis 90x40", "estimate": "Rp 95.000"},
        {"name": "Cable Management Box & Velcro", "estimate": "Rp 65.000"}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Ketinggian Layar Sejajar Mata", "description": "Gunakan monitor riser atau tumpukan buku agar leher tidak menekuk ke bawah selama berjam-jam mengetik."},
        {"step": 2, "title": "Gunakan Pegboard untuk Alat Tulis", "description": "Manfaatkan dinding vertikal dengan pegboard sehingga permukaan meja tetap bersih dan lapang."}
    ]'::jsonb,
    'd1000000-0000-0000-0000-000000000002',
    'published',
    310,
    204,
    '2026-10-24T08:15:00Z',
    '2026-10-24T08:15:00Z'
),
(
    'b1000000-0000-0000-0000-000000000004',
    'e1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000003',
    'Apartemen Studio 21m2 Modern Skandinavia',
    'apartemen-studio-21m2-modern-skandinavia',
    'Solusi cerdas membagi zona kamar tidur, meja santai, dan ruang penyimpanan pakaian tanpa perlu membangun sekat permanen yang membuat sumpek.',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80',
    '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80"]'::jsonb,
    4500000,
    5.0,
    4.2,
    '[
        {"name": "Sofa 2 Dudukan Kain Abu Scandinavian", "estimate": "Rp 1.850.000"},
        {"name": "Meja Kopi Bulat Kayu Solid", "estimate": "Rp 320.000"},
        {"name": "Ranjang Queen 160x200 Minimalis", "estimate": "Rp 1.600.000"},
        {"name": "Tirai Tipis Vitrage Putih Tembus Cahaya", "estimate": "Rp 280.000"}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Gunakan Rak Terbuka Sebagai Partisi Semu", "description": "Letakkan rak buku 4 tingkat di antara kasur dan sofa untuk membatasi privasi zona tidur tanpa menghalangi sirkulasi udara dan cahaya."}
    ]'::jsonb,
    NULL,
    'published',
    415,
    278,
    '2026-10-25T11:20:00Z',
    '2026-10-25T11:20:00Z'
),
(
    'b1000000-0000-0000-0000-000000000005',
    'e1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000006',
    'Makeover Kamar Kos Sederhana Total di Bawah 1 Juta',
    'makeover-kamar-kos-di-bawah-1-juta',
    'Buktikan bahwa kamar estetik tidak harus mahal! Trik pemanfaatan stiker dinding serat kayu, lampu tumblr warm white, cermin bulat, dan tanaman rambat buatan.',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1000&auto=format&fit=crop&q=80',
    '["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1000&auto=format&fit=crop&q=80"]'::jsonb,
    850000,
    3.0,
    2.8,
    '[
        {"name": "Cermin Gantung Bulat Strap Kulit 40cm", "estimate": "Rp 125.000"},
        {"name": "Lampu String LED Warm White 10m", "estimate": "Rp 45.000"},
        {"name": "Wallpaper Foam Dinding Bata Putih 3D", "estimate": "Rp 160.000"},
        {"name": "Sprei Aesthetic Motif Kotak Sage", "estimate": "Rp 135.000"},
        {"name": "Rak Sepatu Susun Plastik Ramping", "estimate": "Rp 75.000"}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Bersihkan dan Lapisi Dinding Kusam", "description": "Gunakan wallpaper stiker foam di satu dinding utama sebagai focal point untuk menutupi cat dinding lama yang mengelupas."},
        {"step": 2, "title": "Gantung Cermin Menghadap Cahaya", "description": "Cermin bulat memantulkan cahaya luar dan membuat kamar sempit langsung terasa 2x lebih besar."}
    ]'::jsonb,
    NULL,
    'published',
    512,
    360,
    '2026-10-26T16:45:00Z',
    '2026-10-26T16:45:00Z'
),
(
    'b1000000-0000-0000-0000-000000000006',
    'e1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000005',
    'Kamar Mungil Serba Putih Nordic Vibe',
    'kamar-mungil-serba-putih-nordic',
    'Pendekatan serba putih dan elemen kayu cerah yang menyegarkan pikiran. Membantu menjaga ketenangan dan fokus beristirahat.',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1000&auto=format&fit=crop&q=80',
    '["https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1000&auto=format&fit=crop&q=80"]'::jsonb,
    1750000,
    3.2,
    3.0,
    '[
        {"name": "Dipan Kayu Pallet Halus Vernis", "estimate": "Rp 450.000"},
        {"name": "Meja Nakas Kotak Putih Doff", "estimate": "Rp 180.000"},
        {"name": "Tirai Blackout Abu Muda", "estimate": "Rp 220.000"},
        {"name": "Gantungan Baju Kayu Stand (Hanger Rack)", "estimate": "Rp 210.000"}
    ]'::jsonb,
    '[
        {"step": 1, "title": "Gunakan Pallet Kayu Rendah", "description": "Ranjang rendah (low-profile bed) menyisakan jarak plafon lebih tinggi sehingga kamar tidak terasa sesak."}
    ]'::jsonb,
    NULL,
    'published',
    189,
    112,
    '2026-10-27T09:00:00Z',
    '2026-10-27T09:00:00Z'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    cover_image_url = EXCLUDED.cover_image_url,
    gallery_images = EXCLUDED.gallery_images,
    estimated_budget = EXCLUDED.estimated_budget,
    materials = EXCLUDED.materials,
    instructions = EXCLUDED.instructions,
    room_design_id = EXCLUDED.room_design_id,
    status = EXCLUDED.status,
    likes_count = EXCLUDED.likes_count,
    saves_count = EXCLUDED.saves_count;

-- 8. SEED SAVED INSPIRATIONS (BOOKMARKS SAMPLE)
INSERT INTO public.saved_inspirations (user_id, inspiration_id) VALUES
('e1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001'),
('e1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002'),
('e1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003')
ON CONFLICT (user_id, inspiration_id) DO NOTHING;
