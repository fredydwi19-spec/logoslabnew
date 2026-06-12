import { htmlLayout } from "./layout";

export const renderLanding = () => {
  const body = `
    <!-- Navbar -->
    <nav class="bg-navy px-6 py-4 flex items-center justify-between shadow-md">
      <div class="flex items-center">
        <img src="/public/assets/Logo LogosLAB.png" alt="LogosLAB Logo" class="h-10 w-auto object-contain bg-white/10 rounded px-2" />
      </div>
      <div class="space-x-4">
        <a href="/login" class="text-white hover:text-gold transition-colors font-medium">Masuk</a>
        <a href="/register" class="bg-orange hover:bg-orange-hover text-white px-5 py-2 rounded-md transition-colors font-medium">Daftar</a>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="bg-navy text-white flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
      <h1 class="font-display text-3xl md:text-5xl font-bold mb-6 relative z-10">Masa Depan Pembelajaran Ada di Tangan Anda</h1>
      <p class="max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed mb-10 relative z-10">
        LogosLAB menghadirkan pengalaman e-learning interaktif dengan teknologi terdepan. 
        Pelajari materi, bermain game edukatif, dan evaluasi kemampuan Anda bersama pakar.
      </p>
      <a href="/register" class="bg-orange hover:bg-orange-hover text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-orange/30 transition-all relative z-10">
        Mulai Belajar
      </a>
    </header>

    <!-- Features Section -->
    <section class="bg-slate-50 py-20 px-6 max-w-6xl mx-auto w-full">
      <div class="text-center mb-16">
        <h2 class="font-display text-2xl md:text-4xl font-bold text-navy">Kenapa Memilih LogosLAB?</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>
          </div>
          <h3 class="font-display font-bold text-xl mb-3">Materi Interaktif</h3>
          <p class="text-slate-600 leading-relaxed">Akses modul pembelajaran yang dirancang khusus untuk kemudahan pemahaman, dari tingkat dasar hingga lanjutan.</p>
        </div>

        <!-- Card 2 -->
        <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1z"/>
              <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.068 1.774.29.731.482 1.528.536 2.215.054.686-.014 1.346-.275 1.954-.262.61-.73 1.15-1.503 1.437A.5.5 0 0 1 12.5 12h-1a.5.5 0 0 1-.465-.301c-.131-.3-.38-.564-.67-.78-.291-.216-.628-.396-.98-.535-.7-.278-1.5-.484-2.385-.484s-1.685.206-2.385.484c-.352.139-.69.319-.98.535-.29.216-.54.48-.67.78A.5.5 0 0 1 2.5 12h-1a.5.5 0 0 1-.465-.301c-.773-.287-1.24-8.27-1.503-1.437-.26-.608-.33-1.268-.275-1.954.054-.687.246-1.484.536-2.215.288-.724.66-1.366 1.068-1.774a2.6 2.6 0 0 1 .373-.297m1.42 2.542L3.109 4.14A3 3 0 0 0 2.533 5.96c-.23.582-.416 1.258-.466 1.889-.05.626.007 1.157.197 1.6.14.327.35.602.66.822a10 10 0 0 1 1.55-1.545v-3.04zM11.53 8.725c.594.137 1.139.387 1.55 1.545.31-.22.52-.495.66-.822.19-.443.247-.974.197-1.6-.05-.631-.236-1.307-.466-1.889a3 3 0 0 0-.576-1.82l-1.362 1.662zm-6.03-3.692a10 10 0 0 1 5 0l-.337.893a9 9 0 0 0-4.326 0zM4.5 9v3h1c.143-.34.33-.64.542-.892.42-.5 1.01-1.017 1.958-1.017s1.538.517 1.958 1.017c.212.252.4.552.542.892h1V9a9 9 0 0 0-7 0"/>
            </svg>
          </div>
          <h3 class="font-display font-bold text-xl mb-3">Game Edukasi</h3>
          <p class="text-slate-600 leading-relaxed">Belajar tidak harus membosankan. Uji kemampuan Anda dengan berbagai permainan asah otak yang mendidik.</p>
        </div>

        <!-- Card 3 -->
        <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
          </div>
          <h3 class="font-display font-bold text-xl mb-3">Evaluasi Pakar</h3>
          <p class="text-slate-600 leading-relaxed">Tingkatkan kualitas soal dan materi melalui proses review dan persetujuan langsung dari para pakar kompeten.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-navy py-6 text-center text-slate-400 text-sm">
      &copy; ${new Date().getFullYear()} LogosLAB. Semua hak cipta dilindungi.
    </footer>
  `;
  
  return htmlLayout("Selamat Datang", body);
};
