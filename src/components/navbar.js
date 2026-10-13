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
          class="h-16 md:h-24 w-auto object-contain drop-shadow-sm" 
          onerror="this.onerror=null; this.src='./assets/innova.png';"
        />
      </button>
    </div>

    <!-- Navegación Superior Desktop / Tablet (FAB "Mapa" elevado al centro) -->
    <nav class="hidden md:flex items-center gap-1 text-xs font-medium text-slate-300">
      <button data-nav-route="home1" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
        app.currentRoute === 'home1' ? 'font-bold text-cyan-400 bg-cyan-950/80' : 'hover:text-white hover:bg-slate-800'
      }">
        <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
        <span>Inicio</span>
      </button>
      <button data-nav-route="passport" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
        app.currentRoute === 'passport' ? 'font-bold text-cyan-400 bg-cyan-950/80' : 'hover:text-white hover:bg-slate-800'
      }">
        <i data-lucide="stamp" class="w-3.5 h-3.5"></i>
        <span>Pasaporte</span>
      </button>

      <!-- Botón grande "Mapa" elevado al centro del navbar -->
      <button
        data-nav-route="map"
        title="Ver el mapa"
        aria-label="Ver el mapa"
        class="map-fab relative flex flex-col items-center justify-center px-4 py-1 focus:outline-none ${
          app.currentRoute === 'map' ? 'map-fab-active' : ''
        }"
      >
        <span class="map-fab-circle w-14 h-14 md:w-16 md:h-16 rounded-full text-white flex items-center justify-center border border-white/20">
          <i data-lucide="map-pin" class="w-7 h-7"></i>
        </span>
        <span class="mt-1 text-[10px] font-bold uppercase tracking-wider ${
          app.currentRoute === 'map' ? 'text-cyan-400' : 'text-slate-400'
        }">Mapa</span>
      </button>

      <button data-nav-route="ranks" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
        app.currentRoute === 'ranks' ? 'font-bold text-cyan-400 bg-cyan-950/80' : 'hover:text-white hover:bg-slate-800'
      }">
        <i data-lucide="trophy" class="w-3.5 h-3.5"></i>
        <span>Rangos</span>
      </button>
      <button data-nav-route="stats" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
        app.currentRoute === 'stats' ? 'font-bold text-cyan-400 bg-cyan-950/80' : 'hover:text-white hover:bg-slate-800'
      }">
        <i data-lucide="bar-chart-3" class="w-3.5 h-3.5"></i>
        <span>Estadísticas</span>
      </button>
    </nav>

    <!-- Botón Superior "Validar visita" + Cerrar sesión -->
    <div class="flex items-center gap-1.5 md:gap-2">
      ${user ? `
      <button id="btn-header-logout" title="Cerrar sesión" aria-label="Cerrar sesión" class="flex w-10 h-10 md:w-11 md:h-11 items-center justify-center rounded-xl text-slate-400 hover:text-rose-400 active:text-rose-400 hover:bg-slate-800 active:bg-slate-800 transition-all">
        <i data-lucide="log-out" class="w-4 h-4"></i>
      </button>` : ''}
      <button id="btn-header-validate" class="hidden md:flex min-h-11 bg-[#13b8d4] hover:bg-[#0ea5be] active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-xl items-center gap-1.5 shadow-sm transition-all">
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

  // Cerrar sesión desde el header (confirmación en dos toques)
  const btnHeaderLogout = header.querySelector("#btn-header-logout");
  if (btnHeaderLogout) {
    let logoutTimer = null;
    btnHeaderLogout.addEventListener("click", () => {
      if (btnHeaderLogout.dataset.confirm === "1") {
        clearTimeout(logoutTimer);
        app.logout();
        app.navigate("crea-pasaporte");
        return;
      }
      btnHeaderLogout.dataset.confirm = "1";
      btnHeaderLogout.classList.add("text-rose-400", "bg-rose-950", "animate-pulse");
      app.showToast("¿Cerrar sesión? Toca otra vez para confirmar.");
      logoutTimer = setTimeout(() => {
        btnHeaderLogout.dataset.confirm = "";
        btnHeaderLogout.classList.remove("text-rose-400", "bg-rose-950", "animate-pulse");
      }, 4000);
    });
  }

  return header;
}

export function createBottomNavbar(app) {
  const nav = document.createElement("nav");
  nav.id = "mobile-bottom-navbar";
  // La altura y el área segura los resuelve .bottom-nav-safe (styles.css):
  // antes había un h-16 fijo con padding interno, lo que comprimía los íconos.
  nav.className = "md:hidden fixed bottom-0 left-0 right-0 bottom-nav-safe bg-white border-t border-slate-200 px-2 flex items-center z-40 shadow-[0_-4px_16px_rgba(15,39,66,0.08)]";

  const r = app.currentRoute;
  const itemClass = (active) => `flex flex-col items-center justify-center w-14 transition-all ${
    active ? 'text-cyan-600 font-bold' : 'text-slate-400 hover:text-slate-700'
  }`;

  nav.innerHTML = `
    <!-- Grupo izquierdo -->
    <div class="flex-1 flex items-center justify-around">
      <button data-nav="home1" class="${itemClass(r === 'home1')}">
        <i data-lucide="layout-grid" class="w-5 h-5 mb-0.5"></i>
        <span class="text-[10px]">Inicio</span>
      </button>

      <button data-nav="passport" class="${itemClass(r === 'passport')}">
        <i data-lucide="stamp" class="w-5 h-5 mb-0.5"></i>
        <span class="text-[10px]">Pasaporte</span>
      </button>
    </div>

    <!-- Hueco central reservado para el FAB "Mapa" -->
    <div class="w-[72px] shrink-0" aria-hidden="true"></div>

    <!-- Grupo derecho -->
    <div class="flex-1 flex items-center justify-around">
      <button data-nav="ranks" class="${itemClass(r === 'ranks')}">
        <i data-lucide="trophy" class="w-5 h-5 mb-0.5"></i>
        <span class="text-[10px]">Rangos</span>
      </button>

      <button id="btn-bottom-validate" title="Validar visita" aria-label="Validar visita" class="flex flex-col items-center justify-center w-14 transition-all text-slate-400 hover:text-slate-700">
        <i data-lucide="scan" class="w-5 h-5 mb-0.5"></i>
        <span class="text-[10px]">Validar</span>
      </button>
    </div>

    <!-- Botón grande "Mapa" elevado al centro del navbar -->
    <button
      data-nav="map"
      title="Ver el mapa"
      aria-label="Ver el mapa"
      class="map-fab absolute left-1/2 -translate-x-1/2 -top-6 z-50 flex flex-col items-center justify-center focus:outline-none ${
        r === 'map' ? 'map-fab-active' : ''
      }"
    >
      <span class="map-fab-circle w-16 h-16 rounded-full text-white flex items-center justify-center border border-white/20">
        <i data-lucide="map-pin" class="w-7 h-7"></i>
      </span>
      <span class="mt-0.5 text-[10px] font-bold ${
        r === 'map' ? 'text-cyan-600' : 'text-slate-500'
      }">Mapa</span>
    </button>
  `;

  nav.querySelectorAll("button[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav");
      app.navigate(target);
    });
  });

  // "Validar visita": abre el QR del próximo stand pendiente (misma lógica que el header)
  nav.querySelector("#btn-bottom-validate").addEventListener("click", () => {
    const nextPending = app.standsList.find(s => !app.isStandCompleted(s.id)) || app.standsList[0];
    app.navigateQr(nextPending.id);
  });

  return nav;
}
