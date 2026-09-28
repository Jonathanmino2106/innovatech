/**
 * INNOVATECH - Vista 'home1' / Panel de Control Principal del Visitante
 * Basada exactamente en panel-recorrido.png (Tarjeta hero de progreso, siguiente estación y tablero).
 */

export function createHomeView(app) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-6 pb-24 md:pb-12";

  const user = app.state.user || { nickname: "Visitante", passportCode: "FT26-2470" };
  const stands = app.standsList;
  const total = stands.length;
  const completed = app.getCompletedCount();
  const percent = Math.round((completed / total) * 100);

  // Rango alcanzado
  let rankTitle = user.rango_actual || "VISITANTE";
  if (percent >= 100) rankTitle = "VISIONARIO";
  else if (percent >= 80) rankTitle = "PIONERO";
  else if (percent >= 40) rankTitle = "DESCUBRIDOR";
  else if (percent >= 20) rankTitle = "EXPLORADOR";

  // Siguiente estación recomendada (primer stand pendiente o stand-01)
  const nextStand = stands.find(s => !app.isStandCompleted(s.id)) || stands[0];

  container.innerHTML = `
    <!-- Saludo y Estado Actual (panel-recorrido.png) -->
    <div class="flex items-start justify-between">
      <div>
        <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
          PANEL DE RECORRIDO
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hola, ${user.nickname}.
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Tu próxima señal está a un mapa de distancia.
        </p>
      </div>

      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>${rankTitle}</span>
      </span>
    </div>

    <!-- Fila Superior: Progreso Actual + Siguiente Estación -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      
      <!-- Tarjeta Azul de Progreso (3 columnas) -->
      <div class="md:col-span-3 bg-[#0f2742] text-white p-6 rounded-3xl border border-slate-700/60 shadow-md relative overflow-hidden bg-grid-tech flex flex-col justify-between">
        <div class="relative z-10">
          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
            PROGRESO ACTUAL
          </span>
          <div class="flex items-baseline gap-1 my-1">
            <span class="text-4xl sm:text-5xl font-black text-white">${percent}</span>
            <span class="text-xl sm:text-2xl font-bold text-cyan-400">%</span>
          </div>

          <!-- Barra de Progreso Blanca -->
          <div class="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden mt-4 p-0.5">
            <div class="h-full bg-white rounded-full transition-all duration-500" style="width: ${percent}%"></div>
          </div>
        </div>

        <div class="relative z-10 flex items-center justify-between text-[11px] text-slate-400 mt-6 pt-3 border-t border-slate-800">
          <span>${completed} de ${total} sellos activos</span>
          <span>${total - completed} pendientes</span>
        </div>
      </div>

      <!-- Tarjeta Siguiente Estación (2 columnas) -->
      <div class="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
                SIGUIENTE ESTACIÓN
              </span>
              <h3 class="text-lg font-bold text-slate-900 leading-snug">
                ${nextStand.name}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">${nextStand.location}</p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 shrink-0">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
          </div>
        </div>

        <button id="btn-open-next" class="w-full mt-6 bg-[#132840] hover:bg-[#0a1827] active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all shadow-sm">
          <span>Abrir estación</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>

    </div>

    <!-- Sección "TU TABLERO: Elige tu siguiente movimiento" -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">TU TABLERO</span>
          <h3 class="text-lg font-extrabold text-slate-900">Elige tu siguiente movimiento</h3>
        </div>
        <button id="btn-see-pending" class="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1">
          <span>Ver pendientes</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Explorar mapa -->
        <button id="action-map" class="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-cyan-300 shadow-sm text-left active:scale-[0.98] transition-all group">
          <div class="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 group-hover:bg-cyan-100 transition-colors">
            <i data-lucide="map-pin" class="w-4 h-4"></i>
          </div>
          <h4 class="text-xs font-bold text-slate-900">Explorar mapa</h4>
          <p class="text-[11px] text-slate-500 mt-1 leading-snug">Ubica la próxima estación y planifica tu ruta.</p>
        </button>

        <!-- Ver pasaporte -->
        <button id="action-passport" class="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-cyan-300 shadow-sm text-left active:scale-[0.98] transition-all group">
          <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
            <i data-lucide="stamp" class="w-4 h-4"></i>
          </div>
          <h4 class="text-xs font-bold text-slate-900">Ver pasaporte</h4>
          <p class="text-[11px] text-slate-500 mt-1 leading-snug">Revisa sellos, avances y logros desbloqueados.</p>
        </button>

        <!-- Validar QR -->
        <button id="action-qr" class="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-cyan-300 shadow-sm text-left active:scale-[0.98] transition-all group">
          <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
            <i data-lucide="scan" class="w-4 h-4"></i>
          </div>
          <h4 class="text-xs font-bold text-slate-900">Validar QR</h4>
          <p class="text-[11px] text-slate-500 mt-1 leading-snug">Activa un sello al llegar físicamente a un stand.</p>
        </button>
      </div>
    </div>
  `;

  // Asignar listeners
  container.querySelector("#btn-open-next").addEventListener("click", () => {
    app.navigate(nextStand.id);
  });
  container.querySelector("#btn-see-pending").addEventListener("click", () => {
    app.navigate("passport");
  });
  container.querySelector("#action-map").addEventListener("click", () => {
    app.navigate("map");
  });
  container.querySelector("#action-passport").addEventListener("click", () => {
    app.navigate("passport");
  });
  container.querySelector("#action-qr").addEventListener("click", () => {
    app.navigateQr(nextStand.id);
  });

  return container;
}
