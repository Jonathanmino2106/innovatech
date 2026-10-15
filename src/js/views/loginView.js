/**
 * INNOVARTECH - Vista de Creación/Recuperación de Pasaporte (crea-pasaporte)
 * Pestañas formales: "Crear mi pasaporte" (nickname + perfil de visitante) y
 * "Ya tengo mi pasaporte" (recuperación por código slug-del-nickname-0001, sin contraseñas).
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
      // Pantalla con pestañas: crear-pasaporte.png / recuperar sesión
      container.innerHTML = `
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span class="font-mono uppercase font-bold text-[11px] text-cyan-600">INNOVARTECH 2026</span>
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
            Solo necesitamos un nickname y tu perfil. Así sabemos quién visita la feria.
          </p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">

          <!-- Pestañas: Crear / Recuperar -->
          <div class="p-1 bg-slate-100 rounded-xl flex">
            <button id="tab-create" class="flex-1 min-h-12 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
              <span>Crear mi pasaporte</span>
            </button>
            <button id="tab-restore" class="flex-1 min-h-12 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="key-round" class="w-3.5 h-3.5"></i>
              <span>Ya tengo mi pasaporte</span>
            </button>
          </div>

          <!-- Formulario: Crear pasaporte -->
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
                autocomplete="off"
                class="w-full min-h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label for="create-visitor-type" class="block text-xs font-bold text-slate-700 mb-1.5">
                Perfil de visitante <span class="text-cyan-600">*</span>
              </label>
              <select
                id="create-visitor-type"
                required
                class="w-full min-h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              >
                <option value="" disabled selected>Selecciona tu perfil</option>
                <option value="Alumno">Alumno</option>
                <option value="Profesor">Profesor</option>
                <option value="Familiar">Familiar</option>
                <option value="Visitante">Visitante</option>
              </select>
            </div>

            <button
              id="btn-submit-pasaporte"
              type="submit"
              class="w-full min-h-12 bg-[#132840] hover:bg-[#0a1827] active:scale-95 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all shadow-md mt-2 disabled:opacity-50"
            >
              <span id="btn-text">Crear mi pasaporte</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <!-- Formulario: Recuperar pasaporte por código -->
          <form id="form-restore-pasaporte" class="space-y-4 hidden">
            <div>
              <label for="restore-code" class="block text-xs font-bold text-slate-700 mb-1.5">
                Código de pasaporte
              </label>
              <input
                id="restore-code"
                type="text"
                required
                placeholder="tunombre-0001"
                maxlength="30"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                class="w-full min-h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-base font-bold text-slate-900 placeholder-slate-400 tracking-wider focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              />
              <p class="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                Ej. <span class="font-mono font-bold">tunombre-0001</span> (tu nickname en minúsculas + tu número de registro). Se acepta sin distinguir mayúsculas.
              </p>
            </div>

            <button
              id="btn-submit-restore"
              type="submit"
              class="w-full min-h-12 bg-[#13b8d4] hover:bg-[#0ea5be] active:scale-95 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all shadow-md disabled:opacity-50"
            >
              <span id="btn-restore-text">Recuperar mi recorrido</span>
              <i data-lucide="log-in" class="w-4 h-4"></i>
            </button>
          </form>
        </div>

        <p class="text-center text-[11px] text-slate-400">
          Sin contraseñas: tu código único es la clave de tu recorrido.
        </p>
      `;

      // ---- Pestañas ----
      const tabCreate = container.querySelector("#tab-create");
      const tabRestore = container.querySelector("#tab-restore");
      const formCreate = container.querySelector("#form-crear-pasaporte");
      const formRestore = container.querySelector("#form-restore-pasaporte");

      function activateTab(which) {
        const createActive = which === "create";
        tabCreate.className = createActive
          ? "flex-1 min-h-12 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all"
          : "flex-1 min-h-12 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all";
        tabRestore.className = createActive
          ? "flex-1 min-h-12 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all"
          : "flex-1 min-h-12 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all";
        formCreate.classList.toggle("hidden", !createActive);
        formRestore.classList.toggle("hidden", createActive);
        if (window.lucide) window.lucide.createIcons();
      }

      tabCreate.addEventListener("click", () => activateTab("create"));
      tabRestore.addEventListener("click", () => activateTab("restore"));

      // ---- Crear pasaporte ----
      const form = formCreate;
      const btnSubmit = container.querySelector("#btn-submit-pasaporte");
      const btnText = container.querySelector("#btn-text");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nickname = container.querySelector("#create-nickname").value.trim();
        const visitorType = container.querySelector("#create-visitor-type").value;
        if (!nickname || !visitorType) return;

        btnSubmit.disabled = true;
        btnText.textContent = "Conectando con Supabase...";

        try {
          createdUser = await app.createSession(nickname, visitorType);
          isCreated = true;
          render();
        } catch (err) {
          console.error("Error al registrar:", err);
          btnSubmit.disabled = false;
          btnText.textContent = "Crear mi pasaporte";
          app.showToast("Error al conectar con la base de datos.");
        }
      });

      // ---- Recuperar pasaporte por código ----
      const inputRestore = container.querySelector("#restore-code");
      const btnRestore = container.querySelector("#btn-submit-restore");
      const btnRestoreText = container.querySelector("#btn-restore-text");

      formRestore.addEventListener("submit", async (e) => {
        e.preventDefault();
        const code = inputRestore.value.trim();
        if (!code) return;

        btnRestore.disabled = true;
        btnRestoreText.textContent = "Buscando tu recorrido...";

        const ok = await app.restoreSession(code);

        if (ok) {
          app.navigate("home1");
        } else {
          btnRestore.disabled = false;
          btnRestoreText.textContent = "Recuperar mi recorrido";
          inputRestore.classList.add("animate-shake", "border-rose-500");
          app.showToast("Código no encontrado. Verifícalo e inténtalo de nuevo.");
          setTimeout(() => inputRestore.classList.remove("animate-shake"), 400);
        }
      });

    } else {
      // Pantalla de éxito: pasaporte-creado.png
      const u = createdUser || app.state.user || { nickname: "Visitante", passportCode: "tunombre-0001" };

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
              <button id="btn-copy-code" class="w-full sm:w-auto min-h-12 bg-[#163659] hover:bg-[#1a426e] border border-cyan-500/40 text-cyan-200 px-4 py-3 rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all">
                <span>${u.passportCode}</span>
                <i data-lucide="copy" class="w-4 h-4 text-cyan-400"></i>
              </button>

              <button id="btn-enter-home1" class="w-full sm:w-auto min-h-12 bg-[#13b8d4] hover:bg-[#0ea5be] active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
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
