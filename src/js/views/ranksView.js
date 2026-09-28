/**
 * INNOVATECH - Vista de Rangos y Logros (vista-rangos.png)
 * Muestra el listado de rangos alcanzables y logros especiales desbloqueables.
 */

export const RANKS_DATA = [
  { threshold: 0, title: "VISITANTE", minStamps: 0, desc: "Recién empieza tu recorrido." },
  { threshold: 1, title: "EXPLORADOR", minStamps: 1, desc: "Ya descubriste nuevas ideas en la feria." },
  { threshold: 2, title: "DESCUBRIDOR", minStamps: 2, desc: "Tu curiosidad te está llevando lejos." },
  { threshold: 3, title: "PIONERO", minStamps: 3, desc: "Casi completaste toda la feria de robótica." },
  { threshold: 5, title: "VISIONARIO", minStamps: 5, desc: "Exploraste los 5 stands como una persona visionaria." }
];

export const ACHIEVEMENTS_DATA = [
  { id: "ach-1", title: "Primera señal", desc: "Completaste tu primera estación", icon: "scan", condition: (c) => c >= 1 },
  { id: "ach-2", title: "Ruta completa", desc: "Completaste las 5 estaciones de robótica", icon: "award", condition: (c) => c >= 5 },
  { id: "ach-3", title: "Mente en movimiento", desc: "Superaste 3 desafíos técnicos con éxito", icon: "sparkles", condition: (c) => c >= 3 }
];

export function createRanksView(app) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-6 pb-24 md:pb-12";

  const completed = app.getCompletedCount();

  container.innerHTML = `
    <!-- Cabecera Rangos (vista-rangos.png) -->
    <div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Rangos y logros.
      </h2>
      <p class="text-xs text-slate-500 mt-0.5">Cada sello cambia tu perspectiva. Mira hasta dónde puede llegar tu recorrido.</p>
    </div>

    <!-- Lista Vertical de Rangos -->
    <div class="space-y-3">
      ${RANKS_DATA.map(rank => {
        const isUnlocked = completed >= rank.minStamps;
        const currentRank = RANKS_DATA.slice().reverse().find(r => completed >= r.minStamps) || RANKS_DATA[0];
        const isCurrent = currentRank.title === rank.title;

        return `
          <div class="bg-white p-5 rounded-2xl border ${
            isCurrent ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-200' : 'border-slate-200/80'
          } flex items-center justify-between transition-all">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center ${
                isUnlocked ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }">
                <i data-lucide="${isUnlocked ? 'compass' : 'lock'}" class="w-5 h-5"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-extrabold text-slate-900">${rank.title}</h4>
                  ${isCurrent ? '<span class="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Actual</span>' : ''}
                </div>
                <p class="text-xs text-slate-500 mt-0.5">${rank.desc}</p>
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-slate-400">${rank.minStamps} sellos</span>
          </div>
        `;
      }).join("")}
    </div>

    <!-- Logros Especiales -->
    <div class="space-y-3 pt-4">
      <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">LOGROS</span>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        ${ACHIEVEMENTS_DATA.map(ach => {
          const isDone = ach.condition(completed);
          return `
            <div class="bg-white p-4 rounded-2xl border ${isDone ? 'border-cyan-300 bg-cyan-50/10' : 'border-slate-200/80'} shadow-xs flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center ${isDone ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-400'}">
                <i data-lucide="${ach.icon}" class="w-4 h-4"></i>
              </div>
              <div>
                <h5 class="text-xs font-bold text-slate-900">${ach.title}</h5>
                <p class="text-[10px] text-slate-500">${ach.desc}</p>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  return container;
}
