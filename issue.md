# Rencana Inisiasi Proyek: Backend LogosLAB Baru

Dokumen ini berisi instruksi tingkat tinggi (high-level) untuk membuat proyek backend baru menggunakan Bun, ElysiaJS, dan Drizzle ORM dengan database MySQL. Ikuti langkah-langkah di bawah ini secara berurutan.

## Spesifikasi Stack Teknologi
- **Runtime**: Bun
- **Framework Web**: ElysiaJS
- **ORM**: Drizzle ORM
- **Database**: MySQL

---

## Task List (Checklist Pengerjaan)

### 1. Inisiasi Proyek Bun
- [x] Buat inisiasi proyek kosong menggunakan Bun di dalam folder ini.
- [x] Pastikan file `package.json` dan `tsconfig.json` sudah terbuat dengan benar.

### 2. Instalasi Dependensi
- [x] Install **ElysiaJS** sebagai framework backend utama.
- [x] Install **Drizzle ORM** dan driver database MySQL yang kompatibel dengan Bun (seperti `mysql2` atau driver bawaan yang relevan).
- [x] Install **Drizzle Kit** (sebagai `devDependencies`) untuk kebutuhan migrasi database.

### 3. Konfigurasi Dasar ElysiaJS
- [x] Buat file utama (misalnya `src/index.ts`).
- [x] Siapkan server ElysiaJS sederhana yang berjalan di port tertentu (contoh: port 3000) dan mengembalikan respons "Hello World" di rute root (`/`).

### 4. Setup Koneksi Database & Drizzle
- [x] Buat folder khusus untuk database (misalnya `src/db/`).
- [x] Buat file konfigurasi koneksi ke MySQL menggunakan Drizzle. Ambil kredensial database dari variabel environment (`.env`).
- [x] Buat satu contoh skema (schema) tabel sederhana (misal: tabel `users`) di file terpisah (contoh: `src/db/schema.ts`).

### 5. Konfigurasi Migrasi Database
- [x] Buat file konfigurasi `drizzle.config.ts` di root proyek.
- [x] Tambahkan skrip pada `package.json` untuk mempermudah eksekusi perintah Drizzle (seperti *generate migration* dan *push schema* ke database).

### 6. Pengujian Awal
- [x] Jalankan server menggunakan mode pengembangan (watch mode) dari Bun.
- [x] Pastikan server berjalan tanpa error dan rute dasar dapat diakses.

---

**Catatan untuk Eksekutor:**
Anda tidak perlu membangun fitur yang kompleks pada tahap ini. Tujuan utama dari tugas ini adalah menyiapkan pondasi proyek (boilerplate) yang siap dipakai untuk pengembangan fitur lebih lanjut. Pastikan struktur kode modular dan rapi.
