/**
 * INNOVATECH - Vista de Escaneo QR y Plan B Código Manual
 * Basada fielmente en:
 * - vista-sello-qr.png (Visor de cámara animado, marco cian redondeado, botón usar código demostrativo)
 * - vista-sello-obtenido.png (Input STAND01, Validar y guardar sello, Caja verde de Sello Guardado)
 */

export function createQrView(app, targetStandId = null) {
  const container = document.createElement("div");
  container.className = "w-full max-w-lg mx-auto px-4 py-6 md:py-8 space-y-5 pb-24 md:pb-12";

  const stands = app.standsList;
  const currentStand = stands.find(s => s.id === targetStandId) || stands.find(s => !app.isStandCompleted(s.id)) || stands[0];

  container.innerHTML = `
    <!-- Botón Volver -->
    <button id="btn-back-station" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
      <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
      <span>Volver a la estación</span>
    </button>

    <!-- Encabezado (vista-sello-qr.png) -->
    <div class="text-center">
      <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
        VALIDACIÓN FÍSICA
      </span>
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
        Activa tu sello.
      </h2>
      <p class="text-xs text-slate-500 mt-1">
        Estás en <span class="font-bold text-slate-800">${currentStand.name}</span>. Usa la cámara o prueba el código demostrativo.
      </p>
    </div>

    <!-- Tarjeta Flotante Blanca -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
      
      <!-- Pestañas Selectoras Cámara / Código -->
      <div class="p-1 bg-slate-100 rounded-xl flex">
        <button id="tab-cam" class="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all">
          <i data-lucide="scan" class="w-3.5 h-3.5"></i>
          <span>Cámara</span>
        </button>
        <button id="tab-code" class="flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all">
          <i data-lucide="keyboard" class="w-3.5 h-3.5"></i>
          <span>Código</span>
        </button>
      </div>

      <!-- Panel Cámara (vista-sello-qr.png) -->
      <div id="panel-cam" class="space-y-4">
        <div class="relative w-full aspect-[4/3] bg-[#0f2742] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4">
          <!-- Rectángulo redondeado con borde cian y láser animado -->
          <div class="relative w-64 h-36 border-2 border-cyan-400 rounded-2xl flex items-center justify-center overflow-hidden">
            <div class="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-scan-sweep"></div>
          </div>
          <span class="text-[11px] text-slate-300 font-medium mt-3 block">Enfoca el código del stand</span>
        </div>

        <p class="text-center text-[11px] text-slate-400 leading-relaxed">
          La cámara real depende de permisos del dispositivo. Para esta demo puedes usar el código de abajo.
        </p>

        <button id="btn-use-demo" class="w-full bg-[#13b8d4] hover:bg-[#0ea5be] active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md">
          <span>Usar código demostrativo</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Panel Código / Plan B (vista-sello-obtenido.png) -->
      <div id="panel-code" class="space-y-4 hidden">
        <div>
          <label for="input-code-val" class="block text-xs font-bold text-slate-700 mb-1.5">
            Código del stand
          </label>
          <input 
            id="input-code-val" 
            type="text" 
            placeholder="${currentStand.code}" 
            maxlength="10"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-base font-bold uppercase text-slate-900 placeholder-slate-400 tracking-wider focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
          />
          <p class="text-[11px] text-slate-500 mt-1.5">
            Prueba con <button id="btn-quick-fill" class="text-cyan-700 font-bold underline">${currentStand.code}</button>.
          </p>
        </div>

        <button id="btn-submit-code" class="w-full bg-[#132840] hover:bg-[#0a1827] active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md">
          <span>Validar y guardar sello</span>
          <i data-lucide="check" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Caja Verde de Sello Guardado (vista-sello-obtenido.png) -->
      <div id="box-success" class="${app.isStandCompleted(currentStand.id) ? '' : 'hidden'} p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
        <div class="flex items-center gap-2 text-emerald-800 font-bold text-xs">
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
          <span>Sello guardado</span>
        </div>
        <p class="text-xs text-emerald-700 leading-snug">
          Sello activado en modo demostración. Puedes continuar tu ruta.
        </p>
        <button id="btn-goto-passport" class="w-full bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all">
          <span>Ver mi pasaporte</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>

    </div>
  `;

  // Asignar listeners
  container.querySelector("#btn-back-station").addEventListener("click", () => {
    app.navigate(currentStand.id);
  });

  const tabCam = container.querySelector("#tab-cam");
  const tabCode = container.querySelector("#tab-code");
  const panelCam = container.querySelector("#panel-cam");
  const panelCode = container.querySelector("#panel-code");
  const boxSuccess = container.querySelector("#box-success");
  const inputCode = container.querySelector("#input-code-val");

  tabCam.addEventListener("click", () => {
    tabCam.className = "flex-1 py-2 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all";
    tabCode.className = "flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all";
    panelCam.classList.remove("hidden");
    panelCode.classList.add("hidden");
  });

  tabCode.addEventListener("click", () => {
    tabCode.className = "flex-1 py-2 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all";
    tabCam.className = "flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all";
    panelCode.classList.remove("hidden");
    panelCam.classList.add("hidden");
  });

  function completeStamp(stand) {
    app.unlockStamp(stand.id);
    boxSuccess.classList.remove("hidden");
    app.showToast(`Sello obtenido: ${stand.name}`);
    if (window.lucide) window.lucide.createIcons();
  }

  container.querySelector("#btn-use-demo").addEventListener("click", () => {
    completeStamp(currentStand);
  });

  container.querySelector("#btn-quick-fill").addEventListener("click", () => {
    inputCode.value = currentStand.code;
  });

  function submitManual() {
    const val = inputCode.value.trim().toUpperCase();
    const found = stands.find(s => s.code.toUpperCase() === val);
    if (found) {
      completeStamp(found);
    } else {
      inputCode.classList.add("animate-shake", "border-rose-500");
      app.showToast("Código no válido. Prueba con " + currentStand.code);
      setTimeout(() => inputCode.classList.remove("animate-shake"), 400);
    }
  }

  container.querySelector("#btn-submit-code").addEventListener("click", submitManual);
  inputCode.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitManual();
    }
  });

  container.querySelector("#btn-goto-passport").addEventListener("click", () => {
    app.navigate("passport");
  });

  return container;
}
