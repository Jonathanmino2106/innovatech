/**
 * INNOVATECH - Stand 01: Robótica Industrial & Brazos Articulados
 * Diseño oficial basado en vista-estacion.png
 */

export const STAND_01_INFO = {
  id: "stand-01",
  code: "STAND01",
  num: "01",
  name: "Robótica Industrial & Brazos Articulados",
  category: "Robótica · Laboratorio de Tecnología",
  badgeLabel: "STAND 01 · ESPECIAL",
  location: "Entrada / Patio central / Laboratorio de Tecnología",
  mapCoords: { x: 30, y: 58 },
  description: "Experimentá con robots, sensores y sistemas de inteligencia artificial.",
  trivia: {
    challengeTitle: "Programá el robot",
    points: "1 puntos · respuesta rápida",
    question: "¿Cuál es la función principal de la visión por computadora en brazos robóticos industriales?",
    options: [
      "Aumentar el consumo de energía eléctrica",
      "Reconocer, clasificar y posicionar piezas con precisión milimétrica",
      "Controlar la temperatura ambiente del taller",
      "Reproducir avisos sonoros de seguridad"
    ],
    correctIndex: 1,
    explanation: "La visión artificial permite al robot inspeccionar, identificar y manipular objetos dinámicamente en tiempo real."
  }
};

export function renderStand01(app) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-5 pb-24 md:pb-12";

  const isCompleted = app.isStandCompleted(STAND_01_INFO.id);

  container.innerHTML = `
    <!-- Botón Volver al mapa -->
    <button id="btn-back-map" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
      <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
      <span>Volver al mapa</span>
    </button>

    <!-- Layout Grid: Tarjeta Hero (3 cols) + Tarjeta Actividad (2 cols) (vista-estacion.png) -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
      
      <!-- Tarjeta Hero Azul de la Estación -->
      <div class="md:col-span-3 bg-[#0f2742] text-white p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-xl relative overflow-hidden bg-grid-tech flex flex-col justify-between min-h-[260px]">
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20 mb-3">
            ${STAND_01_INFO.badgeLabel}
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ${STAND_01_INFO.name}
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-md">
            ${STAND_01_INFO.description}
          </p>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs text-slate-300">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
          <span>${STAND_01_INFO.location.split('/').pop().trim()}</span>
        </div>
      </div>

      <!-- Tarjeta Lateral de Actividad y Trivia -->
      <div class="md:col-span-2 space-y-3">
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              ACTIVIDAD DE LA ESTACIÓN
            </span>
            <h3 class="text-xl font-extrabold text-slate-900 leading-snug">
              1 desafío para activar
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Completa el reto y después valida el QR físico para guardar el sello.
            </p>
          </div>

          <!-- Botón de Trivia Desplegable -->
          <button id="btn-open-trivia" class="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-cyan-400 bg-slate-50 flex items-center justify-between text-left active:scale-[0.99] transition-all">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center shadow-xs">
                1
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-900">${STAND_01_INFO.trivia.challengeTitle}</h4>
                <p class="text-[10px] text-slate-500">${STAND_01_INFO.trivia.points}</p>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
          </button>

          <!-- Botón Validar QR -->
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

    <!-- Modal de Trivia de este Stand -->
    <div id="modal-trivia-box" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-widest text-cyan-700 font-bold block mb-0.5">
              DESAFÍO RÁPIDO
            </span>
            <h3 class="text-lg font-extrabold text-slate-900 leading-snug">
              ${STAND_01_INFO.name}
            </h3>
          </div>
          <button id="btn-close-modal" class="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
          ${STAND_01_INFO.trivia.question}
        </p>

        <div id="modal-options-list" class="space-y-2 pt-1">
          ${STAND_01_INFO.trivia.options.map((opt, idx) => `
            <button data-idx="${idx}" class="opt-choice-btn w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-cyan-500 bg-slate-50 text-xs font-medium text-slate-800 transition-all flex items-center justify-between">
              <span>${opt}</span>
              <i data-lucide="circle" class="w-4 h-4 text-slate-400"></i>
            </button>
          `).join("")}
        </div>

        <div id="modal-trivia-feedback" class="hidden p-3.5 rounded-2xl border text-xs leading-relaxed"></div>
      </div>
    </div>
  `;

  // Listeners
  container.querySelector("#btn-back-map").addEventListener("click", () => {
    app.navigate("map");
  });

  const modalBox = container.querySelector("#modal-trivia-box");
  container.querySelector("#btn-open-trivia").addEventListener("click", () => {
    modalBox.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
  });

  container.querySelector("#btn-close-modal").addEventListener("click", () => {
    modalBox.classList.add("hidden");
  });

  container.querySelector("#btn-scan-qr").addEventListener("click", () => {
    app.navigateQr(STAND_01_INFO.id);
  });

  // Lógica de validación de trivia
  const feedbackDiv = container.querySelector("#modal-trivia-feedback");
  container.querySelectorAll(".opt-choice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      const isCorrect = idx === STAND_01_INFO.trivia.correctIndex;

      if (isCorrect) {
        container.querySelectorAll(".opt-choice-btn").forEach((b, i) => {
          b.classList.add("pointer-events-none");
          if (i === STAND_01_INFO.trivia.correctIndex) {
            b.className = "w-full text-left p-3.5 rounded-xl border border-emerald-500 bg-emerald-50 text-xs font-semibold text-emerald-900 transition-all flex items-center justify-between";
            b.innerHTML = `<span>${STAND_01_INFO.trivia.options[i]}</span><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>`;
          }
        });

        feedbackDiv.className = "p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 space-y-1";
        feedbackDiv.innerHTML = `
          <p class="font-bold flex items-center gap-1.5 text-emerald-800">
            <i data-lucide="check" class="w-4 h-4"></i> ¡Correcto! Desafío superado.
          </p>
          <p class="text-[11px] text-emerald-700">${STAND_01_INFO.trivia.explanation}</p>
        `;
        feedbackDiv.classList.remove("hidden");

        setTimeout(() => {
          modalBox.classList.add("hidden");
          app.navigateQr(STAND_01_INFO.id);
        }, 1200);

      } else {
        btn.classList.add("border-rose-500", "bg-rose-50", "animate-shake");
        feedbackDiv.className = "p-3.5 rounded-2xl border border-rose-200 bg-rose-50 text-xs text-rose-800";
        feedbackDiv.innerHTML = `
          <p class="font-bold flex items-center gap-1.5 text-rose-700">
            <i data-lucide="alert-circle" class="w-4 h-4"></i> Respuesta Incorrecta
          </p>
          <p class="text-[11px] text-rose-600 mt-0.5">Vuelve a leer el proyecto del stand e inténtalo de nuevo.</p>
        `;
        feedbackDiv.classList.remove("hidden");

        setTimeout(() => btn.classList.remove("animate-shake"), 400);
      }

      if (window.lucide) window.lucide.createIcons();
    });
  });

  return container;
}
