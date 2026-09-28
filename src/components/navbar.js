/**
 * INNOVATECH - Componente Header Superior y Bottom Navbar
 * Reemplaza el texto "PASAPORTE.26" por la imagen del logo corporativo `./assets/innovatech.png`
 * que funciona además como botón de inicio (Home).
 */

export function createHeader(app) {
  const header = document.createElement("header");
  header.className = "w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 md:px-8 py-3 flex items-center justify-between";

  const user = app.state.user;
  const initial = user && user.nickname ? user.nickname[0].toUpperCase() : "V";

  header.innerHTML = `
    <!-- Logotipo Corporativo INNOVATECH & Avatar -->
    <div class="flex items-center gap-3">
      ${user ? `
        <div class="w-8 h-8 rounded-full bg-cyan-950 text-cyan-300 font-bold text-xs flex items-center justify-center border border-cyan-800">
          <span>${initial}</span>
        </div>
        <div class="text-xs font-semibold text-slate-200">${user.nickname}</div>
      ` : ''}

      <!-- Logo Corporativo como Botón Home -->
      <button id="nav-logo-btn" class="flex items-center gap-2 focus:outline-none group active:scale-95 transition-transform" title="Volver al Inicio">
        <img 
          src="./assets/innovatech.png" 
          alt="INNOVATECH" 
          class="h-16 md:h-24 w-auto object-contain drop-shadow-xs" 
          onerror="this.onerror=null; this.src='./assets/innova.png';"
        />
      </button>
    </div>

    <!-- Navegación Superior Desktop / Tablet -->
    <nav class="hidden md:flex items-center gap-1 text-xs font-medium text-slate-300">
      <button data-nav-route="home1" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
        app.currentRoute === 'home1' ? 'font-bold text-cyan-400 bg-cyan-950/80' : 'hover:text-white hover:bg-slate-800'
      }">
        <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
        <span>Inicio</span>
      </button>
      <button data-nav-route="map" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
        app.currentRoute === 'map' ? 'font-bold text-cyan-400 bg-cyan-950/80' : 'hover:text-white hover:bg-slate-800'
      }">
        <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
        <span>Mapa</span>
      </button>
      <button data-nav-route="passport" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
        app.currentRoute === 'passport' ? 'font-bold text-cyan-400 bg-cyan-950/80' : 'hover:text-white hover:bg-slate-800'
      }">
        <i data-lucide="stamp" class="w-3.5 h-3.5"></i>
        <span>Pasaporte</span>
      </button>
      <button data-nav-route="ranks" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
        app.currentRoute === 'ranks' ? 'font-bold text-cyan-400 bg-cyan-950/80' : 'hover:text-white hover:bg-slate-800'
      }">
        <i data-lucide="trophy" class="w-3.5 h-3.5"></i>
        <span>Rangos</span>
      </button>
    </nav>

    <!-- Botón Superior "Validar visita" -->
    <div class="flex items-center gap-2">
      <button id="btn-header-validate" class="bg-[#13b8d4] hover:bg-[#0ea5be] active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all">
        <i data-lucide="scan" class="w-3.5 h-3.5"></i>
        <span>Validar visita</span>
      </button>
    </div>
  `;

  // El logo corporativo funciona como botón de Home
  header.querySelector("#nav-logo-btn").addEventListener("click", () => {
    app.navigate(user ? "home1" : "crea-pasaporte");
  });

  header.querySelectorAll("button[data-nav-route]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav-route");
      app.navigate(target);
    });
  });

  header.querySelector("#btn-header-validate").addEventListener("click", () => {
    const nextPending = app.standsList.find(s => !app.isStandCompleted(s.id)) || app.standsList[0];
    app.navigateQr(nextPending.id);
  });

  return header;
}

export function createBottomNavbar(app) {
  const nav = document.createElement("nav");
  nav.id = "mobile-bottom-navbar";
  nav.className = "md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 border-t border-slate-200 backdrop-blur-md px-3 flex items-center justify-around z-40 safe-bottom shadow-lg";

  const r = app.currentRoute;

  nav.innerHTML = `
    <button data-nav="home1" class="flex flex-col items-center justify-center w-14 transition-all ${
      r === 'home1' ? 'text-cyan-600 font-bold' : 'text-slate-400 hover:text-slate-700'
    }">
      <i data-lucide="layout-grid" class="w-5 h-5 mb-0.5"></i>
      <span class="text-[10px]">Inicio</span>
    </button>

    <button data-nav="map" class="flex flex-col items-center justify-center w-14 transition-all ${
      r === 'map' ? 'text-cyan-600 font-bold' : 'text-slate-400 hover:text-slate-700'
    }">
      <i data-lucide="map-pin" class="w-5 h-5 mb-0.5"></i>
      <span class="text-[10px]">Mapa</span>
    </button>

    <button data-nav="passport" class="flex flex-col items-center justify-center w-14 transition-all ${
      r === 'passport' ? 'text-cyan-600 font-bold' : 'text-slate-400 hover:text-slate-700'
    }">
      <i data-lucide="stamp" class="w-5 h-5 mb-0.5"></i>
      <span class="text-[10px]">Pasaporte</span>
    </button>

    <button data-nav="ranks" class="flex flex-col items-center justify-center w-14 transition-all ${
      r === 'ranks' ? 'text-cyan-600 font-bold' : 'text-slate-400 hover:text-slate-700'
    }">
      <i data-lucide="trophy" class="w-5 h-5 mb-0.5"></i>
      <span class="text-[10px]">Rangos</span>
    </button>
  `;

  nav.querySelectorAll("button[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav");
      app.navigate(target);
    });
  });

  return nav;
}
