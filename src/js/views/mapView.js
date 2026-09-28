/**
 * INNOVATECH - Vista de Mapa Demostrativo (vista-mapa.png)
 * Plano con pasillos redondeados en cruz, los 5 pines interactivos y la tarjeta lateral del stand.
 */

export function createMapView(app) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-6 pb-24 md:pb-12";

  const stands = app.standsList;
  let activeStandId = stands[0].id;

  container.innerHTML = `
    <!-- Cabecera del Mapa -->
    <div class="flex items-start justify-between">
      <div>
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-0.5">
          PLANO DEMOSTRATIVO
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Elige tu próxima señal.
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">Toca un pin para conocer el stand y seguir la ruta.</p>
      </div>

      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
        <i data-lucide="users" class="w-3 h-3 text-slate-500"></i>
        <span>5 estaciones activas</span>
      </span>
    </div>

    <!-- Layout Grid: Mapa (3 cols) + Tarjeta Lateral (2 cols) -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
      
      <!-- Plano Esquemático de la Feria -->
      <div class="md:col-span-3 space-y-3">
        <div class="relative w-full aspect-[4/3] rounded-3xl border-2 border-slate-200 overflow-hidden shadow-inner map-canvas-grid flex items-center justify-center">
          
          <!-- Pasillos en Cruz Vectoriales -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
            <!-- Pasillo Horizontal -->
            <rect x="50" y="130" width="300" height="40" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
            <!-- Pasillo Vertical -->
            <rect x="180" y="30" width="40" height="240" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
            <!-- Cruce central limpio -->
            <rect x="181" y="131" width="38" height="38" fill="#ffffff" />
          </svg>

          <!-- Capa de Pines de los 5 Stands -->
          <div id="map-pins-container" class="absolute inset-0 pointer-events-auto">
            ${stands.map(stand => {
              const isDone = app.isStandCompleted(stand.id);
              return `
                <button 
                  data-pin-id="${stand.id}" 
                  style="left: ${stand.mapCoords.x}%; top: ${stand.mapCoords.y}%;"
                  class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none transition-transform active:scale-125"
                >
                  <div class="pin-badge w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs transition-all ${
                    isDone 
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300' 
                      : 'bg-[#132840] text-cyan-300 ring-2 ring-slate-400 hover:ring-cyan-400'
                  }">
                    ${stand.num}
                  </div>
                </button>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Leyenda Inferior de Colores -->
        <div class="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>visitado</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#132840]"></span>
            <span>pendiente</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta del Stand Seleccionado (Exacta a vista-mapa.png) -->
      <div id="map-stand-card" class="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div class="flex items-start justify-between">
          <span id="card-stand-badge" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200">
            STAND 01
          </span>
          <div class="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
          </div>
        </div>

        <div>
          <h3 id="card-stand-title" class="text-xl font-bold text-slate-900 leading-tight">
            Robótica Industrial & Brazos Articulados
          </h3>
          <p id="card-stand-category" class="text-xs text-slate-500 mt-1 font-medium">
            Automatización & Visión Artificial
          </p>
        </div>

        <p id="card-stand-desc" class="text-xs text-slate-600 leading-relaxed">
          Descripción del stand...
        </p>

        <div class="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <i data-lucide="corner-down-right" class="w-3.5 h-3.5 text-cyan-600 shrink-0"></i>
          <span id="card-stand-location" class="truncate">Pabellón A · Entrada Oeste</span>
        </div>

        <button id="btn-open-stand-page" class="w-full bg-[#132840] hover:bg-[#0a1827] active:scale-95 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all shadow-sm">
          <span>Ver estación</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>

    </div>
  `;

  function updateActiveStand(standId) {
    activeStandId = standId;
    const stand = stands.find(s => s.id === standId) || stands[0];
    const isDone = app.isStandCompleted(stand.id);

    container.querySelector("#card-stand-badge").textContent = `STAND ${stand.num}`;
    container.querySelector("#card-stand-title").textContent = stand.name;
    container.querySelector("#card-stand-category").textContent = stand.category;
    container.querySelector("#card-stand-desc").textContent = stand.description;
    container.querySelector("#card-stand-location").textContent = stand.location;

    // Resaltar pin seleccionado
    container.querySelectorAll("button[data-pin-id]").forEach(btn => {
      const id = btn.getAttribute("data-pin-id");
      const badge = btn.querySelector(".pin-badge");
      const done = app.isStandCompleted(id);

      if (id === standId) {
        badge.className = done
          ? "pin-badge w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs bg-emerald-500 text-white ring-4 ring-emerald-300 scale-110"
          : "pin-badge w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs bg-[#132840] text-cyan-300 ring-4 ring-cyan-400 scale-110 animate-pin-bounce";
      } else {
        badge.className = done
          ? "pin-badge w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs bg-emerald-500 text-white"
          : "pin-badge w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs bg-[#132840] text-white";
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  container.querySelectorAll("button[data-pin-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-pin-id");
      updateActiveStand(id);
    });
  });

  container.querySelector("#btn-open-stand-page").addEventListener("click", () => {
    app.navigate(activeStandId);
  });

  updateActiveStand(activeStandId);
  return container;
}
