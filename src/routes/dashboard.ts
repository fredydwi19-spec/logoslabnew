import { Elysia } from "elysia";
import { rbacPlugin, requireRole } from "../plugins/rbac";
import { htmlLayout } from "../views/layout";

export const dashboardRoutes = new Elysia({ prefix: "/dashboard" })
  .use(rbacPlugin)
  
  // ==========================================
  // KETUA TIM DASHBOARD
  // ==========================================
  .group("/ketua", (app) => app
    .use(requireRole(['ketua_tim']))
    .get("/", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Ringkasan</h1>
          <p class="text-gray-600">Stat Cards berbasis Query COUNT dinamis (Akan diimplementasikan).</p>
        </div>
      `;
      return htmlLayout("Ringkasan Ketua Tim", content, ctx.userRole || undefined);
    })
    .get("/proyek", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Manajemen Proyek</h1>
          <p class="text-gray-600">Grid proyek aktif dan tombol Buat Proyek Baru (Akan diimplementasikan).</p>
        </div>
      `;
      return htmlLayout("Manajemen Proyek", content, ctx.userRole || undefined);
    })
    .get("/tim", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Manajemen Tim</h1>
          <p class="text-gray-600">Pusat persetujuan akun baru dan monitoring beban kerja (Akan diimplementasikan).</p>
        </div>
      `;
      return htmlLayout("Manajemen Tim", content, ctx.userRole || undefined);
    })
    .get("/rilis", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Kontrol Rilis</h1>
          <p class="text-gray-600">Daftar modul berstatus 'approved' untuk dirilis (Akan diimplementasikan).</p>
        </div>
      `;
      return htmlLayout("Kontrol Rilis", content, ctx.userRole || undefined);
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
      return htmlLayout("Editor Modul", content, ctx.userRole || undefined);
    })
    .get("/log", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Log Catatan Pakar</h1>
          <p class="text-gray-600">Menampilkan riwayat kritik dari tabel reviews (Akan diimplementasikan).</p>
        </div>
      `;
      return htmlLayout("Log Catatan Pakar", content, ctx.userRole || undefined);
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
      return htmlLayout("Studio Game", content, ctx.userRole || undefined);
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
      return htmlLayout("Antrean Tinjauan", content, ctx.userRole || undefined);
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
      return htmlLayout("Dashboard Siswa", content, ctx.userRole || undefined);
    })
  );
