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

## 10. DASHBOARD & WORKSPACE CORE LOGOSLAB (V2 - INTEGRATED)
### I. SPESIFIKASI GLOBAL UI & NAVIGASI
- Komponen Utama: Iconic Collapsible Sidebar.
- Dimensi & Perilaku: Default width saat menciut adalah w-16 (hanya menampilkan ikon Bootstrap) dan mengembang menjadi w-64 saat kursor diarahkan (hover) untuk menampilkan teks label menu.
- Animasi: Menggunakan utilitas transisi bawaan Tailwind CSS (transition-all duration-300 ease-in-out).
- Aset Visual: Logo resmi LogosLAB wajib diletakkan secara permanen di bagian atas sidebar menggunakan relative path /public/assets/Logo LogosLAB.png.
- Aturan Warna Baku (60-30-10):
    - 60% (Dominan): Putih / off-white sebagai warna latar belakang area konten utama dashboard untuk menjaga kebersihan visual (clean theme).
    - 30% (Struktural): Deep Navy (#1A237E) digunakan eksklusif untuk Sidebar, Top Navbar, dan pembatas komponen struktural.
    - 10% (Aksen/Aksi): Vibrant Orange murni untuk Tombol Aksi Utama (Call to Action/CTA) dan Electric Gold (#FFC107) khusus untuk penanda status penting/minimalis.

### II. PEMETAAN MENU & SKEMA PENGGUNAAN BERDASARKAN ROLE
#### A. KETUA TIM DASHBOARD (Workspace Kontrol & Approval)
- Menu 1: Ringkasan Eksekutif (bi-grid-1x2-fill)
    - Fungsi: Menampilkan kartu statistik performa sistem (Total Proyek Aktif, Modul dalam Review, Anggota Tim Aktif, Total Siswa Terdaftar).
    - Skema Data: Data angka wajib diambil langsung melalui agregasi query COUNT dinamis dari MySQL saat halaman dimuat, bukan membaca nilai statis dari tabel.

- Menu 2: Manajemen Proyek (bi-kanban)
    - Fungsi: Menampilkan grid kartu proyek e-learning yang sedang berjalan.
- Skema Data: Terdapat tombol aksen Orange [+] Buat Proyek Baru. Jika diklik, sistem membuka modal pop-up interaktif untuk menginput Judul Proyek, Deskripsi, dan memilih PIC awal dengan memetakan ID pengguna ke kolom content_author_id, game_creator_id, dan expert_reviewer_id pada tabel courses. Status default proyek otomatis terisi draft.

-Menu 3: Manajemen Tim & Approval Queue (bi-people-fill)
    - Fungsi: Pusat persetujuan pendaftaran akun baru bagi kolaborator internal dan monitoring beban kerja tim.
    - Skema Data: Menampilkan daftar pengguna dari tabel users yang berstatus pending. Ketua Tim dapat melakukan klik Approve untuk mengubah status menjadi active. Sistem juga menampilkan grafik/angka beban kerja yang dihitung via SQL Aggregation Count (menghitung berapa banyak proyek aktif di tabel courses berstatus non-published yang sedang dipegang oleh masing-masing PIC).

Menu 4: Kontrol Rilis Modul (bi-shield-check)
    - Fungsi: Gerbang akhir publikasi materi ke sisi siswa.
    - Skema Data: Menampilkan daftar modul yang telah berstatus approved (sudah lolos uji Pakar di tabel courses). Ketua Tim dapat menekan satu tombol Orange untuk mengubah status modul dari approved menjadi published, sehingga modul tersebut seketika muncul di halaman siswa.

#### B. PEMBUAT MATERI WORKSPACE (Workspace Produksi Konten)
- Menu 1: Editor Modul Utama (bi-pencil-square)
    - Fungsi: Tempat menyusun narasi, teks, dan draf materi akademis.
    - Skema Data: Menyediakan Form Text Area responsif yang terhubung ke tabel contents. Penulis wajib memilih salah satu kategori kompetensi melalui dropdown indicator_tag sesuai enum database (kognitif, metodologis, kontekstual). Setelah selesai, penulis mengklik tombol [AJUKAN KE PAKAR]. Aksi ini akan mengubah status di tabel courses menjadi review dan seketika mengunci halaman editor ini menjadi Read-Only agar materi tidak dapat dimanipulasi selama proses penilaian.

- Menu 2: Log Catatan & Kritik Pakar (bi-chat-left-text-fill)
    - Fungsi: Kotak masuk umpan balik jika materi ditolak.
    - Skema Data: Jika Pakar menolak draf, status di tabel courses berubah menjadi revision_needed dan editor kembali terbuka. Menu ini akan merender teks riwayat kritik dari tabel reviews berdasarkan ID modul secara kronologis sebagai panduan perbaikan materi.

#### C. PEMBUAT GAME STUDIO (Workspace Gamifikasi)
- Menu 1: Studio Integrasi Kuis (bi-controller)
    - Fungsi: Menyisipkan elemen permainan interaktif ke dalam materi yang sedang disusun.
    - Skema Data: Menggunakan antarmuka Split-Screen Layout. Sisi kiri layar menampilkan teks draf materi dari tabel contents secara statis dan Read-Only sebagai referensi pembuatan soal. Sisi kanan menyediakan form dinamis untuk menyusun tipe permainan sesuai enum database (pilihan_ganda, puzzle, pasang_kata). Ketika tombol [SEMATKAN GAME] diklik, sistem akan mengompilasi data tersebut ke dalam format objek JSON terstruktur dan menyimpannya ke tabel games. Di dalam objek JSON tiap soal, wajib disematkan metadata indicator_tag (kognitif, metodologis, kontekstual) untuk mensuplai sistem penilaian profil siswa.

#### D. PAKAR EVALUASI PANEL (Workspace Audit & Validasi Konten)
- Menu 1: Antrean Tinjauan Mutu (bi-clipboard-check-fill)
    - Fungsi: Memeriksa dan menguji kelayakan paket e-learning.
    - Skema Data: Menampilkan semua proyek di tabel courses yang mana kolom expert_reviewer_id adalah ID Pakar tersebut dan berstatus review. Di dalam menu ini terdapat komponen Live Preview Simulator, sebuah area isolasi yang menggabungkan draf materi dari tabel contents di satu tab, dan me-render langsung purwarupa game interaktif dari tabel games di tab lainnya sehingga Pakar bisa menguji klik fungsionalitasnya.

- Menu 2: Form Keputusan Evaluasi
    - Fungsi: Memberikan keputusan resmi hasil peninjauan.
    - Skema Data: Pakar wajib mengisi kolom komentar teks yang akan disimpan ke tabel reviews, lalu memilih satu dari dua tombol keputusan:
    - Tombol [MINTA REVISI]: Menyimpan status_recommendation sebagai revision_needed di tabel reviews dan mengubah status proyek di tabel courses menjadi revision_needed.
    - Tombol [SETUJUI / APPROVE]: Menyimpan status_recommendation sebagai approved di tabel reviews dan mengubah status proyek di tabel courses menjadi approved.

#### E. SISWA LEARNING SPACE (Smart Adaptive Learning Workflow)
- Menu 1: Gerbang Diagnostik / Kuis Pemetaan (bi-clipboard-data-fill)
    - Fungsi: Mengukur kompetensi dasar siswa baru berdasarkan 3 aspek utama (kognitif, metodologis, kontekstual).
    - Skema Data: Saat siswa baru pertama kali masuk ke aplikasi, seluruh Ruang Kelas dikunci. Mereka wajib menyelesaikan Kuis Pemetaan awal ini. Begitu selesai, backend ElysiaJS akan menghitung persentase jawaban benar untuk masing-masing pilar skor, lalu memperbarui kolom cognitive_score, methodological_score, dan contextual_score, serta menentukan level global (dasar, menengah, mahir) pada tabel student_profiles.

- Menu 2: Ruang Kelas Adaptif (bi-journal-bookmark-fill)
    - Fungsi: Menampilkan daftar silabus yang dipersonalisasi.
    - Skema Data: Berdasarkan data skor kompetensi di student_profiles, database MySQL secara cerdas melakukan filtering untuk membuka kunci modul-modul berstatus published di tabel courses yang memiliki contents.indicator_tag paling sesuai dengan pilar skor terendah/kebutuhan siswa tersebut terlebih dahulu (Personalized Learning Path). Modul dirender dalam bentuk grid kartu lengkap dengan tag kompetensi dan Progress Bar belajar dinamis yang diambil dari tabel progres.

- Menu 3: Mode Belajar & Bermain (bi-play-btn-fill)
    - Fungsi: Area konsumsi materi pembelajaran interaktif.
    - Skema Data: Menggunakan Split-Screen Layout. Sisi kiri merender teks materi dari tabel contents (menggunakan format markdown/text leading-relaxed). Sisi kanan memuat engine runtime yang langsung membaca dan menjalankan konfigurasi objek JSON dari tabel games menjadi kuis interaktif sesuai game_type. Tombol "Selesai Modul" terkunci secara mutlak sampai siswa menyelesaikan game dengan batas skor minimum. Begitu sukses, sistem mengupdate status progres modul siswa tersebut menjadi 100% (Selesai).

- Menu 4: Papan Peringkat / Leaderboard (bi-trophy-fill)
    - Fungsi: Panel motivasi sosial berbasis kompetisi sehat.
    - Skema Data: Menampilkan peringkat akumulasi nilai siswa secara real-time yang dikalkulasi menggunakan agregasi total skor gabungan (cognitive_score + methodological_score + contextual_score) dari tabel student_profiles.

### III. ARSITEKTUR DATA (DRIZZLE ORM & MYSQL SCHEMAS)
Berikut adalah detail teknis dari struktur tabel database MySQL menggunakan Drizzle ORM yang harus dipertahankan dan dikembangkan untuk mendukung seluruh fungsionalitas dashboard:

#### A. Spesifikasi Tabel dan Kolom
- Tabel users (Data Pengguna, Akun & Otorisasi)

    - id: serial().primaryKey() — ID unik otomatis.

    - name: varchar({ length: 255 }).notNull() — Nama lengkap pengguna.

    - email: varchar({ length: 255 }).notNull().unique() — Email unik untuk login.

    - password: varchar({ length: 255 }).notNull() — String password hasil enkripsi hash Bun.password.hash.

    - role: mysqlEnum(['ketua_tim', 'pembuat_materi', 'pembuat_game', 'pakar', 'siswa']).notNull() — Penentu hak akses dashboard.

    - status: mysqlEnum(['pending', 'active', 'inactive']).default('pending') — Status persetujuan akun kolaborator oleh Ketua Tim.

- Tabel courses (Entitas Utama Proyek / Modul & Alokasi PIC)

    - id: serial().primaryKey() — ID unik modul.

    - title: varchar({ length: 255 }).notNull() — Judul modul pembelajaran.

    - description: text() — Deskripsi ringkas mengenai proyek modul.

    - status: mysqlEnum(['draft', 'revision_needed', 'review', 'approved', 'published']).default('draft') — Status workflow manajemen konten global.

    - content_author_id: int().references(() => users.id) — Foreign Key (FK) mengarah ke ID Pembuat Materi yang ditunjuk.

    - game_creator_id: int().references(() => users.id) — Foreign Key (FK) mengarah ke ID Pembuat Game yang ditunjuk.

    - expert_reviewer_id: int().references(() => users.id) — Foreign Key (FK) mengarah ke ID Pakar yang ditunjuk.

- Tabel contents (Draf Materi Tekstual — Relasi 1:1 ke Courses)

    - id: serial().primaryKey()

    - course_id: int().notNull().references(() => courses.id, { onDelete: 'cascade' }) — Terikat mutlak pada satu modul (Cascade Delete).

    - title: varchar({ length: 255 }).notNull() — Judul draf materi.

    - body: text() — Isi materi utama dalam format teks biasa atau markdown.

    - indicator_tag: mysqlEnum(['kognitif', 'metodologis', 'kontekstual']).notNull() — Kategori pilar kompetensi materi untuk kebutuhan filtering adaptif siswa.

- Tabel games (Konfigurasi Gamifikasi Studio — Relasi 1:1 ke Courses)

    - id: serial().primaryKey()

    - course_id: int().notNull().references(() => courses.id, { onDelete: 'cascade' }) — Terikat mutlak pada satu modul (Cascade Delete).

    - game_type: mysqlEnum(['pilihan_ganda', 'puzzle', 'pasang_kata']).notNull() — Format tipe permainan.

    - config_data: json().notNull() — Menyimpan struktur objek JSON (array pertanyaan, pilihan jawaban, kunci jawaban). Wajib menyertakan metadata properti "indicator_tag" pada setiap objek soal di dalam berkas JSON guna suplai kalkulasi ke skor profil siswa.

- Tabel reviews (Log Audit & Kritik Pakar — Relasi 1:N ke Courses)

    - id: serial().primaryKey()

    - course_id: int().notNull().references(() => courses.id, { onDelete: 'cascade' }) — Terikat pada modul yang sedang diaudit.

    - reviewer_id: int().notNull().references(() => users.id) — ID Pakar yang memberikan evaluasi.

    - comment: text().notNull() — Catatan kritik, koreksi, atau alasan penolakan draf materi/game.

    - status_recommendation: mysqlEnum(['revision_needed', 'approved']).notNull() — Rekomendasi status pasca peninjauan.

- Tabel student_profiles (Pusat Kompetensi Skor Siswa — Relasi 1:1 ke Users)

    - id: serial().primaryKey()

    - user_id: int().notNull().references(() => users.id, { onDelete: 'cascade' }) — Terikat langsung pada ID pengguna ber-role 'siswa'.

    - cognitive_score: int().default(0) — Akumulasi/skor pemetaan kompetensi kognitif.

    - methodological_score: int().default(0) — Akumulasi/skor pemetaan kompetensi metodologis.

    - contextual_score: int().default(0) — Akumulasi/skor pemetaan kompetensi kontekstual.

    - current_level: mysqlEnum(['dasar', 'menengah', 'mahir']).default('dasar') — Level klasifikasi global siswa hasil kalkulasi kuis diagnostik.

- Tabel student_progress (Tabel Tambahan — Pelacak Progres Modul Siswa — Relasi N:M)

    - id: serial().primaryKey()

    student_id: int().notNull().references(() => users.id, { onDelete: 'cascade' }) — ID siswa yang belajar.

    - course_id: int().notNull().references(() => courses.id, { onDelete: 'cascade' }) — ID modul yang diakses.

    - score_obtained: int().default(0) — Skor yang diperoleh siswa saat menyelesaikan game pada modul tersebut.

    - is_completed: boolean().default(false) — Status kelulusan modul (Jika true, menaikkan progress bar di Ruang Kelas menjadi 100%).

#### B. Peta Relasi Data (Entity Relationship & Workflow Mapping)
Relasi Agregasi Multi-PIC (users ➔ courses): Tabel courses mengontrol alokasi kerja tim secara ringkas melalui tiga relasi foreign-key searah ke tabel users (content_author_id, game_creator_id, expert_reviewer_id). Struktur ini memudahkan backend melakukan filtering data ruang kerja kolaborator hanya dengan satu operasi WHERE.

Relasi Integrasi Produksi Konten (courses ↔ contents & games): Bersifat One-to-One (1:1) kuat dengan aturan Cascade Delete. Penghapusan sebuah modul (courses) otomatis membersihkan draf teks materi di tabel contents dan struktur data kuis di tabel games tanpa meninggalkan data sampah di MySQL.

Siklus Log Catatan Audit (courses ➔ reviews): Bersifat One-to-Many (1:N). Satu entitas modul dapat memiliki banyak baris catatan di tabel reviews. Hal ini krusial agar Pembuat Materi dan Pembuat Game dapat melihat rekam jejak revisi historis dari Pakar setiap kali status modul terlempar kembali menjadi revision_needed.

Mekanisme Smart Adaptive Learning (student_profiles ➔ contents ➔ student_progress):

Kuis Diagnostik memetakan nilai awal ke komponen student_profiles.

Sistem melakukan pencocokan (Smart Matching) antara skor terendah di student_profiles dengan kolom indicator_tag pada tabel contents.

Relasi Many-to-Many (N:M) pada tabel perantara student_progress menjembatani interaksi belajar adaptif ini dengan merekam riwayat modul mana saja yang sudah diselesaikan siswa beserta skor gamifikasi yang mereka dapatkan dari engine game JSON.