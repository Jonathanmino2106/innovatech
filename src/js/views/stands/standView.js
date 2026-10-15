/**
 * INNOVARTECH - Plantilla Común de Vista de Estación (Stand)
 * Renderiza la tarjeta hero + tarjeta de validación para cualquier stand.
 * NOTA: la trivia/retos NO se manejan acá (se externalizan a Google Forms).
 */

export function createStandView(app, info) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-5 pb-24 md:pb-12";

  const isCompleted = app.isStandCompleted(info.id);

  // Misión secreta: cromo escondido propio de cada stand
  const cromo = info.cromo || null;
  const cromoFound = cromo ? app.isChromeFound(info.id) : false;
  const cromoDate = cromoFound && app.state.cromos[info.id]?.foundAt
    ? new Date(app.state.cromos[info.id].foundAt).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    : null;

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

          <button id="btn-scan-qr" class="w-full min-h-12 ${
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

    ${cromo ? `
    <!-- Misión Secreta: el cromo escondido de ESTA estación -->
    <div class="rounded-3xl border ${
      cromoFound ? 'border-amber-300/60 cromo-foil' : 'border-slate-700/60'
    } bg-[#0f2742] text-white p-6 shadow-xl relative overflow-hidden">
      <div class="relative z-10 space-y-4">

        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
              <i data-lucide="sparkles" class="w-3 h-3"></i>
              Misión secreta
            </span>
            ${cromoFound ? `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
              <i data-lucide="check" class="w-3 h-3"></i>
              Encontrado
            </span>` : ''}
          </div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 shrink-0">${cromo.code}</span>
        </div>

        ${cromoFound ? `
        <!-- Estado: cromo coleccionado (efecto foil) -->
        <div>
          <h3 class="text-xl font-extrabold leading-snug">¡Cromo encontrado!</h3>
          <p class="text-xs text-slate-300 mt-1">Sumaste esta pieza a tu colección oculta. Queda registrada en tu pasaporte.</p>
        </div>

        <div class="bg-black/25 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-[#0f2742] flex items-center justify-center shrink-0 shadow-lg">
            <i data-lucide="gem" class="w-7 h-7"></i>
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">Cromo ${cromo.code}</span>
            <h4 class="text-lg font-extrabold truncate">${cromo.name}</h4>
            <span class="text-[10px] text-slate-300">Rareza ${cromo.rarity}${cromoDate ? ` · obtenido el ${cromoDate}` : ""}</span>
          </div>
        </div>

        <button id="btn-goto-collection" class="w-full min-h-12 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all active:scale-95">
          <i data-lucide="layers" class="w-4 h-4"></i>
          <span>Ver mi colección de cromos</span>
        </button>
        ` : `
        <!-- Estado: pista de la misión secreta -->
        <div>
          <h3 class="text-xl font-extrabold leading-snug">Hay un cromo escondido en esta estación.</h3>
          <p class="text-xs text-slate-300 mt-1">Encontrá la pegatina oculta, escaneá su QR y sumalo a tu colección. No suma sellos: es sólo para quien mira bien.</p>
        </div>

        <div class="bg-black/25 border border-dashed border-amber-400/40 rounded-2xl p-4 flex items-start gap-3">
          <i data-lucide="search" class="w-4 h-4 text-amber-300 shrink-0 mt-0.5"></i>
          <div>
            <span class="text-[10px] font-mono uppercase tracking-widest text-amber-300/80 font-bold block mb-0.5">Pista</span>
            <p class="text-xs text-slate-200 leading-relaxed">${cromo.hint}</p>
          </div>
        </div>

        <button id="btn-find-cromo" class="w-full min-h-12 bg-amber-400 hover:bg-amber-300 active:scale-95 text-[#0f2742] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md">
          <i data-lucide="scan-search" class="w-4 h-4"></i>
          <span>Buscar el cromo</span>
        </button>
        `}

      </div>
    </div>
    ` : ""}
  `;

  // Listeners
  container.querySelector("#btn-back-map").addEventListener("click", () => {
    app.navigate("map");
  });

  container.querySelector("#btn-scan-qr").addEventListener("click", () => {
    app.navigateQr(info.id);
  });

  // Misión secreta: escanear el QR del cromo escondido (abre el escáner en modo cromo)
  const btnFindCromo = container.querySelector("#btn-find-cromo");
  if (btnFindCromo) {
    btnFindCromo.addEventListener("click", () => {
      app.navigateQr(info.id, "cromo");
    });
  }

  const btnGotoCollection = container.querySelector("#btn-goto-collection");
  if (btnGotoCollection) {
    btnGotoCollection.addEventListener("click", () => {
      app.navigate("passport");
    });
  }

  return container;
}
