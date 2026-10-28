-- ==============================================================================
-- AKALIN SEED DATA MIGRATION
-- Initial Categories, Furniture Catalog, and Curated Inspirations
-- ==============================================================================

-- 1. SEED CATEGORIES
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

-- 2. SEED FURNITURE CATALOG (12 Core Furniture Items)
INSERT INTO public.furniture_items (id, name, slug, category, description, width, depth, height, thumbnail_url, model_type, price_estimate, is_active) VALUES
('f1000000-0000-0000-0000-000000000001', 'Kasur Single 90x200 Minimalis', 'kasur-single-90x200', 'bed', 'Ranjang single kayu solid dengan dipan rendah dan kasur busa empuk, ideal untuk kamar kost standar.', 0.90, 2.00, 0.50, 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=500&auto=format&fit=crop&q=60', 'procedural', 1250000, true),

('f1000000-0000-0000-0000-000000000002', 'Tempat Tidur Queen 160x200', 'tempat-tidur-queen-160x200', 'bed', 'Tempat tidur queen size dengan headboard minimalis berlapis busa linen lembut.', 1.60, 2.00, 0.85, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&auto=format&fit=crop&q=60', 'procedural', 2400000, true),

('f1000000-0000-0000-0000-000000000003', 'Meja Belajar Kayu Compact', 'meja-belajar-kayu-compact', 'desk', 'Meja kerja kayu oak berdesain ramping dilengkapi laci samping untuk laptop dan dokumen.', 1.00, 0.60, 0.75, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60', 'procedural', 650000, true),

('f1000000-0000-0000-0000-000000000004', 'Kursi Kerja Ergonomis Mesh', 'kursi-kerja-ergonomis-mesh', 'chair', 'Kursi putar dengan sandaran punggung jaring bernapas dan bantalan duduk tebal.', 0.60, 0.60, 0.95, 'https://images.unsplash.com/photo-1580481077194-e405a108b532?w=500&auto=format&fit=crop&q=60', 'procedural', 550000, true),

('f1000000-0000-0000-0000-000000000005', 'Lemari Pakaian 2 Pintu Minimalis', 'lemari-pakaian-2-pintu', 'wardrobe', 'Lemari pakaian 2 pintu dengan sekat gantungan baju dan rak tumpuk di bagian bawah.', 0.80, 0.50, 1.80, 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=500&auto=format&fit=crop&q=60', 'procedural', 1100000, true),

('f1000000-0000-0000-0000-000000000006', 'Rak Buku Terbuka 4 Tingkat', 'rak-buku-terbuka-4-tingkat', 'storage', 'Rak kayu terbuka 4 ambalan kokoh untuk buku kuliah, tanaman pot sukulen, dan hiasan.', 0.60, 0.30, 1.40, 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=60', 'procedural', 380000, true),

('f1000000-0000-0000-0000-000000000007', 'Meja Nakas Samping Tempat Tidur', 'meja-nakas-bedside', 'table', 'Meja nakas kubus dengan laci untuk meletakkan lampu tidur, jam weker, dan ponsel.', 0.40, 0.40, 0.50, 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500&auto=format&fit=crop&q=60', 'procedural', 250000, true),

('f1000000-0000-0000-0000-000000000008', 'Sofa Santai 2 Dudukan Modern', 'sofa-santai-2-dudukan', 'sofa', 'Sofa kain fabric warna abu abu lembut dengan bantalan duduk tebal empuk dan kaki kayu solid.', 1.40, 0.75, 0.75, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60', 'procedural', 1850000, true),

('f1000000-0000-0000-0000-000000000009', 'Meja Kopi Bulat Scandinavian', 'meja-kopi-bulat-scandi', 'table', 'Meja bundar minimalis dengan permukaan kayu natural dan kaki silang kokoh.', 0.60, 0.60, 0.45, 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&auto=format&fit=crop&q=60', 'procedural', 320000, true),

('f1000000-0000-0000-0000-000000000010', 'Lampu Lantai Nordic Tripod', 'lampu-lantai-nordic-tripod', 'lighting', 'Standing lamp dengan kap kain krem dan kaki kayu tripod yang memberi nuansa warm ambient.', 0.45, 0.45, 1.50, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60', 'procedural', 290000, true),

('f1000000-0000-0000-0000-000000000011', 'Karpet Bulu Pendek Hangat 160x120', 'karpet-bulu-pendek-160x120', 'decor', 'Karpet lantai tenun bermotif geometris lembut untuk menambah kenyamanan di area lesehan.', 1.60, 1.20, 0.02, 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=500&auto=format&fit=crop&q=60', 'procedural', 340000, true),

('f1000000-0000-0000-0000-000000000012', 'Kabinet Penyimpanan Serbaguna', 'kabinet-penyimpanan-serbaguna', 'storage', 'Kabinet laci 3 susun kompak warna putih gading untuk perlengkapan mandi, pakaian, dan camilan.', 0.50, 0.40, 0.85, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60', 'procedural', 490000, true)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    width = EXCLUDED.width,
    depth = EXCLUDED.depth,
    height = EXCLUDED.height,
    thumbnail_url = EXCLUDED.thumbnail_url,
    price_estimate = EXCLUDED.price_estimate;
