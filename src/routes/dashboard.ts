import { Elysia, t } from "elysia";
import { rbacPlugin, requireRole } from "../plugins/rbac";
import { htmlLayout } from "../views/layout";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { db } from "../db";
import { courses, users } from "../db/schema";
import { sql, eq, inArray, and } from "drizzle-orm";

export const dashboardRoutes = new Elysia({ prefix: "/dashboard" })
  .use(jwt({ name: "jwtDashboard", secret: process.env.JWT_SECRET || "" }))
  .use(cookie())
  .derive(async ({ jwtDashboard, cookie }: any) => {
    const sessionValue = cookie?.session?.value;
    let localRole = null;
    if (sessionValue) {
      const payload = await jwtDashboard.verify(sessionValue as string);
      localRole = (payload as any)?.role || null;
    }
    return { localRole };
  })
  .use(rbacPlugin)
  
  // ==========================================
  // KETUA TIM DASHBOARD
  // ==========================================
  .group("/ketua", (app) => app
    .use(requireRole(['ketua_tim']))
    .get("/", async (ctx: any) => {
      const totalProyekResult = await db.select({ totalProyek: sql`count(*)`.mapWith(Number) }).from(courses);
      const totalProyek = totalProyekResult[0]?.totalProyek ?? 0;
      const modulReviewResult = await db.select({ modulReview: sql`count(*)`.mapWith(Number) }).from(courses).where(eq(courses.status, 'review'));
      const modulReview = modulReviewResult[0]?.modulReview ?? 0;
      const anggotaAktifResult = await db.select({ anggotaAktif: sql`count(*)`.mapWith(Number) }).from(users).where(and(inArray(users.role, ['pembuat_materi', 'pembuat_game', 'pakar']), eq(users.status, 'active')));
      const anggotaAktif = anggotaAktifResult[0]?.anggotaAktif ?? 0;
      const totalSiswaResult = await db.select({ totalSiswa: sql`count(*)`.mapWith(Number) }).from(users).where(eq(users.role, 'siswa'));
      const totalSiswa = totalSiswaResult[0]?.totalSiswa ?? 0;

      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-8">Ringkasan Eksekutif</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl">
                  <i class="bi bi-folder-fill"></i>
                </div>
                <h3 class="text-gray-500 font-medium">Total Proyek Aktif</h3>
              </div>
              <p class="text-4xl font-display font-bold text-navy">${totalProyek}</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-2xl">
                  <i class="bi bi-clock-history"></i>
                </div>
                <h3 class="text-gray-500 font-medium">Modul dalam Review</h3>
              </div>
              <p class="text-4xl font-display font-bold text-navy">${modulReview}</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-2xl">
                  <i class="bi bi-people-fill"></i>
                </div>
                <h3 class="text-gray-500 font-medium">Anggota Tim Aktif</h3>
              </div>
              <p class="text-4xl font-display font-bold text-navy">${anggotaAktif}</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-2xl">
                  <i class="bi bi-mortarboard-fill"></i>
                </div>
                <h3 class="text-gray-500 font-medium">Total Siswa Terdaftar</h3>
              </div>
              <p class="text-4xl font-display font-bold text-navy">${totalSiswa}</p>
            </div>
          </div>
        </div>
      `;
      return new Response(htmlLayout("Ringkasan Ketua Tim", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
    .get("/proyek", async (ctx: any) => {
      const allCourses = await db.select().from(courses);
      const materiUsers = await db.select().from(users).where(and(eq(users.role, 'pembuat_materi'), eq(users.status, 'active')));
      const gameUsers = await db.select().from(users).where(and(eq(users.role, 'pembuat_game'), eq(users.status, 'active')));
      const expertUsers = await db.select().from(users).where(and(eq(users.role, 'pakar'), eq(users.status, 'active')));

      const courseCards = allCourses.map(c => `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-navy">${c.title}</h3>
            <span class="px-3 py-1 rounded-full text-xs font-medium ${
              c.status === 'draft' ? 'bg-gray-100 text-gray-600' :
              c.status === 'approved' ? 'bg-green-100 text-green-600' :
              'bg-blue-100 text-blue-600'
            }">${c.status.replace('_', ' ').toUpperCase()}</span>
          </div>
          <p class="text-gray-600 text-sm line-clamp-2">${c.description || 'Tidak ada deskripsi'}</p>
        </div>
      `).join('');

      const successBanner = ctx.query?.success === '1' ? `
        <div class="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-xl flex items-center gap-3">
          <i class="bi bi-check-circle-fill text-green-500 text-xl"></i>
          <span class="font-medium">Proyek baru berhasil dibuat dan masuk dalam status <strong>Draft</strong>.</span>
        </div>
      ` : '';

      const content = `
        <div class="p-8" x-data="{ modalOpen: false }">
          ${successBanner}
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-display font-bold text-navy">Manajemen Proyek</h1>
            <button @click="modalOpen = true" class="bg-orange hover:bg-orange-hover text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
              <i class="bi bi-plus-lg"></i> Buat Proyek Baru
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${courseCards || '<p class="text-gray-500 col-span-full">Belum ada proyek. Silakan buat baru.</p>'}
          </div>

          <!-- Modal Tambah Proyek -->
          <div x-show="modalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 transition-opacity" style="display: none;">
            <div @click.away="modalOpen = false" class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-navy">Buat Proyek Baru</h2>
                <button @click="modalOpen = false" class="text-gray-400 hover:text-gray-600">
                  <i class="bi bi-x-lg text-xl"></i>
                </button>
              </div>
              <form action="/dashboard/ketua/proyek" method="POST" class="flex flex-col gap-4">
                <div>
                  <div class="flex items-center gap-1.5 mb-1">
                    <label class="block text-sm font-medium text-gray-700">Judul Proyek</label>
                    <div class="relative group/tip">
                      <i class="bi bi-info-circle text-gray-400 hover:text-navy cursor-pointer text-sm transition-colors"></i>
                      <div class="absolute left-6 top-0 z-[200] hidden group-hover/tip:block w-64 bg-navy text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed pointer-events-none">
                        Masukkan judul global modul pembelajaran Alkitab (Contoh: Sejarah Raja-Raja Israel atau Hermeneutika Dasar).
                      </div>
                    </div>
                  </div>
                  <input type="text" name="title" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-shadow">
                </div>
                <div>
                  <div class="flex items-center gap-1.5 mb-1">
                    <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <div class="relative group/tip">
                      <i class="bi bi-info-circle text-gray-400 hover:text-navy cursor-pointer text-sm transition-colors"></i>
                      <div class="absolute left-6 top-0 z-[200] hidden group-hover/tip:block w-64 bg-navy text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed pointer-events-none">
                        Berikan ringkasan cakupan isi materi akademis yang akan diproduksi oleh tim.
                      </div>
                    </div>
                  </div>
                  <textarea name="description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-shadow"></textarea>
                </div>
                <div>
                  <div class="flex items-center gap-1 mb-1">
                    <label class="block text-sm font-medium text-gray-700">Kategori Dimensi</label>
                    <div class="relative group/tip">
                      <i class="bi bi-info-circle text-gray-400 hover:text-navy cursor-pointer text-sm"></i>
                      <div class="absolute left-5 top-0 z-[200] hidden group-hover/tip:block w-64 bg-navy text-white text-xs rounded-lg p-3 shadow-lg leading-relaxed">
                        Pilih fokus utama modul: <strong>Kognitif</strong> (Pengetahuan/Sejarah), <strong>Metodologis</strong> (Alat/Cara Tafsir), atau <strong>Kontekstual</strong> (Penerapan/Pelayanan) untuk kebutuhan jalur belajar adaptif siswa.
                      </div>
                    </div>
                  </div>
                  <select name="indicator_tag" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy outline-none">
                    <option value="kognitif">Kognitif — Pengetahuan & Sejarah Alkitab</option>
                    <option value="metodologis">Metodologis — Alat & Pendekatan Tafsir</option>
                    <option value="kontekstual">Kontekstual — Penerapan & Pelayanan</option>
                  </select>
                </div>
                <div>
                  <div class="flex items-center gap-1 mb-1">
                    <label class="block text-sm font-medium text-gray-700">Level Target Mahasiswa</label>
                    <div class="relative group/tip">
                      <i class="bi bi-info-circle text-gray-400 hover:text-navy cursor-pointer text-sm"></i>
                      <div class="absolute left-5 top-0 z-[200] hidden group-hover/tip:block w-64 bg-navy text-white text-xs rounded-lg p-3 shadow-lg leading-relaxed">
                        Tentukan tingkatan kesulitan modul yang disesuaikan dengan profil tingkat kemampuan mahasiswa.
                      </div>
                    </div>
                  </div>
                  <select name="current_level" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy outline-none">
                    <option value="dasar">Dasar</option>
                    <option value="menengah">Menengah</option>
                    <option value="mahir">Mahir</option>
                  </select>
                </div>
                <div>
                  <div class="flex items-center gap-1.5 mb-1">
                    <label class="block text-sm font-medium text-gray-700">Pembuat Materi (PIC)</label>
                    <div class="relative group/tip">
                      <i class="bi bi-info-circle text-gray-400 hover:text-navy cursor-pointer text-sm transition-colors"></i>
                      <div class="absolute left-6 top-0 z-[200] hidden group-hover/tip:block w-64 bg-navy text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed pointer-events-none">
                        Tugaskan kolaborator berstatus 'active' yang bertanggung jawab pada workspace penulisan materi.
                      </div>
                    </div>
                  </div>
                  <select name="contentAuthorId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy outline-none">
                    <option value="">-- Pilih --</option>
                    ${materiUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <div class="flex items-center gap-1.5 mb-1">
                    <label class="block text-sm font-medium text-gray-700">Pembuat Game (PIC)</label>
                    <div class="relative group/tip">
                      <i class="bi bi-info-circle text-gray-400 hover:text-navy cursor-pointer text-sm transition-colors"></i>
                      <div class="absolute left-6 top-0 z-[200] hidden group-hover/tip:block w-64 bg-navy text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed pointer-events-none">
                        Tugaskan kolaborator berstatus 'active' yang bertanggung jawab pada workspace pembuatan game edukasi.
                      </div>
                    </div>
                  </div>
                  <select name="gameCreatorId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy outline-none">
                    <option value="">-- Pilih --</option>
                    ${gameUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <div class="flex items-center gap-1.5 mb-1">
                    <label class="block text-sm font-medium text-gray-700">Pakar Evaluasi (PIC)</label>
                    <div class="relative group/tip">
                      <i class="bi bi-info-circle text-gray-400 hover:text-navy cursor-pointer text-sm transition-colors"></i>
                      <div class="absolute left-6 top-0 z-[200] hidden group-hover/tip:block w-64 bg-navy text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed pointer-events-none">
                        Tugaskan kolaborator berstatus 'active' yang bertanggung jawab sebagai reviewer materi dan game.
                      </div>
                    </div>
                  </div>
                  <select name="expertReviewerId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy outline-none">
                    <option value="">-- Pilih --</option>
                    ${expertUsers.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                  </select>
                </div>
                <div class="mt-6 flex justify-end gap-3 border-t pt-4">
                  <button type="button" @click="modalOpen = false" class="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
                  <button type="submit" class="bg-navy hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm">Simpan Proyek</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
      return new Response(htmlLayout("Manajemen Proyek", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
    // POST /dashboard/ketua/proyek
    // Menangani submit form "Buat Proyek Baru" dari Ketua Tim.
    // Menyimpan baris kursus baru ke tabel courses dengan status awal 'draft'.
    .post("/proyek", async (ctx: any) => {
      // 1. Ekstrak & validasi body form
      const {
        title,
        description,
        contentAuthorId,
        gameCreatorId,
        expertReviewerId,
        indicator_tag,
        current_level,
      } = ctx.body;

      // 2. Guard: title wajib ada
      if (!title || title.trim() === '') {
        ctx.set.status = 400;
        return new Response('Judul proyek wajib diisi.', { status: 400 });
      }

      // SISTEM TAGGING KOMPETENSI LOGOSLAB
      // ─────────────────────────────────────────────────────────────────
      // KOGNITIF (Teks & Sejarawhi):
      //   Fokus pada pengetahuan dasar Alkitab — fakta teks, latar belakang
      //   sejarah, survei PL/PB, isagogik, peta rute perjalanan misi rasul.
      //
      // METODOLOGIS (Alat & Pendekatan Tafsir):
      //   Fokus pada perkakas eksegesis & hermeneutika — analisis
      //   sastra/genre, kritik teks, studi bahasa Yunani/Ibrani.
      //
      // KONTEKSTUAL (Penerapan & Pelayanan):
      //   Fokus pada aktualisasi firman ke hidup praktis — homiletika,
      //   konseling pastoral, etika Kristen, misiologi kontekstual.
      // ─────────────────────────────────────────────────────────────────

      // 3. Eksekusi insert ke MySQL via Drizzle ORM
      await db.insert(courses).values({
        title: title.trim(),
        description: description?.trim() || null,
        status: 'draft', // Otomatis, tidak dari form
        contentAuthorId: contentAuthorId ? parseInt(contentAuthorId) : null,
        gameCreatorId: gameCreatorId ? parseInt(gameCreatorId) : null,
        expertReviewerId: expertReviewerId ? parseInt(expertReviewerId) : null,
        indicatorTag: indicator_tag || 'kognitif',
        currentLevel: current_level || 'dasar',
      });

      // 4. Redirect kembali ke halaman daftar proyek setelah berhasil
      ctx.set.status = 302;
      ctx.set.headers['Location'] = '/dashboard/ketua/proyek?success=1';
      return new Response(null, {
        status: 302,
        headers: { Location: '/dashboard/ketua/proyek?success=1' },
      });
    }, {
      // 5. Validasi tipe input menggunakan Elysia t schema
      body: t.Object({
        title: t.String({ minLength: 3 }),
        description: t.Optional(t.String()),
        contentAuthorId: t.Optional(t.String()),
        gameCreatorId: t.Optional(t.String()),
        expertReviewerId: t.Optional(t.String()),
        indicator_tag: t.Optional(t.Union([
          t.Literal('kognitif'),
          t.Literal('metodologis'),
          t.Literal('kontekstual'),
        ])),
        current_level: t.Optional(t.Union([
          t.Literal('dasar'),
          t.Literal('menengah'),
          t.Literal('mahir'),
        ])),
      })
    })
    .get("/tim", async (ctx: any) => {
      const pendingUsers = await db.select().from(users).where(eq(users.status, 'pending'));
      
      const userRows = pendingUsers.map(u => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="py-3 px-4 font-medium text-navy">${u.name}</td>
          <td class="py-3 px-4 text-gray-600">${u.email}</td>
          <td class="py-3 px-4">
            <span class="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">${u.role.replace('_', ' ').toUpperCase()}</span>
          </td>
          <td class="py-3 px-4 text-right">
            <form action="/api/users/${u.id}/approve" method="POST" class="inline">
              <button type="submit" class="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
                Approve
              </button>
            </form>
          </td>
        </tr>
      `).join('');

      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-8">Manajemen Tim & Approval Queue</h1>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 class="text-xl font-bold text-navy">Antrean Persetujuan Akun</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100">
                    <th class="py-4 px-4 font-semibold">Nama Lengkap</th>
                    <th class="py-4 px-4 font-semibold">Alamat Email</th>
                    <th class="py-4 px-4 font-semibold">Role Diajukan</th>
                    <th class="py-4 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${userRows || '<tr><td colspan="4" class="text-center py-8 text-gray-500 italic">Tidak ada akun yang menunggu persetujuan.</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
      return new Response(htmlLayout("Manajemen Tim", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
    .get("/rilis", async (ctx: any) => {
      const approvedCourses = await db.select().from(courses).where(eq(courses.status, 'approved'));
      
      const rilisCards = approvedCourses.map(c => `
        <div class="bg-white rounded-xl shadow-sm border border-green-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-bold text-navy">${c.title}</h3>
              <i class="bi bi-check-circle-fill text-green-500 text-xl"></i>
            </div>
            <p class="text-sm text-gray-600 mb-6 line-clamp-3">${c.description || 'Tidak ada deskripsi'}</p>
          </div>
          <form action="/api/courses/${c.id}/publish" method="POST">
            <button type="submit" class="w-full bg-navy hover:bg-blue-800 text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
              Rilis ke Publik
            </button>
          </form>
        </div>
      `).join('');

      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-8">Kontrol Rilis Modul</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${rilisCards || '<p class="text-gray-500 col-span-full">Tidak ada modul dengan status Approved yang siap dirilis.</p>'}
          </div>
        </div>
      `;
      return new Response(htmlLayout("Kontrol Rilis", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
  )

  // ==========================================
  // PEMBUAT MATERI WORKSPACE
  // ==========================================
  .group("/materi", (app) => app
    .use(requireRole(['pembuat_materi']))
    .get("/", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Editor Modul</h1>
          <p class="text-gray-600">Text area untuk menulis isi draf dan pemilihan indicator_tag (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Editor Modul", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
    .get("/log", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Log Catatan Pakar</h1>
          <p class="text-gray-600">Menampilkan riwayat kritik dari tabel reviews (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Log Catatan Pakar", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
  )

  // ==========================================
  // PEMBUAT GAME STUDIO
  // ==========================================
  .group("/game", (app) => app
    .use(requireRole(['pembuat_game']))
    .get("/", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Studio Game</h1>
          <p class="text-gray-600">Split-Screen Layout. Kiri: Materi teks. Kanan: Form input kuis (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Studio Game", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
  )

  // ==========================================
  // PAKAR EVALUASI PANEL
  // ==========================================
  .group("/pakar", (app) => app
    .use(requireRole(['pakar']))
    .get("/", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Antrean Tinjauan</h1>
          <p class="text-gray-600">Menampilkan proyek berstatus 'review' dan Live Preview Simulator (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Antrean Tinjauan", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
  )

  // ==========================================
  // SISWA DASHBOARD (Opsional untuk integrasi)
  // ==========================================
  .group("/siswa", (app) => app
    .use(requireRole(['siswa']))
    .get("/", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Smart E-Learning</h1>
          <p class="text-gray-600">Dashboard Siswa (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Dashboard Siswa", content, ctx.localRole), { headers: { "Content-Type": "text/html" } });
    })
  );
