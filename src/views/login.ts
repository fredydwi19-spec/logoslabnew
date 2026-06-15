import { htmlLayout } from "./layout";

export const renderLogin = () => {
  const body = `
    <div class="flex flex-1 items-center justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div class="text-center mb-8">
          <a href="/"><img src="/assets/LogosLAB.png" alt="LogosLAB" class="h-16 w-auto mx-auto mb-6 bg-navy/5 p-2 rounded-xl" /></a>
          <h1 class="font-display text-2xl font-bold text-navy">Masuk ke LogosLAB</h1>
          <p class="text-slate-500 text-sm mt-2">Selamat datang kembali! Silakan masukkan kredensial Anda.</p>
        </div>

        <form id="loginForm" onsubmit="handleLogin(event)" class="space-y-5">
          <!-- Error Alert (Hidden by default) -->
          <div id="errorAlert" class="hidden bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center">
            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>
            <span id="errorMsg"></span>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-navy mb-1.5">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/></svg>
              </div>
              <input type="email" id="email" name="email" required placeholder="email@contoh.com" class="pl-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-navy mb-1.5">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
              </div>
              <input type="password" id="password" name="password" required placeholder="••••••••" class="pl-10 pr-10 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors" />
              <button type="button" onclick="togglePassword()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-navy transition-colors focus:outline-none">
                <svg id="eyeIcon" class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" id="submitBtn" class="w-full bg-orange hover:bg-orange-hover text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center">
            <span>Masuk</span>
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-8">
          Belum punya akun? <a href="/register" class="text-orange font-semibold hover:underline">Daftar di sini</a>
        </p>
      </div>
    </div>

    <!-- Script to handle JSON post to our API -->
    <script>
      function togglePassword() {
        const pwd = document.getElementById('password');
        const eyeIcon = document.getElementById('eyeIcon');
        if (pwd.type === 'password') {
          pwd.type = 'text';
          eyeIcon.innerHTML = '<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755l-.809-.805zm-4.723-4.723L9.673 5.48a2.5 2.5 0 0 0-2.153-2.152l.969.969a1.5 1.5 0 0 1 1.147 1.146zm-2.022 2.022L5.58 7.502a1.5 1.5 0 0 1 1.918 1.918l1.034 1.034a2.5 2.5 0 0 0-2.918-2.918zm4.35 4.35-.916-.916a5.952 5.952 0 0 1-2.048.361c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8c.058-.087.122-.183.195-.288.335-.48.83-1.12 1.465-1.755l-1.6-1.6-.708.708 13.5 13.5.708-.708-2.083-2.083zM2.64 5.467A14.288 14.288 0 0 0 0 8s3 5.5 8 5.5c.87 0 1.7-.156 2.47-.435l-1.63-1.63a4.952 4.952 0 0 1-3.32-3.32L2.64 5.467z"/>';
        } else {
          pwd.type = 'password';
          eyeIcon.innerHTML = '<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>';
        }
      }

      async function handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = document.getElementById('submitBtn');
        const errorAlert = document.getElementById('errorAlert');
        const errorMsg = document.getElementById('errorMsg');
        
        // Setup state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
        errorAlert.classList.add('hidden');

        try {
          // Instead of passing x-www-form-urlencoded, we'll send JSON as the endpoint expects it nicely.
          // The instructions say x-www-form-urlencoded is fine because Elysia handles both, but we can do JSON cleanly.
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: form.email.value,
              password: form.password.value
            })
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.message || 'Gagal login');
          }

          // Redirect based on role
          const rolePath = {
            'ketua_tim': 'ketua',
            'pembuat_materi': 'materi',
            'pembuat_game': 'game',
            'pakar': 'pakar',
            'siswa': 'siswa'
          };
          window.location.href = '/dashboard/' + (rolePath[data.role] || 'siswa');

        } catch (err) {
          errorMsg.textContent = err.message;
          errorAlert.classList.remove('hidden');
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Masuk</span>';
        }
      }
    </script>
  `;
  
  return htmlLayout("Masuk", body);
};
