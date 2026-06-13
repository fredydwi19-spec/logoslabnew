# 🏛️ LogosLAB Architecture & System Design

## 1. Tech Stack Overview
| Kategori | Teknologi |
|---|---|
| **Runtime** | Bun |
| **Backend Framework** | ElysiaJS |
| **ORM** | Drizzle ORM |
| **Database** | MySQL |
| **Frontend/UI** | Tailwind CSS |
| **Ikon** | Bootstrap Icons (Inline SVG / Local Class) |

---

## 2. Directory Structure
```text
logoslabnew/
├── public/
│   └── assets/           # File statis publik (misal: logo)
├── scripts/
│   ├── seed-admin.ts     # Skrip seeder untuk akun Ketua Tim (Admin)
│   └── test-db.ts        # Skrip one-time untuk uji koneksi database
├── src/
│   ├── db/
│   │   ├── index.ts      # ⭐ Entry point koneksi database (Drizzle + mysql2 pool)
│   │   └── schema.ts     # Definisi skema tabel Drizzle ORM
│   ├── plugins/
│   │   └── auth.ts       # Konfigurasi plugin autentikasi (JWT & Cookie)
│   ├── routes/
│   │   └── auth.ts       # Endpoint API untuk login, register, dan logout
│   ├── views/
│   │   ├── layout.ts     # Fungsi helper wrapper HTML (Tailwind & Fonts)
│   │   ├── landing.ts    # UI Landing Page
│   │   ├── login.ts      # UI Login Page
│   │   └── register.ts   # UI Register Page
│   └── index.ts          # Entry point server ElysiaJS (port 3000)
├── drizzle/              # Output hasil drizzle-kit generate (SQL migration files)
├── drizzle.config.ts     # Konfigurasi Drizzle Kit (schema path, dialek mysql, credentials)
├── .env                  # Variabel lingkungan — JANGAN di-commit ke git
├── .gitignore            # Mengecualikan .env, node_modules, dist
├── package.json          # Scripts: dev, db:generate, db:push, db:studio
├── ARCHITECTURE.md       # Dokumen arsitektur ini (single source of truth)
└── tsconfig.json         # Konfigurasi TypeScript
```

---

## 3. Database Configuration
- **Driver:** `mysql2` dengan connection pool
- **ORM:** `drizzle-orm/mysql2`
- **Entry Point Koneksi:** `src/db/index.ts`
- **Skema:** `src/db/schema.ts`
- **Konfigurasi Migrasi:** `drizzle.config.ts` — output folder `./drizzle/`, dialek `mysql`
- **Status Koneksi:** ✅ Terverifikasi terhubung ke `logoslab_dev`

### Environment Variables (`.env`)
> ⚠️ Jangan pernah commit file `.env` ke repositori.
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<isi_password_anda>
DB_NAME=logoslab_dev
DB_PORT=3306
DATABASE_URL="mysql://root:<password>@localhost:3306/logoslab_dev"
```

### Skrip Database (`package.json`)
| Script | Perintah | Keterangan |
|---|---|---|
| `bun run dev` | `bun --watch src/index.ts` | Jalankan server dev (watch mode) |
| `bun run db:generate` | `drizzle-kit generate` | Generate file SQL migration dari schema |
| `bun run db:push` | `drizzle-kit push` | Push skema langsung ke database (tanpa migration file) |
| `bun run db:studio` | `drizzle-kit studio` | Buka Drizzle Studio (GUI database browser) |

---

## 4. Skema Database (Tabel)
| Tabel | File | Keterangan |
|---|---|---|
| `users` | `src/db/schema.ts` | Menyimpan kredensial pengguna, hashed password, dan `role` (KETUA_TIM, PEMBUAT_MATERI, dsb.) |

---

## 5. API Routes & UI (ElysiaJS)
| Method | Path | Handler / File | Keterangan |
|---|---|---|---|
| GET | `/assets/*` | `@elysiajs/static` | Melayani file statis dari folder `public/assets` |
| GET | `/` | `src/views/landing.ts` | Landing Page (UI Frontend) |
| GET | `/login` | `src/views/login.ts` | Halaman Login (UI Frontend) |
| GET | `/register` | `src/views/register.ts` | Halaman Registrasi (UI Frontend) |
| POST | `/api/auth/register` | `src/routes/auth.ts` | Endpoint registrasi akun baru (password hashed) |
| POST | `/api/auth/login` | `src/routes/auth.ts` | Endpoint login, menghasilkan JWT Cookie (`session`) |
| POST | `/api/auth/logout` | `src/routes/auth.ts` | Endpoint logout, menghapus Cookie |

---

## 6. GitHub Issues & Feature Tracking
| Issue | Judul | Status |
|---|---|---|
| [#1](https://github.com/fredydwi19-spec/logoslabnew/issues/1) | Inisiasi Proyek (Bun Boilerplate) | ✅ Selesai |
| [#3](https://github.com/fredydwi19-spec/logoslabnew/issues/3) | Fitur Autentikasi: Login, Registrasi, dan RBAC | ✅ Didefinisikan ulang di #6 |
| [#4](https://github.com/fredydwi19-spec/logoslabnew/issues/4) | Setup Koneksi Database MySQL (Drizzle ORM & Bun) | ✅ Selesai |
| [#6](https://github.com/fredydwi19-spec/logoslabnew/issues/6) | Fitur: Entry Point - Landing Page, Login, dan RBAC Auth Backend | ✅ Selesai |

---

## 7. Catatan Arsitektural & Aturan
- **Anti-Regression:** Jangan ubah `drizzle.config.ts`, `src/db/index.ts`, dan `.gitignore` tanpa perencanaan dari High Agent.
- **DRY:** Semua akses database wajib melalui instance `db` yang diekspor dari `src/db/index.ts`. Template UI dilibatkan lewat `src/views/layout.ts`.
- **Keamanan:** Semua endpoint API wajib menggunakan validasi input dari Elysia `t` dan RBAC middleware. Sandi wajib menggunakan `Bun.password.hash()`. Sesi diamankan dengan HTTP-Only Cookie.
- **Konvensi Commit:** Gunakan format `feat:`, `fix:`, `chore:`, `docs:` pada pesan commit.

---

# LOGOSLAB ARCHITECTURE BLUEPRINT - MULTIROLE & SMART LEARNING PATH

## 8. CORE TECH STACK
- Runtime: Bun
- Backend Framework: ElysiaJS (Monolithic UI & API Presentation)
- ORM: Drizzle ORM
- Database: MySQL
- UI Styling: Tailwind CSS & Bootstrap Icons (Inline SVG/Local)
- Theme Principle: Clean Visual Theme (60% Off-White background, 30% Deep Navy #1A237E Elements, 10% Vibrant Orange #FF5722 / Electric Gold #FFC107 Actions)

## 9. DATABASE RELATIONAL SCHEMA (INTEGRATED BLUEPRINT)
### users
- id (int, PK, Serial)
- name (varchar)
- email (varchar, Unique)
- password (varchar, Hashed)
- role (enum: 'ketua_tim', 'pembuat_materi', 'pembuat_game', 'pakar', 'siswa')
- status (enum: 'pending', 'active', 'inactive' - Default: 'pending')

### courses
- id (int, PK, Serial)
- title (varchar)
- description (text)
- status (enum: 'draft', 'revision_needed', 'review', 'approved', 'published' - Default: 'draft')
- content_author_id (int, FK -> users.id)
- game_creator_id (int, FK -> users.id)
- expert_reviewer_id (int, FK -> users.id)

### contents
- id (int, PK, Serial)
- course_id (int, FK -> courses.id, Cascade Delete)
- title (varchar)
- body (text/markdown)
- indicator_tag (enum: 'kognitif', 'metodologis', 'kontekstual')

### games
- id (int, PK, Serial)
- course_id (int, FK -> courses.id, Cascade Delete)
- game_type (enum: 'pilihan_ganda', 'puzzle', 'pasang_kata')
- config_data (json) -> Menyimpan array pertanyaan dengan "indicator_tag" di dalam tiap objek soal.

### reviews
- id (int, PK, Serial)
- course_id (int, FK -> courses.id, Cascade Delete)
- reviewer_id (int, FK -> users.id)
- comment (text)
- status_recommendation (enum: 'revision_needed', 'approved')

### student_profiles
- id (int, PK, Serial)
- user_id (int, FK -> users.id, Cascade Delete)
- cognitive_score (int, default 0)
- methodological_score (int, default 0)
- contextual_score (int, default 0)
- current_level (enum: 'dasar', 'menengah', 'mahir' - Default: 'dasar')

## 10. DASHBOARD MAP & WORKFLOW SPECIFICATION

### GLOBAL SIDEBAR UX
- System: Iconic Collapsible Sidebar. Default width: 16 (Compact, icons only). Hover/Expand width: 64 (Shows text).
- Animation: Tailwind `transition-all duration-300 ease-in-out`.

### A. KETUA TIM DASHBOARD
1. Ringkasan (`bi-grid-1x2-fill`): Menampilkan Stat Cards berbasis Query COUNT dinamis (Bukan nilai statis di tabel users).
2. Manajemen Proyek (`bi-kanban`): Grid proyek aktif + Tombol Orange `[+] Buat Proyek Baru`. Klik tombol membuka modal pop-up untuk alokasi PIC awal.
3. Manajemen Tim (`bi-people-fill`): Pusat persetujuan pendaftaran akun baru (Approval Queue) & monitoring beban kerja real-time via SQL Aggregation Count (Menghitung proyek aktif yang belum 'published').
4. Kontrol Rilis (`bi-shield-check`): Daftar modul berstatus 'approved' untuk dirilis mutlak menjadi 'published' dengan satu klik tombol Orange.

### B. PEMBUAT MATERI WORKSPACE
1. Editor Modul (`bi-pencil-square`): Text area untuk menulis isi draf. Dilengkapi pilihan wajib `indicator_tag`. Klik `[AJUKAN KE PAKAR]` mengubah status course menjadi 'review' dan mengunci editor menjadi Read-Only.
2. Log Catatan Pakar (`bi-chat-left-text-fill`): Menampilkan riwayat kritik dari tabel `reviews` jika status kembali ke 'revision_needed'.

### C. PEMBUAT GAME STUDIO
1. Studio Game (`bi-controller`): Split-Screen Layout. Sisi kiri merender teks `contents` (Read-Only), sisi kanan form input kuis/game. Klik `[SEMATKAN GAME]` menyimpan konfigurasi ke tabel `games` dalam format JSON bertag indikator keagamaan Kristen/Alkitabiah.

### D. PAKAR EVALUASI PANEL
1. Antrean Tinjauan (`bi-clipboard-check-fill`): Menampilkan proyek berstatus 'review'. Menyediakan Live Preview Simulator (Gabungan teks materi dan game interaktif yang bisa diuji klik). Menyediakan form evaluasi untuk aksi tombol `[MINTA REVISI]` atau `[SETUJUI / APPROVE]`.

## 11. SMART E-LEARNING BRIDGE INTERACTION
- System Engine: Backend ElysiaJS mencocokkan `student_profiles.current_level` dengan `contents.indicator_tag` dan data JSON di `games.config_data`.
- Data Integration: Tim bertindak sebagai penyuplai data berlabel, sistem web bertindak sebagai penyaring konten adaptif di sisi dashboard Siswa secara real-time.