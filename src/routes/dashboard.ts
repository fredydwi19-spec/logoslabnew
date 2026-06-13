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
      return new Response(htmlLayout("Ringkasan Ketua Tim", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
    })
    .get("/proyek", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Manajemen Proyek</h1>
          <p class="text-gray-600">Grid proyek aktif dan tombol Buat Proyek Baru (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Manajemen Proyek", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
    })
    .get("/tim", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Manajemen Tim</h1>
          <p class="text-gray-600">Pusat persetujuan akun baru dan monitoring beban kerja (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Manajemen Tim", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
    })
    .get("/rilis", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Kontrol Rilis</h1>
          <p class="text-gray-600">Daftar modul berstatus 'approved' untuk dirilis (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Kontrol Rilis", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
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
      return new Response(htmlLayout("Editor Modul", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
    })
    .get("/log", (ctx: any) => {
      const content = `
        <div class="p-8">
          <h1 class="text-3xl font-display font-bold text-navy mb-4">Log Catatan Pakar</h1>
          <p class="text-gray-600">Menampilkan riwayat kritik dari tabel reviews (Akan diimplementasikan).</p>
        </div>
      `;
      return new Response(htmlLayout("Log Catatan Pakar", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
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
      return new Response(htmlLayout("Studio Game", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
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
      return new Response(htmlLayout("Antrean Tinjauan", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
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
      return new Response(htmlLayout("Dashboard Siswa", content, ctx.user?.role), { headers: { "Content-Type": "text/html" } });
    })
  );
