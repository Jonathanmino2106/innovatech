/**
 * INNOVARTECH - Vista de Escaneo QR (cámara real) y Plan B Código Manual
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
  const codeLabel = isCromo ? "Código de la estampa" : "Código del stand";

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
        ${isCromo ? "Encontrá la estampa." : "Activa tu sello."}
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

      <!-- Panel Cámara (lector QR real) — SIEMPRE la primera opción -->
      <div id="panel-cam" class="space-y-3">
        <div class="relative">
          <div id="qr-reader" class="w-full min-h-[13rem] bg-[#0f2742] rounded-2xl overflow-hidden"></div>

          <!-- Estado: solicitando permiso de cámara -->
          <div id="cam-status" class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6 bg-[#0f2742] rounded-2xl">
            <i data-lucide="loader-2" class="w-6 h-6 text-cyan-300 animate-spin"></i>
            <p class="text-[11px] text-slate-300 leading-relaxed">Solicitando permiso de cámara…</p>
          </div>

          <!-- Estado: error de cámara (NO cambia de pestaña sola: el usuario decide) -->
          <div id="cam-error" class="hidden absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6 bg-[#0f2742] rounded-2xl">
            <i data-lucide="camera-off" class="w-6 h-6 text-rose-300"></i>
            <p id="cam-error-msg" class="text-[11px] text-slate-300 leading-relaxed">
              No se pudo acceder a la cámara.
            </p>
            <button id="btn-use-manual" class="min-h-11 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all">
              Usar código manual
            </button>
          </div>
        </div>

        <p id="cam-hint" class="text-center text-[11px] text-slate-400 leading-relaxed">
          Apuntá la cámara al QR ${isCromo ? "de la estampa escondida" : "institucional de la estación"}.
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
            placeholder="Ingresá el código"
            maxlength="10"
            autocapitalize="characters"
            autocomplete="off"
            class="w-full min-h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-base font-bold uppercase text-slate-900 placeholder-slate-400 tracking-wider focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
          />
        </div>

        <button id="btn-submit-code" class="w-full min-h-12 ${
          isCromo ? "bg-amber-500 hover:bg-amber-400" : "bg-[#132840] hover:bg-[#0a1827]"
        } active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md">
          <span>${isCromo ? "Registrar estampa encontrada" : "Validar y guardar sello"}</span>
          <i data-lucide="check" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Caja Verde de Sello Guardado + Valoración por Estrellas (modo sello) -->
      <div id="box-success" class="${!isCromo && app.isStandCompleted(currentStand.id) ? '' : 'hidden'} p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
        <div class="flex items-center gap-2 text-emerald-800 font-bold text-xs">
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
          <span>Sello guardado</span>
        </div>
        <p id="stamp-method" class="text-xs text-emerald-700 leading-snug">
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
          <span>¡Estampa encontrada!</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-[#0f2742] flex items-center justify-center shrink-0">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold block">${cromo ? cromo.code : ""}</span>
            <h4 class="text-sm font-extrabold text-slate-900 truncate">${cromo ? cromo.name : "Estampa secreta"}</h4>
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
  const camStatus = container.querySelector("#cam-status");
  const camError = container.querySelector("#cam-error");
  const camErrorMsg = container.querySelector("#cam-error-msg");
  const camHint = container.querySelector("#cam-hint");
  const stampMethod = container.querySelector("#stamp-method");

  // Estado visible del visor: 'loading' | 'ok' | 'error'
  // La pestaña NUNCA cambia sola: si la cámara falla, el usuario elige usar el código manual.
  function setCamStatus(state, msg) {
    if (camStatus) camStatus.classList.toggle("hidden", state !== "loading");
    if (camError) camError.classList.toggle("hidden", state !== "error");
    if (camHint) {
      camHint.classList.toggle("hidden", state !== "ok");
      if (state === "ok") {
        camHint.innerHTML = `Cámara <b class="text-emerald-500">activa</b> · apuntá al QR ${
          isCromo ? "de la estampa escondida" : "institucional de la estación"
        } y mantenlo dentro del recuadro.`;
      }
    }
    if (msg && camErrorMsg) camErrorMsg.textContent = msg;
    if (window.lucide) window.lucide.createIcons();
  }

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
    setCamStatus("loading");
    if (!window.Html5Qrcode) {
      scanner = null;
      setCamStatus("error", "El lector de QR no está disponible en este navegador. Usá el código manual.");
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
      setCamStatus("ok");
    } catch (err) {
      console.warn("No se pudo iniciar la cámara:", err);
      scanner = null;
      // La pestaña NO cambia sola: se muestra el motivo y el usuario elige.
      setCamStatus("error", "Sin acceso a la cámara. Revisá el permiso del navegador o usá el código manual.");
    }
  }

  // Cambio explícito a la pestaña manual (lo pide el usuario, nunca automático)
  container.querySelector("#btn-use-manual").addEventListener("click", () => {
    stopScanner();
    activateTab("code");
    inputCode.focus();
  });

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

  function showError(msg, fromCamera = false) {
    if (fromCamera) {
      // QR incorrecto escaneado con la cámara: no se toca la pestaña ni se congela el visor.
      // El escáner sigue activo para que el visitante reintente al instante.
      app.showToast(msg + " · seguí apuntando para reintentar");
      return;
    }
    stopScanner();
    inputCode.classList.add("animate-shake", "border-rose-500");
    app.showToast(msg);
    setTimeout(() => inputCode.classList.remove("animate-shake"), 400);
  }

  function handleCode(rawVal, metodo = "manual") {
    const val = String(rawVal || "").trim().toUpperCase();
    if (!val) return;
    const fromCamera = metodo === "qr";

    if (isCromo) {
      const foundCromo = standByCromoCode(val);
      if (foundCromo) {
        stopScanner();
        completeCromo(foundCromo, metodo);
        return;
      }
      if (standByCode(val)) {
        showError("Ese QR es de validación de stand, no de la estampa. Mirá la pista y buscá la pegatina.", fromCamera);
        return;
      }
      showError("Código de estampa no válido. Verificá la pista e intentá de nuevo.", fromCamera);
      return;
    }

    const foundStand = standByCode(val);
    if (foundStand) {
      stopScanner();
      completeStamp(foundStand, metodo);
      return;
    }
    if (standByCromoCode(val)) {
      showError('Parece un QR de estampa secreta. Volvé a la estación y usá "Buscar la estampa".', fromCamera);
      return;
    }
    showError("Código no válido. Verificá e intentá de nuevo.", fromCamera);
  }

  // ---- Lógica de sello y valoración ----
  function completeStamp(stand, metodo = "manual") {
    const already = app.isStandCompleted(stand.id);
    const prev = app.state.stamps[stand.id]?.metodoIngreso; // leer ANTES del unlock (lo muta)
    app.unlockStamp(stand.id, metodo);
    boxSuccess.classList.remove("hidden");

    const via = metodo === "qr" ? "cámara QR" : "código manual";
    const methodEl = container.querySelector("#stamp-method");
    if (methodEl) {
      if (!already) {
        methodEl.textContent = `Sello registrado por ${via}. Puedes continuar tu ruta.`;
      } else if (metodo === "qr" && prev === "qr") {
        methodEl.textContent = "Ya estaba sellado por cámara QR. Puedes continuar tu ruta.";
      } else if (metodo === "qr" && prev === "manual") {
        methodEl.textContent = "Método de registro actualizado: ahora figura por cámara QR.";
      } else {
        methodEl.textContent = `Ya estaba sellado por ${via}. Puedes continuar tu ruta.`;
      }
    }
    app.showToast(`Sello obtenido: ${stand.name} · ${via}`);
    if (window.lucide) window.lucide.createIcons();
  }

  // ---- Lógica del cromo secreto (misión secreta) ----
  function completeCromo(stand, metodo = "manual") {
    const already = app.isChromeFound(stand.id);
    app.unlockChrome(stand.id, metodo);
    boxCromo.classList.remove("hidden");
    const via = metodo === "qr" ? "cámara QR" : "código manual";
    app.showToast(already
      ? `Estampa ya registrada · método: ${via}`
      : `¡Estampa encontrada: ${stand.cromo.name}! · por ${via}`);
    if (window.lucide) window.lucide.createIcons();
  }

  tabCam.addEventListener("click", () => activateTab("cam"));
  tabCode.addEventListener("click", () => activateTab("code"));

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

  // Arranque: la cámara SIEMPRE es la primera opción (nunca cae sola a "Código")
  setCamStatus("loading");

  // Si el sello/cromo ya existía, dejar claro de qué método quedó registrado
  if (!isCromo && app.isStandCompleted(currentStand.id)) {
    const prev = app.state.stamps[currentStand.id]?.metodoIngreso;
    const methodEl = container.querySelector("#stamp-method");
    if (methodEl) {
      methodEl.textContent = prev === "qr"
        ? "Sellado por cámara QR. Puedes continuar tu ruta."
        : "Sellado por código manual. Puedes continuar tu ruta.";
    }
  }

  if (window.Html5Qrcode) startScanner();
  else setCamStatus("error", "El lector de QR no está disponible en este navegador. Usá el código manual.");

  return container;
}
