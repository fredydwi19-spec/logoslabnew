export const renderSidebar = (role: string) => `
  <!-- Load Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  
  <aside class="fixed left-0 top-0 h-screen bg-navy text-white w-16 hover:w-64 transition-all duration-300 ease-in-out overflow-hidden z-50 shadow-xl group">
    <div class="flex flex-col h-full">
      <div class="p-4 flex items-center justify-center group-hover:justify-start overflow-hidden border-b border-blue-800">
        <img src="/public/assets/Logo LogosLAB.png" alt="LogosLAB Logo" class="h-8 w-auto shrink-0" />
        <span class="ml-4 font-display font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-lg">LogosLAB</span>
      </div>
      <nav class="flex-1 mt-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        ${getMenuByRole(role)}
      </nav>
      <div class="p-4 border-t border-blue-800 flex items-center justify-center group-hover:justify-start">
        <form action="/api/auth/logout" method="POST" class="w-full">
          <button type="submit" class="flex items-center w-full justify-center group-hover:justify-start text-gray-300 hover:text-orange-hover transition-colors p-2">
            <i class="bi bi-box-arrow-left text-xl shrink-0"></i>
            <span class="ml-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-medium">Logout</span>
          </button>
        </form>
      </div>
    </div>
  </aside>
`;

const getMenuByRole = (role: string) => {
  if (role === 'ketua_tim') {
    return `
      <a href="/dashboard/ketua" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-grid-1x2-fill text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Ringkasan</span>
      </a>
      <a href="/dashboard/ketua/proyek" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-kanban text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Manajemen Proyek</span>
      </a>
      <a href="/dashboard/ketua/tim" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-people-fill text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Manajemen Tim</span>
      </a>
      <a href="/dashboard/ketua/rilis" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-shield-check text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Kontrol Rilis</span>
      </a>
    `;
  }
  
  if (role === 'pembuat_materi') {
    return `
      <a href="/dashboard/materi" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-pencil-square text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Editor Modul</span>
      </a>
      <a href="/dashboard/materi/log" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-chat-left-text-fill text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Log Catatan Pakar</span>
      </a>
    `;
  }

  if (role === 'pembuat_game') {
    return `
      <a href="/dashboard/game" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-controller text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Studio Game</span>
      </a>
    `;
  }

  if (role === 'pakar') {
    return `
      <a href="/dashboard/pakar" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-clipboard-check-fill text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Antrean Tinjauan</span>
      </a>
    `;
  }

  if (role === 'siswa') {
    return `
      <a href="/dashboard/siswa/diagnostik" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-clipboard-data-fill text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Kuis Pemetaan</span>
      </a>
      <a href="/dashboard/siswa" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-journal-bookmark-fill text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Ruang Kelas Adaptif</span>
      </a>
      <a href="/dashboard/siswa/belajar" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-play-btn-fill text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Mode Belajar</span>
      </a>
      <a href="/dashboard/siswa/leaderboard" class="flex items-center p-3 mx-2 rounded-lg hover:bg-blue-800 transition-colors">
        <i class="bi bi-trophy-fill text-xl shrink-0 w-8 text-center text-gray-200"></i>
        <span class="ml-2 whitespace-nowrap font-medium text-gray-100">Leaderboard</span>
      </a>
    `;
  }

  return '';
};
