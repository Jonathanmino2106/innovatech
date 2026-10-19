/**
 * INNOVARTECH - Modal de "Ruta completa"
 * Se despliega cuando el visitante obtiene los 5 sellos (ver unlockStamp en app.js).
 * Agradece la visita y da acceso al formulario de votación del mejor stand.
 * Se monta en <body>, se cierra con Escape / clic fuera / botón y bloquea el scroll.
 */

// Formulario de votación al mejor stand (Google Forms)
export const FORM_VOTACION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfE2swmUA0tP8MKThmztSuAVFaItK0Kn_KtFwph0kLD8S0mbg/viewform";

export function showRutaCompletaModal() {
  // Evita duplicados si por cualquier motivo se dispara dos veces
  if (document.getElementById("ruta-completa-modal")) return () => {};

  const overlay = document.createElement("div");
  overlay.id = "ruta-completa-modal";
  overlay.className = "fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "ruta-completa-titulo");

  overlay.innerHTML = `
    <div class="toast-slide-up w-full max-w-md bg-[#0f2742] bg-grid-tech text-white rounded-3xl border border-cyan-500/30 shadow-2xl p-6 sm:p-7 relative">
      <!-- Ícono de logro -->
      <div class="w-14 h-14 rounded-2xl bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4">
        <i data-lucide="trophy" class="w-7 h-7"></i>
      </div>

      <span class="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold block text-center mb-1">
        Ruta completa · 5 de 5 sellos
      </span>
      <h2 id="ruta-completa-titulo" class="text-xl sm:text-2xl font-extrabold text-white text-center leading-tight">
        ¡Gracias por visitar la feria!
      </h2>
      <p class="text-xs sm:text-[13px] text-slate-300 text-center mt-3 leading-relaxed">
        Sellaste las 5 estaciones de <strong class="text-white">INNOVARTECH</strong> y completaste tu
        pasaporte. Para cerrar el recorrido, contanos cuál fue tu stand favorito: la votación
        tarda menos de un minuto.
      </p>

      <a
        id="btn-votar-stand"
        href="${FORM_VOTACION_URL}"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full min-h-12 mt-6 bg-[#13b8d4] hover:bg-[#0ea5be] active:scale-95 text-white font-bold text-sm px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
      >
        <i data-lucide="vote" class="w-4 h-4"></i>
        <span>Votar el mejor stand</span>
        <i data-lucide="external-link" class="w-3.5 h-3.5 opacity-80"></i>
      </a>

      <button
        id="btn-cerrar-ruta-completa"
        class="w-full min-h-12 mt-3 text-slate-300 hover:text-white font-semibold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all"
      >
        <span>Cerrar</span>
      </button>

      <p class="text-[10px] text-slate-500 text-center mt-1">
        La votación se abre en una pestaña nueva.
      </p>
    </div>
  `;

  // Bloquea el scroll del body mientras el modal está abierto
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const close = () => {
    document.removeEventListener("keydown", onKey);
    overlay.remove();
    document.body.style.overflow = previousOverflow;
  };

  const onKey = (e) => {
    if (e.key === "Escape") close();
  };

  overlay.addEventListener("click", (e) => {
    // Clic en el fondo (no en la tarjeta) → cerrar
    if (e.target === overlay) close();
  });

  overlay.querySelector("#btn-cerrar-ruta-completa").addEventListener("click", close);
  document.addEventListener("keydown", onKey);

  document.body.appendChild(overlay);
  if (window.lucide) window.lucide.createIcons();

  // El foco arranca en el enlace de votación (es la acción principal)
  const btnVotar = overlay.querySelector("#btn-votar-stand");
  if (btnVotar && typeof btnVotar.focus === "function") btnVotar.focus();

  return close;
}
