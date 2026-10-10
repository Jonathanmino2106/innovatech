/**
 * INNOVATECH - Vista de Escaneo QR (cámara real) y Plan B Código Manual
 * - Cámara: decodificador QR real con html5-qrcode (facingMode trasera).
 * - Plan B: pestaña con input alfanumérico para fallas de cámara/permisos/luz.
 * - Dos modos:
 *     mode 'sello' → valida el QR del stand (STAND01..05) y sella el pasaporte.
 *     mode 'cromo' → valida el QR del cromo secreto (CROMO01..05) de la misión secreta.
 * - Tras sellar: valoración por estrellas (1-5) persistida en Supabase.
 */

export function createQrView(app, targetStandId = null, mode = "sello") {
  const container = document.createElement("div");
  container.className = "w-full max-w-lg mx-auto px-4 py-6 md:py-8 space-y-5 pb-24 md:pb-12";

  const stands = app.standsList;
  const isCromo = mode === "cromo";

  const currentStand = stands.find(s => s.id === targetStandId) || stands.find(s => !app.isStandCompleted(s.id)) || stands[0];
  const cromo = currentStand.cromo || null;

  // Códigos según modo: cromo secreto o validación de stand
  const targetCode = isCromo && cromo ? cromo.code : currentStand.code;
  const codeLabel = isCromo ? "Código del cromo" : "Código del stand";

  container.innerHTML = `
    <!-- Botón Volver -->
    <button id="btn-back-station" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
      <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
      <span>Volver a la estación</span>
    </button>

    <!-- Encabezado (vista-sello-qr.png) -->
    <div class="text-center">
      <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
        ${isCromo ? "MISIÓN SECRETA" : "VALIDACIÓN FÍSICA"}
      </span>
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">
        ${isCromo ? "Encontrá el cromo." : "Activa tu sello."}
      </h2>
      <p class="text-xs text-slate-500 mt-1">
        Estás en <span class="font-bold text-slate-800">${currentStand.name}</span>. Escanea el QR ${
          isCromo ? "de la pegatina escondida" : "institucional de la estación"
        } o usa el código manual.
      </p>
    </div>

    <!-- Tarjeta Flotante Blanca -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">

      <!-- Pestañas Selectoras Cámara / Código -->
      <div class="p-1 bg-slate-100 rounded-xl flex">
        <button id="tab-cam" class="flex-1 min-h-12 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all">
          <i data-lucide="scan" class="w-3.5 h-3.5"></i>
          <span>Cámara</span>
        </button>
        <button id="tab-code" class="flex-1 min-h-12 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all">
          <i data-lucide="keyboard" class="w-3.5 h-3.5"></i>
          <span>Código</span>
        </button>
      </div>

      <!-- Panel Cámara (lector QR real) -->
      <div id="panel-cam" class="space-y-3">
        <div id="qr-reader" class="w-full min-h-[13rem] bg-[#0f2742] rounded-2xl overflow-hidden"></div>

        <p class="text-center text-[11px] text-slate-400 leading-relaxed">
          Apunta la cámara al QR ${isCromo ? "del cromo escondido" : "institucional de la estación"}. Si falla la cámara o los permisos, usa la pestaña <b>Código</b>.
        </p>
      </div>

      <!-- Panel Código / Plan B (vista-sello-obtenido.png) -->
      <div id="panel-code" class="space-y-4 hidden">
        <div>
          <label for="input-code-val" class="block text-xs font-bold text-slate-700 mb-1.5">
            ${codeLabel}
          </label>
          <input
            id="input-code-val"
            type="text"
            placeholder="${targetCode}"
            maxlength="10"
            autocapitalize="characters"
            autocomplete="off"
            class="w-full min-h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-base font-bold uppercase text-slate-900 placeholder-slate-400 tracking-wider focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
          />
          <p class="text-[11px] text-slate-500 mt-1.5">
            Prueba con <button id="btn-quick-fill" class="text-cyan-700 font-bold underline">${targetCode}</button>.
          </p>
        </div>

        <button id="btn-submit-code" class="w-full min-h-12 ${
          isCromo ? "bg-amber-500 hover:bg-amber-400" : "bg-[#132840] hover:bg-[#0a1827]"
        } active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md">
          <span>${isCromo ? "Registrar cromo encontrado" : "Validar y guardar sello"}</span>
          <i data-lucide="check" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Caja Verde de Sello Guardado + Valoración por Estrellas (modo sello) -->
      <div id="box-success" class="${!isCromo && app.isStandCompleted(currentStand.id) ? '' : 'hidden'} p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
        <div class="flex items-center gap-2 text-emerald-800 font-bold text-xs">
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
          <span>Sello guardado</span>
        </div>
        <p class="text-xs text-emerald-700 leading-snug">
          Sello activado. Puedes continuar tu ruta.
        </p>

        <!-- Valoración por estrellas (1-5) -->
        <div class="pt-2 border-t border-emerald-200">
          <p class="text-[11px] font-bold text-emerald-800 mb-2">¿Cómo fue tu experiencia en esta estación?</p>
          <div id="rate-stars" class="flex items-center gap-1.5">
            ${[1, 2, 3, 4, 5].map(n => `
              <button data-stars="${n}" class="star-btn w-11 h-12 rounded-xl flex items-center justify-center text-lg transition-all border bg-white border-emerald-200 text-amber-400 hover:bg-amber-50">★</button>
            `).join("")}
          </div>
        </div>

        <button id="btn-goto-passport" class="w-full min-h-12 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all">
          <span>Ver mi pasaporte</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>

      <!-- Caja Dorada de Cromo Encontrado (modo cromo) -->
      <div id="box-cromo" class="${isCromo && app.isChromeFound(currentStand.id) ? '' : 'hidden'} p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
        <div class="flex items-center gap-2 text-amber-900 font-bold text-xs">
          <i data-lucide="gem" class="w-4 h-4 text-amber-600"></i>
          <span>¡Cromo encontrado!</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-[#0f2742] flex items-center justify-center shrink-0">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold block">${cromo ? cromo.code : ""}</span>
            <h4 class="text-sm font-extrabold text-slate-900 truncate">${cromo ? cromo.name : "Cromo secreto"}</h4>
            ${cromo ? `<span class="text-[10px] text-amber-800">Rareza ${cromo.rarity}</span>` : ""}
          </div>
        </div>

        <button id="btn-goto-collection" class="w-full min-h-12 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all">
          <span>Ver mi colección</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>

    </div>
  `;

  // ---- Referencias y pestañas ----
  const tabCam = container.querySelector("#tab-cam");
  const tabCode = container.querySelector("#tab-code");
  const panelCam = container.querySelector("#panel-cam");
  const panelCode = container.querySelector("#panel-code");
  const boxSuccess = container.querySelector("#box-success");
  const boxCromo = container.querySelector("#box-cromo");
  const inputCode = container.querySelector("#input-code-val");

  function activateTab(which) {
    const camActive = which === "cam";
    tabCam.className = camActive
      ? "flex-1 min-h-12 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all"
      : "flex-1 min-h-12 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all";
    tabCode.className = camActive
      ? "flex-1 min-h-12 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all"
      : "flex-1 min-h-12 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all";
    panelCam.classList.toggle("hidden", !camActive);
    panelCode.classList.toggle("hidden", camActive);
    if (camActive) startScanner(); else stopScanner();
    if (window.lucide) window.lucide.createIcons();
  }

  // ---- Escáner QR real (html5-qrcode) ----
  let scanner = null;

  async function startScanner() {
    if (scanner) return;
    if (!window.Html5Qrcode) {
      activateTab("code");
      app.showToast("Cámara no disponible. Usa el código manual (Plan B).");
      return;
    }
    try {
      scanner = new window.Html5Qrcode("qr-reader", { verbose: false });
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => onScanSuccess(decodedText),
        () => {} // errores de parseo por frame: se ignoran
      );
    } catch (err) {
      console.warn("No se pudo iniciar la cámara:", err);
      scanner = null;
      activateTab("code");
      app.showToast("Sin acceso a la cámara. Ingresa el código manual.");
    }
  }

  async function stopScanner() {
    if (!scanner) return;
    try { await scanner.stop(); scanner.clear(); } catch (_) { /* ya detenida */ }
    scanner = null;
  }

  function onScanSuccess(text) {
    handleCode(String(text).trim().toUpperCase(), "qr");
  }

  // Limpieza al navegar fuera de la vista (evita que la cámara siga activa)
  app.viewCleanup = () => { stopScanner(); };

  // ---- Validación de código según modo (cámara o manual) ----
  const standByCode = (val) => stands.find(s => s.code.toUpperCase() === val);
  const standByCromoCode = (val) => stands.find(s => s.cromo && s.cromo.code.toUpperCase() === val);

  function showError(msg) {
    stopScanner();
    inputCode.classList.add("animate-shake", "border-rose-500");
    app.showToast(msg);
    setTimeout(() => inputCode.classList.remove("animate-shake"), 400);
  }

  function handleCode(rawVal, metodo = "manual") {
    const val = String(rawVal || "").trim().toUpperCase();
    if (!val) return;

    if (isCromo) {
      const foundCromo = standByCromoCode(val);
      if (foundCromo) {
        stopScanner();
        completeCromo(foundCromo, metodo);
        return;
      }
      if (standByCode(val)) {
        showError("Ese QR es de validación de stand, no del cromo. Mirá la pista y buscá la pegatina.");
        return;
      }
      showError(`Código de cromo no válido. Prueba con ${targetCode}`);
      return;
    }

    const foundStand = standByCode(val);
    if (foundStand) {
      stopScanner();
      completeStamp(foundStand, metodo);
      return;
    }
    if (standByCromoCode(val)) {
      showError('Parece un QR de cromo secreto. Volvé a la estación y usá "Buscar el cromo".');
      return;
    }
    showError("Código no válido. Prueba con " + targetCode);
  }

  // ---- Lógica de sello y valoración ----
  function completeStamp(stand, metodo = "manual") {
    app.unlockStamp(stand.id, metodo);
    boxSuccess.classList.remove("hidden");
    app.showToast(`Sello obtenido: ${stand.name}`);
    if (window.lucide) window.lucide.createIcons();
  }

  // ---- Lógica del cromo secreto (misión secreta) ----
  function completeCromo(stand, metodo = "manual") {
    app.unlockChrome(stand.id, metodo);
    boxCromo.classList.remove("hidden");
    app.showToast(`¡Cromo encontrado: ${stand.cromo.name}!`);
    if (window.lucide) window.lucide.createIcons();
  }

  tabCam.addEventListener("click", () => activateTab("cam"));
  tabCode.addEventListener("click", () => activateTab("code"));

  container.querySelector("#btn-quick-fill").addEventListener("click", () => {
    inputCode.value = targetCode;
  });

  function submitManual() {
    handleCode(inputCode.value, "manual");
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

  const btnGotoCollection = container.querySelector("#btn-goto-collection");
  if (btnGotoCollection) {
    btnGotoCollection.addEventListener("click", () => {
      app.navigate("passport");
    });
  }

  container.querySelector("#btn-back-station").addEventListener("click", () => {
    app.navigate(currentStand.id);
  });

  // Valoración por estrellas (1-5) → persiste en visitas_estaciones.valoracion
  const starBtns = container.querySelectorAll("#rate-stars .star-btn");

  function paintStars(n) {
    starBtns.forEach((b) => {
      const val = parseInt(b.getAttribute("data-stars"), 10);
      b.className = val <= n
        ? "star-btn w-11 h-12 rounded-xl flex items-center justify-center text-lg transition-all border bg-amber-400 border-amber-500 text-white shadow-sm"
        : "star-btn w-11 h-12 rounded-xl flex items-center justify-center text-lg transition-all border bg-white border-emerald-200 text-amber-400 hover:bg-amber-50";
    });
  }

  starBtns.forEach((b) => {
    b.addEventListener("click", async () => {
      const n = parseInt(b.getAttribute("data-stars"), 10);
      await app.rateStamp(currentStand.id, n);
      paintStars(n);
    });
  });

  // Restaurar valoración previa si existe
  const prevRating = app.state.stamps[currentStand.id]?.valoracion;
  if (prevRating) paintStars(prevRating);

  // Arranque: solicitar cámara al abrir la vista
  if (window.Html5Qrcode) startScanner();

  return container;
}
