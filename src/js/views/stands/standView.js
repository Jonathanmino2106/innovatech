/**
 * INNOVATECH - Plantilla Común de Vista de Estación (Stand)
 * Renderiza la tarjeta hero + tarjeta de validación para cualquier stand.
 * NOTA: la trivia/retos NO se manejan acá (se externalizan a Google Forms).
 */

export function createStandView(app, info) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-5 pb-24 md:pb-12";

  const isCompleted = app.isStandCompleted(info.id);

  container.innerHTML = `
    <!-- Botón Volver al mapa -->
    <button id="btn-back-map" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
      <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
      <span>Volver al mapa</span>
    </button>

    <!-- Layout Grid: Tarjeta Hero (3 cols) + Tarjeta Validación (2 cols) -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

      <!-- Tarjeta Hero Azul de la Estación -->
      <div class="md:col-span-3 bg-[#0f2742] text-white p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-xl relative overflow-hidden bg-grid-tech flex flex-col justify-between min-h-[260px]">
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20 mb-3">
            ${info.badgeLabel}
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ${info.name}
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-md">
            ${info.description}
          </p>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs text-slate-300">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
          <span>${info.location.split('/').pop().trim()}</span>
        </div>
      </div>

      <!-- Tarjeta Lateral de Validación -->
      <div class="md:col-span-2 space-y-3">
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              VALIDACIÓN DE LA ESTACIÓN
            </span>
            <h3 class="text-xl font-extrabold text-slate-900 leading-snug">
              Sella tu pasaporte
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Validá tu presencia en el QR físico de la estación (o con el código manual) para registrar el sello.
            </p>
          </div>

          <button id="btn-scan-qr" class="w-full ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#13b8d4] hover:bg-[#0ea5be] text-white'
          } font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md active:scale-95">
            <i data-lucide="scan" class="w-4 h-4"></i>
            <span>${isCompleted ? 'Sello obtenido · ver QR' : 'Validar presencia · ver QR'}</span>
          </button>
        </div>

        <div class="bg-white px-4 py-3 rounded-2xl border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-500">
          <i data-lucide="lock" class="w-3.5 h-3.5 text-amber-500 shrink-0"></i>
          <span>El QR se valida en el espacio físico de esta estación.</span>
        </div>
      </div>

    </div>
  `;

  // Listeners
  container.querySelector("#btn-back-map").addEventListener("click", () => {
    app.navigate("map");
  });

  container.querySelector("#btn-scan-qr").addEventListener("click", () => {
    app.navigateQr(info.id);
  });

  return container;
}
