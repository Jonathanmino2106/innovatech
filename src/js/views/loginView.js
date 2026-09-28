/**
 * INNOVATECH - Vista de Creación de Pasaporte (crea-pasaporte)
 * Diseño exacto a crear-pasaporte.png y pasaporte-creado.png
 * Registra el usuario en Supabase (tabla usuarios) y en localStorage antes de habilitar home1.
 */

export function createCreaPasaporteView(app) {
  const container = document.createElement("div");
  container.className = "w-full max-w-md mx-auto px-4 py-6 md:py-8 space-y-6 pb-24 md:pb-12";

  let isCreated = false;
  let createdUser = null;

  function render() {
    container.innerHTML = "";

    if (!isCreated) {
      // Pantalla de formulario: crear-pasaporte.png
      container.innerHTML = `
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span class="font-mono uppercase font-bold text-[11px] text-cyan-600">INNOVATECH 2026</span>
          <span class="font-mono uppercase font-bold text-[11px] text-slate-400">PASO 01 / 03</span>
        </div>

        <div>
          <span class="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
            TU IDENTIDAD DE VISITANTE
          </span>
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dale un nombre<br />a tu recorrido.
          </h2>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed">
            Solo necesitamos un nickname. El curso es opcional y nos ayuda a leer cómo se mueve la feria.
          </p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <form id="form-crear-pasaporte" class="space-y-4">
            <div>
              <label for="create-nickname" class="block text-xs font-bold text-slate-700 mb-1.5">
                Nickname <span class="text-cyan-600">*</span>
              </label>
              <input 
                id="create-nickname" 
                type="text" 
                required 
                placeholder="Ej. orbitante_26" 
                maxlength="25"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label for="create-grade" class="block text-xs font-bold text-slate-700 mb-1.5">
                Curso <span class="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input 
                id="create-grade" 
                type="text" 
                placeholder="Ej. 2º medio B" 
                maxlength="30"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              />
            </div>

            <button 
              id="btn-submit-pasaporte"
              type="submit" 
              class="w-full bg-[#132840] hover:bg-[#0a1827] active:scale-95 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all shadow-md mt-2 disabled:opacity-50"
            >
              <span id="btn-text">Crear mi pasaporte</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <!-- Solapa para recuperar código existente -->
          <div class="pt-2 border-t border-slate-100 text-center">
            <button id="btn-toggle-restore" class="text-xs text-cyan-700 hover:text-cyan-800 font-semibold underline">
              ¿Ya tienes un código? Ingrésalo aquí
            </button>
          </div>
        </div>

        <p class="text-center text-[11px] text-slate-400">
          Al continuar creas un pasaporte temporal para esta experiencia.
        </p>
      `;

      const form = container.querySelector("#form-crear-pasaporte");
      const btnSubmit = container.querySelector("#btn-submit-pasaporte");
      const btnText = container.querySelector("#btn-text");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nickname = container.querySelector("#create-nickname").value.trim();
        const grade = container.querySelector("#create-grade").value.trim();
        if (!nickname) return;

        btnSubmit.disabled = true;
        btnText.textContent = "Conectando con Supabase...";

        try {
          createdUser = await app.createSession(nickname, grade);
          isCreated = true;
          render();
        } catch (err) {
          console.error("Error al registrar:", err);
          btnSubmit.disabled = false;
          btnText.textContent = "Crear mi pasaporte";
          app.showToast("Error al conectar con la base de datos.");
        }
      });

      container.querySelector("#btn-toggle-restore").addEventListener("click", async () => {
        const code = prompt("Ingresa tu código de pasaporte (ej. FT26-2470):");
        if (code && code.trim()) {
          const ok = await app.restoreSession(code.trim());
          if (ok) {
            app.navigate("home1");
          }
        }
      });

    } else {
      // Pantalla de éxito: pasaporte-creado.png
      const u = createdUser || app.state.user || { nickname: "Visitante", passportCode: "FT26-2470" };

      container.innerHTML = `
        <div class="max-w-lg mx-auto py-8">
          <div class="relative bg-[#0f2742] text-white p-8 sm:p-10 rounded-3xl border border-slate-700/60 shadow-2xl text-center bg-grid-tech overflow-hidden">
            <!-- Ícono Verde de Check Centrado -->
            <div class="w-14 h-14 rounded-2xl bg-cyan-100 text-teal-700 flex items-center justify-center mx-auto mb-4 border border-cyan-200 shadow-md">
              <i data-lucide="check" class="w-7 h-7 stroke-[2.5]"></i>
            </div>

            <span class="text-[11px] font-mono uppercase tracking-widest text-cyan-300 font-semibold block mb-1">
              PASAPORTE CREADO
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">
              Listo, ${u.nickname}.
            </h2>
            <p class="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
              Tu recorrido ya tiene una identidad. Guarda este código si quieres volver a encontrarlo.
            </p>

            <!-- Código Copiable y Botón Entrar a home1 -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
              <button id="btn-copy-code" class="w-full sm:w-auto bg-[#163659] hover:bg-[#1a426e] border border-cyan-500/40 text-cyan-200 px-4 py-3 rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all">
                <span>${u.passportCode}</span>
                <i data-lucide="copy" class="w-4 h-4 text-cyan-400"></i>
              </button>

              <button id="btn-enter-home1" class="w-full sm:w-auto bg-[#13b8d4] hover:bg-[#0ea5be] active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
                <span>Entrar al recorrido</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelector("#btn-copy-code").addEventListener("click", () => {
        navigator.clipboard.writeText(u.passportCode);
        app.showToast("Código copiado al portapapeles");
      });

      container.querySelector("#btn-enter-home1").addEventListener("click", () => {
        app.navigate("home1");
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  render();
  return container;
}
