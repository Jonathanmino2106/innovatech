/**
 * INNOVATECH - PASAPORTE.26
 * Controlador SPA interactivo ajustado a las vistas oficiales
 */

import { STANDS_DATA, RANKS, ACHIEVEMENTS } from './data.js';
import { State } from './state.js';

class PasaporteApp {
  constructor() {
    this.currentView = "view-landing";
    this.selectedStandId = "stand-01";
    this.init();
  }

  init() {
    State.init();
    this.cacheDom();
    this.bindEvents();

    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Si ya existe sesión, entrar directo a vista Home, sino mostrar landing
    if (State.user) {
      this.showView("view-home");
      this.updateAllUI();
    } else {
      this.showView("view-landing");
    }
  }

  cacheDom() {
    // Vistas
    this.views = {
      landing: document.getElementById("view-landing"),
      create: document.getElementById("view-create"),
      createdSuccess: document.getElementById("view-created-success"),
      home: document.getElementById("view-home"),
      map: document.getElementById("view-map"),
      station: document.getElementById("view-station"),
      scan: document.getElementById("view-scan"),
      passport: document.getElementById("view-passport"),
      ranks: document.getElementById("view-ranks")
    };

    // Header & Navegación
    this.headerAvatar = document.getElementById("header-avatar");
    this.headerInitial = document.getElementById("header-initial");
    this.headerNicknameDisplay = document.getElementById("header-nickname-display");
    this.headerLogoBtn = document.getElementById("header-logo-btn");
    this.headerNavButtons = document.querySelectorAll(".nav-item-btn");
    this.mobileNavButtons = document.querySelectorAll(".mobile-nav-btn");
    this.btnHeaderValidate = document.getElementById("btn-header-validate");

    // Landing
    this.btnHeroCreate = document.getElementById("btn-hero-create");
    this.btnHeroMap = document.getElementById("btn-hero-map");
    this.btnHeroRestore = document.getElementById("btn-hero-restore");

    // Crear Pasaporte
    this.btnBackToLanding = document.getElementById("btn-back-to-landing");
    this.formCreatePassport = document.getElementById("form-create-passport");
    this.inputNickname = document.getElementById("create-nickname");
    this.inputGrade = document.getElementById("create-grade");

    // Éxito Creado
    this.createdGreetingName = document.getElementById("created-greeting-name");
    this.createdPassportCode = document.getElementById("created-passport-code");
    this.btnCopyCode = document.getElementById("btn-copy-code");
    this.btnEnterJourney = document.getElementById("btn-enter-journey");

    // Home / Panel Recorrido
    this.homeTitleGreeting = document.getElementById("home-title-greeting");
    this.homeRankPill = document.getElementById("home-rank-pill");
    this.homeRankPillText = document.getElementById("home-rank-pill-text");
    this.homeProgressValue = document.getElementById("home-progress-value");
    this.homeProgressBarFill = document.getElementById("home-progress-bar-fill");
    this.homeStampsActive = document.getElementById("home-stamps-active");
    this.homeStampsPending = document.getElementById("home-stamps-pending");
    this.nextStationName = document.getElementById("next-station-name");
    this.nextStationRoom = document.getElementById("next-station-room");
    this.btnOpenNextStation = document.getElementById("btn-open-next-station");
    this.btnSeePending = document.getElementById("btn-see-pending");
    this.cardActionMap = document.getElementById("card-action-map");
    this.cardActionPassport = document.getElementById("card-action-passport");
    this.cardActionQr = document.getElementById("card-action-qr");

    // Mapa
    this.mapPinsLayer = document.getElementById("map-pins-layer");
    this.mapCardBadge = document.getElementById("map-card-badge");
    this.mapCardTitle = document.getElementById("map-card-title");
    this.mapCardCategory = document.getElementById("map-card-category");
    this.mapCardDesc = document.getElementById("map-card-desc");
    this.mapCardLocation = document.getElementById("map-card-location");
    this.btnMapCardAction = document.getElementById("btn-map-card-action");

    // Estación Detalle
    this.btnBackToMap = document.getElementById("btn-back-to-map");
    this.stationDetailBadge = document.getElementById("station-detail-badge");
    this.stationDetailTitle = document.getElementById("station-detail-title");
    this.stationDetailDesc = document.getElementById("station-detail-desc");
    this.stationDetailLocation = document.getElementById("station-detail-location");
    this.stationChallengeName = document.getElementById("station-challenge-name");
    this.stationChallengePoints = document.getElementById("station-challenge-points");
    this.btnOpenTriviaModal = document.getElementById("btn-open-trivia-modal");
    this.btnStationScanAction = document.getElementById("btn-station-scan-action");
    this.stationScanBtnText = document.getElementById("station-scan-btn-text");

    // Escanear / Validar QR
    this.btnBackFromScan = document.getElementById("btn-back-from-scan");
    this.scanTargetName = document.getElementById("scan-target-name");
    this.tabScanCam = document.getElementById("tab-scan-cam");
    this.tabScanCode = document.getElementById("tab-scan-code");
    this.panelCamView = document.getElementById("panel-cam-view");
    this.panelCodeView = document.getElementById("panel-code-view");
    this.btnUseDemoCode = document.getElementById("btn-use-demo-code");
    this.manualStandInput = document.getElementById("manual-stand-input");
    this.btnFillSuggested = document.getElementById("btn-fill-suggested");
    this.btnSubmitManualCode = document.getElementById("btn-submit-manual-code");
    this.boxStampSuccess = document.getElementById("box-stamp-success");
    this.btnGotoPassportAfterStamp = document.getElementById("btn-goto-passport-after-stamp");

    // Pasaporte
    this.passportCounterPill = document.getElementById("passport-counter-pill");
    this.passportRankTitle = document.getElementById("passport-rank-title");
    this.passportActiveStampsText = document.getElementById("passport-active-stamps-text");
    this.passportChallengesCount = document.getElementById("passport-challenges-count");
    this.passportProgressBarSmall = document.getElementById("passport-progress-bar-small");
    this.passportPercentText = document.getElementById("passport-percent-text");
    this.passportMissingText = document.getElementById("passport-missing-text");
    this.stampsGridContainer = document.getElementById("stamps-grid-container");

    // Rangos y Logros
    this.ranksListContainer = document.getElementById("ranks-list-container");
    this.achievementsContainer = document.getElementById("achievements-container");

    // Modal Trivia
    this.modalTrivia = document.getElementById("modal-trivia");
    this.modalTriviaTitle = document.getElementById("modal-trivia-title");
    this.modalTriviaQuestion = document.getElementById("modal-trivia-question");
    this.modalTriviaOptions = document.getElementById("modal-trivia-options");
    this.modalTriviaFeedback = document.getElementById("modal-trivia-feedback");
    this.modalTriviaClose = document.getElementById("modal-trivia-close");

    // Toast flotante
    this.floatingToast = document.getElementById("floating-toast");
    this.floatingToastMsg = document.getElementById("floating-toast-msg");
  }

  bindEvents() {
    // Logo Click
    this.headerLogoBtn.addEventListener("click", () => {
      this.showView(State.user ? "view-home" : "view-landing");
    });

    // Navegación Desktop
    this.headerNavButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-nav");
        if (target) this.showView(target);
      });
    });

    // Navegación Mobile Bottom Bar
    this.mobileNavButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-nav");
        if (target) this.showView(target);
      });
    });

    // Botón superior "Validar visita"
    this.btnHeaderValidate.addEventListener("click", () => {
      const targetStand = STANDS_DATA.find(s => !State.isStandCompleted(s.id)) || STANDS_DATA[0];
      this.openScanView(targetStand.id);
    });

    // Eventos Landing
    this.btnHeroCreate.addEventListener("click", () => this.showView("view-create"));
    this.btnHeroMap.addEventListener("click", () => this.showView("view-map"));
    this.btnHeroRestore.addEventListener("click", () => {
      const code = prompt("Ingresa tu código de pasaporte (ej: FT26-2470):");
      if (code && code.trim()) {
        State.restorePassport(code.trim());
        this.showView("view-home");
        this.updateAllUI();
        this.triggerToast(`Sesión reanudada con pasaporte ${State.user.passportCode}`);
      }
    });

    // Crear Pasaporte
    this.btnBackToLanding.addEventListener("click", () => this.showView("view-landing"));
    this.formCreatePassport.addEventListener("submit", (e) => {
      e.preventDefault();
      const nickname = this.inputNickname.value.trim();
      const grade = this.inputGrade.value.trim();
      if (!nickname) return;

      const user = State.createPassport(nickname, grade);
      this.createdGreetingName.textContent = `Listo, ${user.nickname}.`;
      this.createdPassportCode.textContent = user.passportCode;
      this.showView("view-created-success");
      this.updateAllUI();
    });

    // Copiar código pasaporte
    this.btnCopyCode.addEventListener("click", () => {
      if (State.user) {
        navigator.clipboard.writeText(State.user.passportCode);
        this.triggerToast("Código copiado al portapapeles");
      }
    });

    // Entrar al recorrido
    this.btnEnterJourney.addEventListener("click", () => {
      this.showView("view-home");
    });

    // Acciones Home Tablero
    this.btnOpenNextStation.addEventListener("click", () => {
      const pendingStand = STANDS_DATA.find(s => !State.isStandCompleted(s.id)) || STANDS_DATA[0];
      this.openStationView(pendingStand.id);
    });
    this.btnSeePending.addEventListener("click", () => this.showView("view-passport"));
    this.cardActionMap.addEventListener("click", () => this.showView("view-map"));
    this.cardActionPassport.addEventListener("click", () => this.showView("view-passport"));
    this.cardActionQr.addEventListener("click", () => {
      const pending = STANDS_DATA.find(s => !State.isStandCompleted(s.id)) || STANDS_DATA[0];
      this.openScanView(pending.id);
    });

    // Mapa: Ver estación seleccionada
    this.btnMapCardAction.addEventListener("click", () => {
      this.openStationView(this.selectedStandId);
    });

    // Estación Detalle
    this.btnBackToMap.addEventListener("click", () => this.showView("view-map"));
    this.btnOpenTriviaModal.addEventListener("click", () => this.openTriviaModal(this.selectedStandId));
    this.btnStationScanAction.addEventListener("click", () => this.openScanView(this.selectedStandId));

    // Escáner QR Pestañas
    this.btnBackFromScan.addEventListener("click", () => this.openStationView(this.selectedStandId));
    this.tabScanCam.addEventListener("click", () => {
      this.tabScanCam.className = "flex-1 py-2 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all";
      this.tabScanCode.className = "flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all";
      this.panelCamView.classList.remove("hidden");
      this.panelCodeView.classList.add("hidden");
    });

    this.tabScanCode.addEventListener("click", () => {
      this.tabScanCode.className = "flex-1 py-2 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all";
      this.tabScanCam.className = "flex-1 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all";
      this.panelCodeView.classList.remove("hidden");
      this.panelCamView.classList.add("hidden");
    });

    // Simular código demostrativo
    this.btnUseDemoCode.addEventListener("click", () => {
      const stand = STANDS_DATA.find(s => s.id === this.selectedStandId) || STANDS_DATA[0];
      this.validateStampSuccess(stand);
    });

    this.btnFillSuggested.addEventListener("click", () => {
      const stand = STANDS_DATA.find(s => s.id === this.selectedStandId) || STANDS_DATA[0];
      this.manualStandInput.value = stand.code;
    });

    this.btnSubmitManualCode.addEventListener("click", () => this.handleManualValidation());
    this.manualStandInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleManualValidation();
      }
    });

    this.btnGotoPassportAfterStamp.addEventListener("click", () => {
      this.showView("view-passport");
    });

    // Modal Trivia Cierre
    this.modalTriviaClose.addEventListener("click", () => {
      this.modalTrivia.classList.add("hidden");
    });
  }

  showView(viewId) {
    this.currentView = viewId;

    // Ocultar todas
    Object.values(this.views).forEach(v => {
      if (v) v.classList.add("hidden");
    });

    // Mostrar elegida
    const target = document.getElementById(viewId);
    if (target) target.classList.remove("hidden");

    // Header avatar & login check
    if (State.user) {
      this.headerAvatar.classList.remove("hidden");
      this.headerInitial.textContent = (State.user.nickname[0] || 'V').toUpperCase();
      this.headerNicknameDisplay.classList.remove("hidden");
      this.headerNicknameDisplay.textContent = State.user.nickname;
    } else {
      this.headerAvatar.classList.add("hidden");
      this.headerNicknameDisplay.classList.add("hidden");
    }

    // Actualizar estados activos de los botones de navegación
    const navName = viewId;
    this.headerNavButtons.forEach(btn => {
      const bNav = btn.getAttribute("data-nav");
      if (bNav === navName) {
        btn.className = "nav-item-btn px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-cyan-700 bg-cyan-50 transition-all";
      } else {
        btn.className = "nav-item-btn px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all";
      }
    });

    this.mobileNavButtons.forEach(btn => {
      const bNav = btn.getAttribute("data-nav");
      if (bNav === navName) {
        btn.className = "mobile-nav-btn active flex flex-col items-center justify-center w-14 text-cyan-600 font-bold transition-all";
      } else {
        btn.className = "mobile-nav-btn flex flex-col items-center justify-center w-14 text-slate-400 hover:text-slate-700 transition-all";
      }
    });

    // Renderizados por vista
    if (viewId === "view-home") this.renderHome();
    if (viewId === "view-map") this.renderMap();
    if (viewId === "view-passport") this.renderPassport();
    if (viewId === "view-ranks") this.renderRanks();

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateAllUI() {
    this.renderHome();
    this.renderMap();
    this.renderPassport();
    this.renderRanks();
  }

  renderHome() {
    if (!State.user) return;

    this.homeTitleGreeting.textContent = `Hola, ${State.user.nickname}.`;

    const completed = State.getCompletedCount();
    const total = STANDS_DATA.length;
    const percent = Math.round((completed / total) * 100);

    this.homeProgressValue.textContent = percent;
    this.homeProgressBarFill.style.width = `${percent}%`;
    this.homeStampsActive.textContent = `${completed} de ${total} sellos activos`;
    this.homeStampsPending.textContent = `${total - completed} pendientes`;

    // Rango actual
    const currentRank = RANKS.slice().reverse().find(r => completed >= r.minStamps) || RANKS[0];
    this.homeRankPillText.textContent = currentRank.title;

    // Siguiente estación recomendada
    const nextPending = STANDS_DATA.find(s => !State.isStandCompleted(s.id)) || STANDS_DATA[0];
    this.nextStationName.textContent = nextPending.name;
    this.nextStationRoom.textContent = nextPending.location.split('/').pop().trim();
  }

  renderMap() {
    // Dibujar pines en el mapa esquemático
    this.mapPinsLayer.innerHTML = STANDS_DATA.map(stand => {
      const isDone = State.isStandCompleted(stand.id);
      const isSelected = stand.id === this.selectedStandId;

      return `
        <button 
          data-stand-id="${stand.id}" 
          style="left: ${stand.mapCoords.x}%; top: ${stand.mapCoords.y}%;"
          class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none transition-transform active:scale-125"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs transition-all ${
            isDone 
              ? 'bg-emerald-500 text-white ring-2 ring-emerald-300' 
              : isSelected
                ? 'bg-[#132840] text-cyan-300 ring-2 ring-cyan-400 animate-pin-bounce'
                : 'bg-[#132840] text-white hover:ring-2 hover:ring-slate-400'
          }">
            ${stand.num}
          </div>
        </button>
      `;
    }).join("");

    // Listeners a los pines
    this.mapPinsLayer.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-stand-id");
        this.selectStandInMap(id);
      });
    });

    this.selectStandInMap(this.selectedStandId);
    if (window.lucide) window.lucide.createIcons();
  }

  selectStandInMap(standId) {
    this.selectedStandId = standId;
    const stand = STANDS_DATA.find(s => s.id === standId) || STANDS_DATA[0];
    const isDone = State.isStandCompleted(stand.id);

    this.mapCardBadge.textContent = `STAND ${stand.num}`;
    this.mapCardTitle.textContent = stand.name;
    this.mapCardCategory.textContent = stand.category;
    this.mapCardDesc.textContent = stand.description;
    this.mapCardLocation.textContent = stand.location;

    // Resaltar pin
    this.mapPinsLayer.querySelectorAll("button").forEach(btn => {
      const id = btn.getAttribute("data-stand-id");
      const pinDiv = btn.querySelector("div");
      const done = State.isStandCompleted(id);
      if (id === standId) {
        pinDiv.className = done
          ? "w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs bg-emerald-500 text-white ring-4 ring-emerald-300 scale-110"
          : "w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs bg-[#132840] text-cyan-300 ring-4 ring-cyan-400 scale-110 animate-pin-bounce";
      } else {
        pinDiv.className = done
          ? "w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs bg-emerald-500 text-white"
          : "w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs bg-[#132840] text-white";
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  openStationView(standId) {
    this.selectedStandId = standId;
    const stand = STANDS_DATA.find(s => s.id === standId) || STANDS_DATA[0];
    const isDone = State.isStandCompleted(stand.id);

    this.stationDetailBadge.textContent = stand.badgeLabel;
    this.stationDetailTitle.textContent = stand.name;
    this.stationDetailDesc.textContent = stand.description;
    this.stationDetailLocation.textContent = stand.location.split('/').pop().trim();

    this.stationChallengeName.textContent = stand.trivia.challengeTitle;
    this.stationChallengePoints.textContent = stand.trivia.points;

    if (isDone) {
      this.stationScanBtnText.textContent = "Sello obtenido · ver QR";
      this.btnStationScanAction.className = "w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md";
    } else {
      this.stationScanBtnText.textContent = "Validar presencia · ver QR";
      this.btnStationScanAction.className = "w-full bg-[#13b8d4] hover:bg-[#0ea5be] active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md";
    }

    this.showView("view-station");
  }

  openTriviaModal(standId) {
    const stand = STANDS_DATA.find(s => s.id === standId) || STANDS_DATA[0];
    this.modalTriviaTitle.textContent = stand.name;
    this.modalTriviaQuestion.textContent = stand.trivia.question;
    this.modalTriviaFeedback.classList.add("hidden");

    this.modalTriviaOptions.innerHTML = stand.trivia.options.map((opt, idx) => {
      return `
        <button 
          data-opt-idx="${idx}" 
          class="trivia-choice-btn w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-cyan-500 bg-slate-50 text-xs font-medium text-slate-800 transition-all flex items-center justify-between"
        >
          <span>${opt}</span>
          <i data-lucide="circle" class="w-4 h-4 text-slate-400"></i>
        </button>
      `;
    }).join("");

    this.modalTriviaOptions.querySelectorAll(".trivia-choice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const selected = parseInt(btn.getAttribute("data-opt-idx"), 10);
        this.evaluateTriviaModal(stand, selected, btn);
      });
    });

    this.modalTrivia.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
  }

  evaluateTriviaModal(stand, selectedIdx, clickedBtn) {
    const isCorrect = selectedIdx === stand.trivia.correctIndex;
    const allBtns = this.modalTriviaOptions.querySelectorAll(".trivia-choice-btn");

    if (isCorrect) {
      allBtns.forEach((b, idx) => {
        b.classList.add("pointer-events-none");
        if (idx === stand.trivia.correctIndex) {
          b.className = "w-full text-left p-3.5 rounded-xl border border-emerald-500 bg-emerald-50 text-xs font-semibold text-emerald-900 transition-all flex items-center justify-between";
          b.innerHTML = `<span>${stand.trivia.options[idx]}</span><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>`;
        }
      });

      this.modalTriviaFeedback.className = "p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 space-y-1";
      this.modalTriviaFeedback.innerHTML = `
        <p class="font-bold flex items-center gap-1.5 text-emerald-800">
          <i data-lucide="check" class="w-4 h-4"></i> ¡Correcto! Desafío completado.
        </p>
        <p class="text-[11px] text-emerald-700">${stand.trivia.explanation}</p>
      `;
      this.modalTriviaFeedback.classList.remove("hidden");

      setTimeout(() => {
        this.modalTrivia.classList.add("hidden");
        this.openScanView(stand.id);
      }, 1400);

    } else {
      clickedBtn.classList.add("border-rose-500", "bg-rose-50", "animate-shake");
      this.modalTriviaFeedback.className = "p-3.5 rounded-2xl border border-rose-200 bg-rose-50 text-xs text-rose-800";
      this.modalTriviaFeedback.innerHTML = `
        <p class="font-bold flex items-center gap-1.5 text-rose-700">
          <i data-lucide="alert-circle" class="w-4 h-4"></i> Respuesta Incorrecta
        </p>
        <p class="text-[11px] text-rose-600 mt-0.5">Vuelve a leer la descripción del stand e inténtalo de nuevo.</p>
      `;
      this.modalTriviaFeedback.classList.remove("hidden");

      setTimeout(() => {
        clickedBtn.classList.remove("animate-shake");
      }, 400);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  openScanView(standId) {
    this.selectedStandId = standId;
    const stand = STANDS_DATA.find(s => s.id === standId) || STANDS_DATA[0];
    this.scanTargetName.textContent = stand.name;
    this.manualStandInput.value = "";
    this.btnFillSuggested.textContent = stand.code;

    const isDone = State.isStandCompleted(stand.id);
    if (isDone) {
      this.boxStampSuccess.classList.remove("hidden");
    } else {
      this.boxStampSuccess.classList.add("hidden");
    }

    this.showView("view-scan");
  }

  handleManualValidation() {
    const inputVal = this.manualStandInput.value.trim().toUpperCase();
    const stand = STANDS_DATA.find(s => s.code.toUpperCase() === inputVal);

    if (stand) {
      this.validateStampSuccess(stand);
    } else {
      this.manualStandInput.classList.add("animate-shake", "border-rose-500");
      this.triggerToast("Código no válido. Prueba con " + (STANDS_DATA.find(s => s.id === this.selectedStandId)?.code || "STAND01"));
      setTimeout(() => {
        this.manualStandInput.classList.remove("animate-shake");
      }, 400);
    }
  }

  validateStampSuccess(stand) {
    State.unlockStamp(stand.id);
    this.boxStampSuccess.classList.remove("hidden");
    this.updateAllUI();
    this.triggerToast(`Sello obtenido: ${stand.name}`);
  }

  renderPassport() {
    const completed = State.getCompletedCount();
    const total = STANDS_DATA.length;
    const percent = Math.round((completed / total) * 100);

    this.passportCounterPill.textContent = `${completed}/${total} sellos`;
    this.passportChallengesCount.textContent = completed;
    this.passportProgressBarSmall.style.width = `${percent}%`;
    this.passportPercentText.textContent = `${percent}% de la ruta`;
    this.passportMissingText.textContent = completed === total ? "¡Completado!" : `Faltan ${total - completed}`;

    const currentRank = RANKS.slice().reverse().find(r => completed >= r.minStamps) || RANKS[0];
    this.passportRankTitle.textContent = currentRank.title;
    this.passportActiveStampsText.textContent = `${completed} sellos activos`;

    // Renderizar grilla de 15 casilleros
    this.stampsGridContainer.innerHTML = STANDS_DATA.map(stand => {
      const isDone = State.isStandCompleted(stand.id);

      return `
        <div 
          data-open-stand="${stand.id}" 
          class="cursor-pointer bg-white p-4 rounded-2xl border ${isDone ? 'border-cyan-300 bg-cyan-50/20' : 'border-slate-200/80'} shadow-xs hover:border-cyan-400 transition-all flex flex-col justify-between min-h-[90px] active:scale-[0.98]"
        >
          <div class="w-7 h-7 rounded-xl flex items-center justify-center ${isDone ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-400'}">
            <i data-lucide="${isDone ? 'award' : 'lock'}" class="w-3.5 h-3.5"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-900 truncate">${stand.name}</h4>
            <span class="text-[10px] text-slate-400">Stand ${stand.num} ${isDone ? 'activo' : 'pendiente'}</span>
          </div>
        </div>
      `;
    }).join("");

    this.stampsGridContainer.querySelectorAll("div[data-open-stand]").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-open-stand");
        this.openStationView(id);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  renderRanks() {
    const completed = State.getCompletedCount();

    // Render Lista de Rangos
    this.ranksListContainer.innerHTML = RANKS.map((rank) => {
      const isUnlocked = completed >= rank.minStamps;
      const isCurrent = (RANKS.slice().reverse().find(r => completed >= r.minStamps) || RANKS[0]).title === rank.title;

      return `
        <div class="bg-white p-5 rounded-2xl border ${isCurrent ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-200' : 'border-slate-200/80'} flex items-center justify-between transition-all">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center ${isUnlocked ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}">
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
    }).join("");

    // Render Logros
    this.achievementsContainer.innerHTML = ACHIEVEMENTS.map(ach => {
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
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  }

  triggerToast(message) {
    this.floatingToastMsg.textContent = message;
    this.floatingToast.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.floatingToast.classList.add("hidden");
    }, 3200);
  }
}

// Inicializar cuando el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
  new PasaporteApp();
});
