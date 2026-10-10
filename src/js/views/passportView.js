/**
 * INNOVATECH - Vista de Pasaporte / Colección Personal (vista-pasaporte.png)
 * Muestra el rango actual, desafíos resueltos, avance de la ruta y la grilla con los 5 stands.
 */

import { getRankTitle } from '../ranks.js';

export function createPassportView(app) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-6 pb-24 md:pb-12";

  const stands = app.standsList;
  const total = stands.length;
  const completed = stands.filter(s => app.isStandCompleted(s.id)).length;
  const percent = Math.round((completed / total) * 100);

  // Colección oculta de cromos secretos (no afecta sellos ni rango)
  const chromeTotal = stands.filter(s => s.cromo).length;
  const chromeCount = app.getChromeCount();

  // Rango alcanzado (módulo único de verdad: ranks.js)
  const rankTitle = getRankTitle(completed);

  // Código del visitante (para recordarlo desde el tablero)
  const userCode = (app.state.user && (app.state.user.passportCode || app.state.user.codigo_pasaporte)) || "—";

  container.innerHTML = `
    <!-- Cabecera del Pasaporte (vista-pasaporte.png) -->
    <div class="flex items-start justify-between">
      <div>
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-0.5">
          COLECCIÓN PERSONAL
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tu pasaporte.
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">Cada sello guarda una estación de tu recorrido.</p>
      </div>

      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
        <i data-lucide="stamp" class="w-3 h-3 text-slate-500"></i>
        <span>${completed}/${total} sellos</span>
      </span>
    </div>

    <!-- 3 Tarjetas Superiores de Resumen -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 border border-cyan-100">
          <i data-lucide="compass" class="w-5 h-5"></i>
        </div>
        <div>
          <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">RANGO ACTUAL</span>
          <h4 class="text-sm font-extrabold text-slate-900">${rankTitle}</h4>
          <span class="text-[10px] text-slate-500">${completed} sellos activos</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-0.5">DESAFÍOS</span>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-black text-slate-900">${completed}</span>
        </div>
        <span class="text-[10px] text-slate-500">señales resueltas</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">AVANCE</span>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
          <div class="h-full bg-slate-400 rounded-full transition-all duration-300" style="width: ${percent}%"></div>
        </div>
        <span class="text-[10px] text-slate-500 mt-2 block">${percent}% de la ruta</span>
      </div>

    </div>

    <!-- Grilla de Sellos Coleccionados -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">GRILLA DE SELLOS</span>
          <h3 class="text-lg font-extrabold text-slate-900">Señales coleccionadas</h3>
        </div>
        <span class="text-xs font-semibold text-cyan-700">${completed === total ? '¡Ruta completa!' : `Faltan ${total - completed}`}</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        ${stands.map(stand => {
          const isDone = app.isStandCompleted(stand.id);
          return `
            <div 
              data-open-stand="${stand.id}" 
              class="cursor-pointer bg-white p-4 rounded-2xl border ${
                isDone ? 'border-cyan-300 bg-cyan-50/20' : 'border-slate-200/80'
              } shadow-xs hover:border-cyan-400 transition-all flex flex-col justify-between min-h-[90px] active:scale-[0.98]"
            >
              <div class="w-7 h-7 rounded-xl flex items-center justify-center ${
                isDone ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-400'
              }">
                <i data-lucide="${isDone ? 'award' : 'lock'}" class="w-3.5 h-3.5"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-900 truncate">${stand.name}</h4>
                <span class="text-[10px] text-slate-400">Stand ${stand.num} ${isDone ? 'activo' : 'pendiente'}</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <!-- Grilla de Cromos Secretos (colección oculta, misión secreta) -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">CROMOS SECRETOS</span>
          <h3 class="text-lg font-extrabold text-slate-900">Colección oculta</h3>
        </div>
        <span class="text-xs font-semibold text-amber-600">${chromeCount}/${chromeTotal} cromos</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        ${stands.filter(s => s.cromo).map(stand => {
          const cromo = stand.cromo;
          const found = app.isChromeFound(stand.id);
          return `
            <div
              data-open-stand="${stand.id}"
              class="cursor-pointer p-4 rounded-2xl border shadow-xs transition-all flex flex-col justify-between min-h-[110px] active:scale-[0.98] ${
                found
                  ? 'cromo-foil bg-[#0f2742] border-amber-300/60 hover:border-amber-200'
                  : 'cromo-locked bg-white border-slate-200/80 hover:border-slate-300'
              }"
            >
              <div class="w-7 h-7 rounded-xl flex items-center justify-center ${
                found ? 'bg-amber-300 text-[#0f2742]' : 'bg-slate-100 text-slate-400'
              }">
                <i data-lucide="${found ? 'gem' : 'lock'}" class="w-3.5 h-3.5"></i>
              </div>
              <div class="relative z-10">
                <h4 class="text-xs font-bold truncate ${found ? 'text-white' : 'text-slate-900'}">
                  ${found ? cromo.name : '???'}
                </h4>
                <span class="text-[10px] ${found ? 'text-amber-200' : 'text-slate-400'}">
                  ${found ? `Cromo ${stand.num} · ${cromo.rarity}` : `Stand ${stand.num} · sin encontrar`}
                </span>
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <p class="text-[11px] text-slate-400 leading-relaxed">
        Cada estación esconde un cromo con su propia pista. No suman sellos ni rango: son sólo para quien mira bien.
      </p>
    </div>

    <!-- Cerrar Sesión -->
    <div class="pt-4 border-t border-slate-200/80 space-y-3">
      <button
        id="btn-logout"
        class="w-full min-h-12 bg-white hover:bg-rose-50 active:scale-[0.99] text-rose-600 font-semibold text-sm px-4 py-3 rounded-xl flex items-center justify-center gap-2 border border-rose-200 transition-all"
      >
        <i data-lucide="log-out" class="w-4 h-4"></i>
        <span id="btn-logout-text">Cerrar sesión</span>
      </button>
      <p class="text-[11px] text-slate-400 text-center leading-relaxed">
        Tu código <span class="font-mono font-bold text-slate-600">${userCode}</span> queda guardado:
        puedes recuperar tu recorrido desde "Ya tengo mi pasaporte".
      </p>
    </div>
  `;

  // Cerrar sesión con confirmación en dos toques (evita toques accidentales en el kiosco)
  const btnLogout = container.querySelector("#btn-logout");
  const btnLogoutText = container.querySelector("#btn-logout-text");
  let confirmTimer = null;

  btnLogout.addEventListener("click", () => {
    if (btnLogout.dataset.confirm === "1") {
      clearTimeout(confirmTimer);
      app.logout();
      app.navigate("crea-pasaporte");
      return;
    }
    btnLogout.dataset.confirm = "1";
    btnLogout.classList.add("ring-2", "ring-rose-300", "bg-rose-50");
    btnLogoutText.textContent = "¿Seguro? Toca otra vez para cerrar";
    confirmTimer = setTimeout(() => {
      btnLogout.dataset.confirm = "";
      btnLogout.classList.remove("ring-2", "ring-rose-300", "bg-rose-50");
      btnLogoutText.textContent = "Cerrar sesión";
    }, 4000);
  });

  container.querySelectorAll("div[data-open-stand]").forEach(card => {
    card.addEventListener("click", () => {
      const standId = card.getAttribute("data-open-stand");
      app.navigate(standId);
    });
  });

  return container;
}
