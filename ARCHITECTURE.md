# Dokumen Arsitektur: LogosLAB

> **Versi:** 2.0.0
> **Diperbarui:** 2026-06-15
> **Status:** Aktif / Dalam Pengembangan

---

## 1. Ikhtisar Sistem

**LogosLAB** adalah platform **Smart E-Learning** berbasis web yang dirancang untuk mendukung siklus penuh pembuatan dan distribusi konten pembelajaran interaktif — mulai dari penulisan modul materi, pembuatan game edukasi, evaluasi pakar, hingga konsumsi oleh siswa.

Sistem ini dibangun sebagai **monolitik server-rendered application** yang menggabungkan backend API dan frontend HTML dalam satu proses Bun/Elysia, tanpa pemisahan klien SPA. Halaman UI di-render di sisi server (SSR via template string TypeScript) dan dikirimkan langsung sebagai respons HTML.

### 1.1 Tujuan Platform
- Menyediakan alur kerja kolaboratif bagi tim pembuat konten e-learning.
- Mengimplementasikan review berbasis pakar sebelum konten dipublikasikan.
- Memberikan pengalaman belajar adaptif bagi siswa berdasarkan profil kompetensi.

---

## 2. Stack Teknologi

| Kategori | Teknologi | Versi |
|---|---|---|
| **Runtime** | Bun | Latest |
| **Framework Web** | Elysia | ^1.4.28 |
| **Bahasa** | TypeScript | ^5.x |
| **Database** | MySQL | - |
| **ORM** | Drizzle ORM | ^0.45.2 |
| **Migrasi DB** | Drizzle Kit | ^0.31.10 |
| **Autentikasi** | JWT (`@elysiajs/jwt`) | ^1.4.2 |
| **Session** | Cookie (`@elysiajs/cookie`) | ^0.8.0 |
| **Static Files** | `@elysiajs/static` | ^1.4.10 |
| **CSS Framework** | Tailwind CSS (via CDN) | Latest |
| **JS Frontend** | Alpine.js (via CDN) | ^3.x |
| **Ikon** | Bootstrap Icons (via CDN) | 1.11.3 |
| **Font** | Google Fonts (Poppins, Inter) | - |

### 2.1 Perintah Operasional

```bash
# Menjalankan server development (hot-reload)
bun run dev

# Menghasilkan file migrasi dari perubahan schema
bun run db:generate

# Mendorong schema ke database
bun run db:push

# Membuka Drizzle Studio (GUI database)
bun run db:studio
```

---

## 3. Struktur Direktori

```
logoslabnew/
├── src/                          # Seluruh source code aplikasi
│   ├── index.ts                  # Entry point utama, registrasi plugin & route
│   ├── db/                       # Lapisan database
│   │   ├── db.ts                 # Inisialisasi koneksi MySQL + Drizzle instance
│   │   ├── schema.ts             # Definisi seluruh tabel & relasi (single source of truth)
│   │   └── index.ts              # Re-export db & schema
│   ├── plugins/                  # Plugin Elysia yang dapat digunakan ulang
│   │   ├── auth.ts               # Plugin JWT + Cookie, helper getCurrentUser()
│   │   └── rbac.ts               # Plugin RBAC, helper requireRole()
│   ├── routes/                   # Handler route HTTP
│   │   ├── auth.ts               # Endpoint API autentikasi (/api/auth/*)
│   │   └── dashboard.ts          # Route dashboard per peran (/dashboard/*)
│   └── views/                    # Layer presentasi (Server-Side Rendering)
│       ├── layout.ts             # HTML shell global + injeksi sidebar
│       ├── landing.ts            # Halaman landing page publik
│       ├── login.ts              # Halaman login
│       ├── register.ts           # Halaman registrasi
│       └── components/
│           └── sidebar.ts        # Komponen navigasi sidebar (berbasis peran)
├── public/                       # Aset statis yang dilayani secara publik
│   └── assets/
│       └── LogosLAB.png          # Logo brand utama
├── drizzle/                      # File migrasi database (auto-generated)
│   ├── 0000_colorful_sue_storm.sql
│   ├── 0001_daily_gauntlet.sql
│   ├── 0002_silly_cyclops.sql
│   └── meta/                     # Metadata snapshot Drizzle Kit
├── .env                          # Variabel lingkungan (tidak di-commit)
├── drizzle.config.ts             # Konfigurasi Drizzle Kit
├── package.json                  # Dependensi & skrip npm/bun
└── tsconfig.json                 # Konfigurasi TypeScript
```

---

## 4. Arsitektur Sistem

### 4.1 Diagram Alur Request

```
Browser
  │
  ▼
[Elysia Server : port 3000]
  │
  ├── GET /                  →  renderLanding()  →  HTML Response
  ├── GET /login             →  renderLogin()    →  HTML Response
  ├── GET /register          →  renderRegister() →  HTML Response
  │
  ├── POST /api/auth/register  →  authRoutes → DB Insert → JSON Response
  ├── POST /api/auth/login     →  authRoutes → DB Query → Set Cookie (JWT) → JSON
  ├── POST /api/auth/logout    →  authRoutes → Remove Cookie → JSON Response
  │
  └── GET /dashboard/*         →  dashboardRoutes
        │
        ├── JWT Decode (localRole) via .derive()
        ├── requireRole([...allowedRoles]) via .onBeforeHandle()
        │
        ├── /dashboard/ketua/*       →  Ketua Tim
        ├── /dashboard/materi/*      →  Pembuat Materi
        ├── /dashboard/game/*        →  Pembuat Game
        ├── /dashboard/pakar/*       →  Pakar
        └── /dashboard/siswa/*       →  Siswa
```

### 4.2 Pola Arsitektur

Aplikasi mengadopsi pola **Layered Architecture** dengan tiga lapisan utama:

```
┌─────────────────────────────────────────┐
│          PRESENTATION LAYER             │
│  src/views/ (SSR Template Strings)      │
│  Tailwind CSS + Alpine.js (CDN)         │
└─────────────┬───────────────────────────┘
              │  htmlLayout() + renderSidebar()
┌─────────────▼───────────────────────────┐
│           APPLICATION LAYER             │
│  src/routes/ (Route Handlers)           │
│  src/plugins/ (Auth, RBAC Middleware)   │
└─────────────┬───────────────────────────┘
              │  Drizzle ORM queries
┌─────────────▼───────────────────────────┐
│             DATA LAYER                  │
│  src/db/schema.ts (Drizzle Schema)      │
│  MySQL Database                         │
└─────────────────────────────────────────┘
```

---

## 5. Skema Database

Database MySQL bernama `logoslabnew` terdiri dari **7 tabel** utama.

### 5.1 Diagram Relasi Entitas (ERD)

```
users (1) ──────────────── (N) courses [sebagai content_author_id]
users (1) ──────────────── (N) courses [sebagai game_creator_id]
users (1) ──────────────── (N) courses [sebagai expert_reviewer_id]
users (1) ──────────────── (1) student_profiles
users (1) ──────────────── (N) student_progress
users (1) ──────────────── (N) reviews [sebagai reviewer_id]

courses (1) ─────────────── (N) contents       [CASCADE DELETE]
courses (1) ─────────────── (N) games           [CASCADE DELETE]
courses (1) ─────────────── (N) reviews         [CASCADE DELETE]
courses (1) ─────────────── (N) student_progress [CASCADE DELETE]
```

### 5.2 Definisi Tabel

#### `users` — Pengguna Sistem
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT PK | ID unik pengguna |
| `name` | VARCHAR(255) | Nama lengkap |
| `email` | VARCHAR(255) UNIQUE | Email (digunakan sebagai login) |
| `password` | VARCHAR(255) | Hash bcrypt (via `Bun.password`) |
| `role` | ENUM | `ketua_tim`, `pembuat_materi`, `pembuat_game`, `pakar`, `siswa` |
| `status` | ENUM | `pending` (default), `active`, `inactive` |
| `created_at` | TIMESTAMP | Waktu registrasi |

> **Catatan:** Akun baru selalu masuk dengan status `pending` dan harus disetujui oleh `ketua_tim`.

#### `courses` — Proyek/Modul Pembelajaran
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT PK | ID unik proyek |
| `title` | VARCHAR(255) | Judul proyek |
| `description` | TEXT | Deskripsi (nullable) |
| `status` | ENUM | `draft`, `revision_needed`, `review`, `approved`, `published` |
| `content_author_id` | INT FK → users | PIC pembuat materi |
| `game_creator_id` | INT FK → users | PIC pembuat game |
| `expert_reviewer_id` | INT FK → users | Pakar yang mengulas |
| `indicator_tag` | ENUM | `kognitif`, `metodologis`, `kontekstual` (default: kognitif) |
| `current_level` | ENUM | `dasar`, `menengah`, `mahir` (default: dasar) |
| `created_at` | TIMESTAMP | Waktu pembuatan |

#### `contents` — Isi Modul (Teks/Materi)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT PK | ID unik konten |
| `course_id` | INT FK → courses | Proyek induk (CASCADE DELETE) |
| `title` | VARCHAR(255) | Judul bagian materi |
| `body` | TEXT | Isi materi teks |
| `indicator_tag` | ENUM | `kognitif`, `metodologis`, `kontekstual` |

#### `games` — Konfigurasi Game Edukasi
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT PK | ID unik game |
| `course_id` | INT FK → courses | Proyek induk (CASCADE DELETE) |
| `game_type` | ENUM | `pilihan_ganda`, `puzzle`, `pasang_kata` |
| `config_data` | JSON | Konfigurasi pertanyaan/aturan game |

#### `reviews` — Catatan Review Pakar
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT PK | ID unik review |
| `course_id` | INT FK → courses | Proyek yang diulas (CASCADE DELETE) |
| `reviewer_id` | INT FK → users | Pakar pemberi ulasan |
| `comment` | TEXT | Komentar/catatan review |
| `status_recommendation` | ENUM | `revision_needed`, `approved` |
| `created_at` | TIMESTAMP | Waktu review |

#### `student_profiles` — Profil Kompetensi Siswa
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT PK | ID unik profil |
| `user_id` | INT FK → users | Siswa pemilik profil (CASCADE DELETE) |
| `cognitive_score` | INT | Skor kompetensi kognitif (default: 0) |
| `methodological_score` | INT | Skor kompetensi metodologis (default: 0) |
| `contextual_score` | INT | Skor kompetensi kontekstual (default: 0) |
| `current_level` | ENUM | `dasar` (default), `menengah`, `mahir` |

#### `student_progress` — Progres Belajar Siswa
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INT AUTO_INCREMENT PK | ID unik progres |
| `student_id` | INT FK → users | Siswa (CASCADE DELETE) |
| `course_id` | INT FK → courses | Kursus yang diakses (CASCADE DELETE) |
| `score_obtained` | INT | Skor yang diperoleh (default: 0) |
| `is_completed` | BOOLEAN | Status penyelesaian (default: false) |

---

## 6. Sistem Autentikasi & Otorisasi

### 6.1 Alur Autentikasi

```
[1] User POST /api/auth/login (JSON: {email, password})
      │
[2]  DB query → cari user by email
      │
[3]  Bun.password.verify(plaintext, hash)
      │
[4]  jwt.sign({ id, email, role }) → JWT Token
      │
[5]  Set-Cookie: session=<JWT>; HttpOnly; SameSite=Lax; MaxAge=7hari
      │
[6]  Response: { success: true, role: "..." }
      │
[7]  Frontend JS → redirect ke /dashboard/<rolePath>
```

### 6.2 Plugin `authPlugin` (`src/plugins/auth.ts`)

Plugin ini adalah fondasi autentikasi. Fungsi utamanya:

- Mendaftarkan `@elysiajs/jwt` dengan `JWT_SECRET` dari environment.
- Mendaftarkan `@elysiajs/cookie` untuk membaca/menulis cookie.
- Menyuntikkan helper `getCurrentUser()` ke dalam context setiap request via `.derive()`.

```typescript
// Cara pakai: ctx.getCurrentUser() → { id, email, role } | null
```

### 6.3 Plugin `rbacPlugin` & `requireRole` (`src/plugins/rbac.ts`)

- **`rbacPlugin`**: Mengekstrak `user` dan `userRole` dari session JWT ke context request.
- **`requireRole(allowedRoles[])`**: Factory function yang mengembalikan middleware Elysia. Middleware ini memblokir request dengan `401` (belum login) atau `403` (role tidak diizinkan) sebelum handler dieksekusi.

```typescript
// Contoh penggunaan di route:
.use(requireRole(['ketua_tim']))
```

### 6.4 Mekanisme JWT di Dashboard

Karena route dashboard menggunakan instance JWT terpisah (`jwtDashboard`) untuk menghindari konflik nama, decode role dilakukan via `.derive()` di level `dashboardRoutes` dan hasilnya disimpan sebagai `ctx.localRole`. Nilai ini kemudian diteruskan ke `htmlLayout()` untuk merender sidebar yang sesuai.

---

## 7. Sistem Peran (Role-Based Access Control)

Platform mendefinisikan **5 peran** dengan akses dan tanggung jawab berbeda:

| Peran | Path Dashboard | Akses & Fitur |
|---|---|---|
| `ketua_tim` | `/dashboard/ketua` | Ringkasan eksekutif (KPI), manajemen proyek (CRUD), approval anggota (pending → active), kontrol rilis modul |
| `pembuat_materi` | `/dashboard/materi` | Editor modul konten, melihat log catatan/kritik dari pakar |
| `pembuat_game` | `/dashboard/game` | Studio pembuatan game edukasi (split-screen: materi + form kuis) |
| `pakar` | `/dashboard/pakar` | Antrean tinjauan modul berstatus `review`, live preview simulator |
| `siswa` | `/dashboard/siswa` | Kuis pemetaan kompetensi, ruang kelas adaptif, mode belajar, leaderboard |

### 7.1 Alur Status Modul (Course Lifecycle)

```
[Pembuat Materi]          [Pembuat Game]          [Pakar]             [Ketua Tim]
     │                          │                    │                     │
  Buat Draf  ──────────────────►│                    │                     │
  status: draft                 │                    │                     │
                         Tambah Game                 │                     │
                                │                    │                     │
                                └──► Submit Review   │                     │
                                     status: review  │                     │
                                                     │                     │
                                              Tinjauan Pakar               │
                                              ┌──────┴──────┐              │
                                         Revisi          Setujui           │
                                     status:         status: approved       │
                                   revision_needed        │                │
                                                          │         Rilis Publik
                                                          └────────► status: published
```

---

## 8. Layer Presentasi (Views & UI)

### 8.1 Pola Rendering

Aplikasi menggunakan pendekatan **Server-Side Rendering (SSR) dengan Template String TypeScript**. Tidak ada framework frontend (React, Vue, dll). HTML dirakit di server sebagai string biasa.

```typescript
// Contoh pola: route → query DB → bangun HTML string → Response
return new Response(htmlLayout("Judul", contentHtml, role), {
  headers: { "Content-Type": "text/html" }
});
```

### 8.2 `htmlLayout` (`src/views/layout.ts`)

Fungsi ini adalah **HTML shell global** yang membungkus semua halaman. Ia menyertakan:

- Meta tags (charset, viewport)
- Google Fonts: **Poppins** (display/heading) & **Inter** (body)
- Tailwind CSS via CDN dengan konfigurasi custom (warna brand, font)
- Alpine.js via CDN (untuk interaktivitas ringan, contoh: modal)
- Sidebar (jika ada `role` yang diteruskan)
- `body` content dari route masing-masing

**Konfigurasi Tailwind Custom (60-30-10 Color Rule):**
```javascript
colors: {
  navy: '#1A237E',  // 60% — warna dominan (latar, teks utama)
  gold: '#FFC107',  // 30% — warna sekunder (aksen, fokus input)
  orange: {
    DEFAULT: '#FF5722',  // 10% — warna aksen CTA (tombol, highlight)
    hover: '#E64A19'
  }
}
```

### 8.3 Komponen Sidebar (`src/views/components/sidebar.ts`)

Sidebar bersifat **responsif dan berbasis peran**. Perilakunya:
- **Default state**: lebar `64px` (ikon saja).
- **Hover state**: melebar ke `256px` dengan animasi transisi smooth, menampilkan label teks.
- Menu navigasi yang ditampilkan sepenuhnya bergantung pada nilai `role` yang diteruskan.

**Menu per Peran:**

| Peran | Menu |
|---|---|
| `ketua_tim` | Ringkasan, Manajemen Proyek, Manajemen Tim, Kontrol Rilis |
| `pembuat_materi` | Editor Modul, Log Catatan Pakar |
| `pembuat_game` | Studio Game |
| `pakar` | Antrean Tinjauan |
| `siswa` | Kuis Pemetaan, Ruang Kelas Adaptif, Mode Belajar, Leaderboard |

### 8.4 Halaman Publik

| Halaman | Path | Deskripsi |
|---|---|---|
| Landing Page | `GET /` | Pengenalan platform, fitur utama, CTA untuk mendaftar |
| Login | `GET /login` | Form login dengan show/hide password, submit via `fetch()` JSON |
| Register | `GET /register` | Form registrasi 4 field (nama, email, password, role), redirect ke login setelah sukses |

---

## 9. API Endpoint

### 9.1 Auth Routes (`/api/auth/*`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ Public | Mendaftarkan pengguna baru. Status awal: `pending`. |
| `POST` | `/api/auth/login` | ❌ Public | Login. Set cookie `session` (JWT, httpOnly, 7 hari). |
| `POST` | `/api/auth/logout` | ❌ Public | Logout. Hapus cookie `session`. Melakukan redirect (302) kembali ke beranda `/`. |

**Body Register:**
```json
{
  "name": "string (min 3 char)",
  "email": "valid email",
  "password": "string (min 8 char)",
  "role": "ketua_tim | pembuat_materi | pembuat_game | pakar | siswa"
}
```

**Body Login:**
```json
{
  "email": "valid email",
  "password": "string (min 8 char)"
}
```

**Response Login (sukses):**
```json
{ "success": true, "role": "ketua_tim" }
```

### 9.2 Dashboard Routes (`/dashboard/*`)

Semua route dashboard mengembalikan **HTML response** (bukan JSON).

| Method | Path | Peran Diizinkan | Deskripsi |
|---|---|---|---|
| `GET` | `/dashboard/ketua` | `ketua_tim` | Ringkasan KPI (total proyek, review, anggota, siswa) |
| `GET` | `/dashboard/ketua/proyek` | `ketua_tim` | Manajemen proyek + modal buat proyek baru |
| `POST` | `/dashboard/ketua/proyek` | `ketua_tim` | Proses submit form pembuatan proyek baru |
| `GET` | `/dashboard/ketua/tim` | `ketua_tim` | Tabel approval anggota berstatus `pending` |
| `GET` | `/dashboard/ketua/rilis` | `ketua_tim` | Daftar modul `approved` siap dirilis ke publik |
| `GET` | `/dashboard/materi` | `pembuat_materi` | Editor modul (placeholder) |
| `GET` | `/dashboard/materi/log` | `pembuat_materi` | Log catatan pakar (placeholder) |
| `GET` | `/dashboard/game` | `pembuat_game` | Studio game (placeholder) |
| `GET` | `/dashboard/pakar` | `pakar` | Antrean tinjauan (placeholder) |
| `GET` | `/dashboard/siswa` | `siswa` | Dashboard siswa (placeholder) |

---

## 10. Variabel Lingkungan

File `.env` (tidak di-commit ke git) harus mendefinisikan variabel berikut:

```env
# URL koneksi database MySQL
DATABASE_URL="mysql://user:password@host:port/logoslabnew"

# Secret key untuk menandatangani JWT (harus kuat & rahasia)
JWT_SECRET="your-super-secret-jwt-key"
```

> **Peringatan:** Jika `JWT_SECRET` tidak tersedia saat startup, aplikasi akan melempar error dan berhenti (`throw new Error`).

---

## 11. Aset Statis

Plugin `@elysiajs/static` dikonfigurasi untuk melayani konten dari folder `public/` dengan prefix path `/`.

```typescript
.use(staticPlugin({ assets: "public", prefix: "/" }))
```

Sehingga file `public/assets/LogosLAB.png` dapat diakses via URL `/assets/LogosLAB.png`.

---

## 12. Migrasi Database

Drizzle Kit digunakan untuk manajemen migrasi. File migrasi tersimpan di folder `drizzle/` dan dihasilkan otomatis dari perubahan `src/db/schema.ts`.

| File Migrasi | Isi |
|---|---|
| `0000_colorful_sue_storm.sql` | Pembuatan awal seluruh tabel (users, courses, contents, games, reviews, student_profiles) + semua foreign key |
| `0001_daily_gauntlet.sql` | Penambahan tabel `student_progress` |
| `0002_silly_cyclops.sql` | Penambahan kolom `status` pada tabel `users` |

---

## 13. Status Implementasi

| Fitur | Status |
|---|---|
| Registrasi & Login pengguna | ✅ Selesai |
| Logout | ✅ Selesai |
| Middleware Auth (JWT + Cookie) | ✅ Selesai |
| Middleware RBAC (requireRole) | ✅ Selesai |
| Dashboard Ketua Tim — KPI Summary | ✅ Selesai |
| Dashboard Ketua Tim — Manajemen Proyek (view + modal) | ✅ Selesai |
| Dashboard Ketua Tim — Manajemen Proyek (POST/form) | ✅ Selesai |
| Dashboard Ketua Tim — Approval Anggota | ✅ Selesai |
| Dashboard Ketua Tim — Kontrol Rilis | ✅ Selesai |
| Sidebar adaptif per peran | ✅ Selesai |
| Landing Page | ✅ Selesai |
| Halaman Login (dengan show/hide password) | ✅ Selesai |
| Halaman Register | ✅ Selesai |
| Static file serving (logo) | ✅ Selesai |
| Dashboard Pembuat Materi — Editor Modul | 🚧 Placeholder |
| Dashboard Pembuat Materi — Log Catatan Pakar | 🚧 Placeholder |
| Dashboard Pembuat Game — Studio Game | 🚧 Placeholder |
| Dashboard Pakar — Antrean Tinjauan | 🚧 Placeholder |
| Dashboard Siswa — Semua Fitur | 🚧 Placeholder |
| API CRUD Kursus (`/api/courses`) | 🚧 Belum Diimplementasikan |
| API Approval Pengguna (`/api/users/:id/approve`) | 🚧 Belum Diimplementasikan |
| API Publish Kursus (`/api/courses/:id/publish`) | 🚧 Belum Diimplementasikan |

---

## 14. Panduan Pengembangan Selanjutnya

### 14.1 Menambahkan API Baru
1. Buat file baru di `src/routes/` atau tambahkan endpoint ke file yang sudah ada.
2. Gunakan `requireRole([...])` untuk proteksi akses.
3. Daftarkan route di `src/index.ts` menggunakan `.use()`.

### 14.2 Menambahkan Tabel Baru
1. Definisikan tabel dan relasinya di `src/db/schema.ts`.
2. Jalankan `bun run db:generate` untuk membuat file migrasi.
3. Jalankan `bun run db:push` untuk menerapkan migrasi ke database.

### 14.3 Menambahkan Halaman Baru
1. Buat file view di `src/views/`.
2. Gunakan `htmlLayout(title, bodyHtml, role?)` untuk membungkus konten.
3. Daftarkan route `GET` yang sesuai di `src/index.ts` atau `src/routes/`.

### 14.4 Menambahkan Menu Sidebar
1. Buka `src/views/components/sidebar.ts`.
2. Tambahkan tag `<a>` baru ke blok kondisional `if (role === '...')` yang sesuai.

---

## 15. Catatan Perbaikan (Changelog) Terkini

- **[UI] Scrollable Modal:** Modal "Buat Proyek Baru" pada Dashboard Ketua Tim kini mendukung _scroll behavior_ vertikal (`max-h-[90vh] overflow-y-auto`) agar tetap responsif pada layar beresolusi kecil dan form tidak terpotong.
- **[Auth] Fix Logout Redirect:** Endpoint `POST /api/auth/logout` dimodifikasi dari semula mengembalikan respons JSON menjadi mengirimkan standar objek `Response` (HTTP Status 302) agar pengalihan ke beranda (_landing page_) berhasil dieksekusi secara mulus pasca _form submission_.