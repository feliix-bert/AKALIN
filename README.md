# Akalin — Visual Inspiration & Interactive 3D Room Planner

> **"Temukan inspirasi. Rancang ruanganmu. Wujudkan idemu."**

Akalin adalah platform inspirasi visual dan perencanaan tata letak ruangan praktis yang dirancang khusus untuk mahasiswa di kamar kos, penghuni apartemen studio, dan pemilik ruangan mungil.

Keunggulan utama Akalin adalah **Interactive 3D Room Planner** yang memungkinkan pengguna menentukan dimensi fisik ruangan nyata, memilih perabotan standar dari katalog, menyeret & meletakkan objek secara interaktif di atas lantai 3D, memutar arah perabotan, mengecek tabrakan/dimensi fisik secara real-time, serta menyimpan dan membagikan rancangan kamar sebelum berbelanja mebel.

---

## 🌟 Fitur Utama

1. **Interactive 3D Room Planner (Three.js & React Three Fiber)**
   - Dimensi ruangan presisi metrik (1 unit 3D = 1 meter nyata).
   - Kontrol kamera 3D orbit (perspektif) & tampak atas (2D orthographic/top-down).
   - Deteksi tabrakan (AABB collision check) dan pembatas dinding ruangan (bounds clamping).
   - Katalog perabotan prosedural 3D dengan siluet visual khas (kasur single/queen, meja kerja, kursi ergonomis, lemari 2 pintu, rak buku terbuka, sofa, standing lamp, karpet).
   - Kustomisasi material lantai (kayu oak, keramik putih, karpet krem, semen poles), warna dinding, dan suasana pencahayaan (siang alami, sunset hangat, malam redup).
   - Snapping grid 0.05m dan manipulasi posisi numerik.

2. **Galeri & Feed Inspirasi Ruangan (Pinterest / Awwwards Aesthetic)**
   - Tampilan grid kartu modern bergaya editorial dengan filter kategori (Kamar Kos Minimalis, Estetik, Studio Apartment, Ruang Belajar, Desain Hemat Budget).
   - Pencarian real-time berdasarkan kata kunci dan filter estimasi budget.
   - Tombol simpan (bookmark) inspirasi langsung dari kartu feed.

3. **Detail Inspirasi & Kolaborasi Komunitas**
   - Rincian tahapan langkah penataan ruangan.
   - Daftar perabotan & estimasi biaya rincian belanja.
   - Tombol langsung untuk membuka konfigurasi ruangan di 3D Room Planner.
   - Formulir kirim ide desain (React Hook Form & Zod) dengan status pending moderasi admin.

4. **Koleksi Pribadi & Bookmark**
   - Manajemen desain ruangan tersimpan di `/my-designs` (buka, edit, atau hapus).
   - Daftar inspirasi tersimpan di `/saved`.

5. **Admin Panel & Moderasi**
   - Dashboard analitik ringkasan konten.
   - Moderasi kiriman pengguna (Setujui / Tolak submission).
   - Manajemen katalog master perabotan 3D (tambah item baru, atur ukuran LxPxT).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) & React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **3D Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **State Management**: Zustand
- **Form & Validasi**: React Hook Form, Zod, `@hookform/resolvers`
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, `@supabase/ssr`
- **Stock Imagery**: Pixabay API integration

---

## 🚀 Panduan Memulai Cepat (Local Development)

### 1. Prasyarat
- Node.js versi 18+ atau 20+ (diuji pada Node v24)
- npm versi 10+

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel environment berikut:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

PIXABAY_API_KEY=your-pixabay-api-key-here
NEXT_PUBLIC_PIXABAY_API_KEY=your-pixabay-api-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
> **Catatan**: Jika Supabase URL belum diisi atau masih menggunakan placeholder, Akalin akan otomatis berjalan dalam **Demo & Local Fallback Mode**. Semua fitur 3D Room Planner, simpan desain ke localStorage, katalog, galeri, dan admin panel berfungsi 100% tanpa error!

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 5. Menjalankan Tes Otomatis
```bash
npm test
```

### 6. Build Produksi
```bash
npm run build
npm start
```

---

## 🗄️ Database & Supabase Migrations

File migrasi database dan seed data telah disiapkan di folder `supabase/migrations/`:
1. `supabase/migrations/20261028000000_init_akalin_schema.sql` (Schema, Enums, Tables, Triggers & Row Level Security Policies)
2. `supabase/migrations/20261028000001_seed_akalin_data.sql` (Kategori, 12 item perabotan metrik standar, dan inspirasi awal)

### Menjalankan Migrasi di Supabase
1. Buka dashboard proyek Supabase Anda.
2. Masuk ke menu **SQL Editor**.
3. Buat New Query, lalu salin isi file `20261028000000_init_akalin_schema.sql` dan klik **Run**.
4. Salin isi file `20261028000001_seed_akalin_data.sql` dan klik **Run**.

### Mengaktifkan Akun Admin Pertama Secara Aman
Untuk memberikan peran admin pada pengguna pertama, jalankan query berikut di Supabase SQL Editor:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@akalin.id');
```
*Trigger pencegah eskalasi hak istimewa (`prevent_role_escalation`) melindungi agar pengguna biasa tidak dapat mengubah role mereka sendiri menjadi admin melalui API client.*

---

## 📁 Struktur Proyek

```
akalin/
├── supabase/
│   └── migrations/               # SQL schema migrations & seed data
├── src/
│   ├── app/                      # Next.js App Router routes
│   │   ├── page.tsx              # Landing page
│   │   ├── explore/              # Galeri inspirasi
│   │   ├── ideas/                # Detail & submission inspirasi
│   │   ├── furniture/            # Katalog perabotan 3D
│   │   ├── room-planner/         # 3D interactive room editor
│   │   ├── my-designs/           # Koleksi desain tersimpan
│   │   ├── saved/                # Inspirasi tersimpan (bookmarks)
│   │   ├── admin/                # Admin panel & moderasi
│   │   ├── login/                # Halaman login
│   │   └── register/             # Halaman registrasi
│   ├── components/
│   │   ├── layout/               # Navbar & Footer
│   │   └── room-planner/         # Three.js 3D Viewport, Sidebar & Toolbar
│   ├── lib/
│   │   ├── collision.ts          # Deteksi tabrakan AABB & Room bounds
│   │   ├── data-service.ts       # Unified Supabase & Local Data Access Layer
│   │   ├── mock-data.ts          # Dataset kamar & perabotan metrik
│   │   └── supabase/             # Client & Server SSR Supabase helpers
│   ├── stores/
│   │   └── useRoomStore.ts       # Zustand store untuk state editor 3D
│   └── types/                    # TypeScript interfaces & types
└── tests/
    └── suite.test.mjs            # Automated unit tests
```

---

## 📄 Lisensi
Hak Cipta © 2026 Akalin. Dibuat dengan cinta untuk solusi hunian cerdas dan terjangkau di Indonesia.

