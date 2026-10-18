/**
 * INNOVARTECH - Vista 'inicio': portada de la feria
 * Explica de qué trata la feria y a qué está dedicada, y muestra el
 * recorrido visual (fotos + videos de assets/multimedia) en una galería
 * con lightbox a pantalla completa.
 *
 * Accesible desde el botón del logo corporativo (navbar.js) y es la vista
 * de aterrizaje tras crear/restaurar el pasaporte.
 */

// Galería del recorrido: los videos llevan póster (jpg) para no descargar
// el mp4 hasta que el visitante lo abra.
const GALLERY = [
  {
    type: "image",
    src: "./assets/multimedia/imagen-entrada.jpg",
    title: "Entrada de la escuela"
  },
  {
    type: "video",
    src: "./assets/multimedia/video-recorrido1.mp4",
    poster: "./assets/multimedia/video-recorrido1.jpg",
    title: "Sobrevuelo de la entrada"
  },
  {
    type: "image",
    src: "./assets/multimedia/imagen-computacion.jpg",
    title: "Exposición de cómputo"
  },
  {
    type: "video",
    src: "./assets/multimedia/video-recorrido2.mp4",
    poster: "./assets/multimedia/video-recorrido2.jpg",
    title: "Recorrido por el patio"
  },
  {
    type: "image",
    src: "./assets/multimedia/img-secundaria-frente.jpg",
    title: "Frente de la secundaria"
  },
  {
    type: "video",
    src: "./assets/multimedia/video-secundaria-frente.mp4",
    poster: "./assets/multimedia/video-secundaria-frente.jpg",
    title: "Frente de la secundaria en video"
  }
];

export function createInicioView(app) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-6 pb-24 md:pb-12";

  const stands = app.standsList;

  container.innerHTML = `
    <!-- ============================================================
         HERO: video de bienvenida del recorrido
         ============================================================ -->
    <div class="relative rounded-3xl overflow-hidden border border-slate-700/60 bg-[#0f2742] shadow-md bg-grid-tech">
      <video
        id="hero-video"
        class="w-full aspect-video object-cover"
        poster="./assets/multimedia/video-recorrido1.jpg"
        preload="metadata"
        playsinline
        muted
        loop
      >
        <source src="./assets/multimedia/video-recorrido1.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>

      <!-- Degradado para que el pie de texto se lea sobre cualquier fotograma -->
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a1d33] via-[#0a1d33]/60 to-transparent"></div>

      <!-- Botón grande de play (solo visible cuando está pausado).
           Va a ~26% de altura: en pantallas chicas el centro del video
           chocaría con el texto del pie. -->
      <button
        id="hero-toggle"
        class="absolute left-1/2 -translate-x-1/2 top-[26%] w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center active:scale-95 transition-all"
        aria-label="Reproducir video de bienvenida"
      >
        <i data-lucide="play" class="w-7 h-7 ml-0.5"></i>
      </button>

      <!-- Pie del hero -->
      <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3">
        <div>
          <span class="block text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
            Feria de robótica · Innovartech
          </span>
          <h2 class="text-lg sm:text-2xl font-extrabold text-white leading-tight tracking-tight">
            Conectando ideas, construyendo el futuro.
          </h2>
        </div>
        <button
          id="hero-toggle-mini"
          class="shrink-0 w-11 h-11 rounded-xl bg-white/10 border border-white/25 text-white flex items-center justify-center active:scale-95 transition-all"
          aria-label="Pausar video"
        >
          <i data-lucide="pause" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

    <!-- ============================================================
         DE QUÉ TRATA LA FERIA
         ============================================================ -->
    <div class="space-y-3">
      <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">
        De qué trata
      </span>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Una feria donde los proyectos se visitan.
      </h2>
      <div class="space-y-3 text-sm text-slate-600 leading-relaxed">
        <p>
          <strong class="text-slate-900">INNOVARTECH</strong> es la feria tecnológica de robótica de la escuela:
          estudiantes y docentes convierten sus proyectos en <strong class="text-slate-900">5 estaciones
          abiertas</strong> que se recorren, se prueban y se explican en vivo. Nada es vitrina: en cada stand
          hay algo que ver, tocar o desafiar.
        </p>
        <p>
          Cada visitante recibe un <strong class="text-slate-900">pasaporte digital</strong>: al llegar a una
          estación escanea su QR, desbloquea un sello y sube de rango. Al completar las cinco, cierra el
          recorrido completo de la feria.
        </p>
      </div>
    </div>

    <!-- ============================================================
         A QUÉ ESTÁ DEDICADA (tarjetas desde standsList)
         ============================================================ -->
    <div class="space-y-3">
      <div class="flex items-end justify-between gap-3">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block mb-1">
            A qué está dedicada
          </span>
          <h3 class="text-lg font-extrabold text-slate-900 leading-snug">
            Cinco ejes de robótica y tecnología
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            La feria está dedicada a acercar la robótica, la programación y la inteligencia artificial
            a toda la comunidad, contada por quienes la construyen.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${stands.map(s => `
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-1.5">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full">
                Stand ${s.num}
              </span>
              <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400 text-right leading-tight">
                ${s.category}
              </span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 leading-snug">${s.name}</h4>
            <p class="text-[11px] text-slate-500 leading-snug">${s.description}</p>
            <p class="text-[10px] text-slate-400 flex items-center gap-1 mt-auto pt-1">
              <i data-lucide="map-pin" class="w-3 h-3 shrink-0"></i>
              <span>${s.location}</span>
            </p>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Accesos rápidos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button id="btn-ir-recorrido" class="min-h-12 bg-[#132840] hover:bg-[#0a1827] active:scale-95 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-sm">
        <i data-lucide="layout-grid" class="w-4 h-4"></i>
        <span>Abrir mi panel de recorrido</span>
        <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
      </button>
      <button id="btn-ir-mapa" class="min-h-12 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs border border-slate-200/80 shadow-sm transition-all">
        <i data-lucide="map-pin" class="w-4 h-4 text-cyan-600"></i>
        <span>Ver el mapa de la feria</span>
      </button>
    </div>

    <!-- ============================================================
         RECORRIDO VISUAL: galería de fotos y videos
         ============================================================ -->
    <div class="space-y-3 pt-2">
      <div>
        <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block mb-1">
          Recorrido visual
        </span>
        <h3 class="text-lg font-extrabold text-slate-900">Así se vive la feria</h3>
        <p class="text-xs text-slate-500 mt-1">Tocá cualquier tarjeta para verla a pantalla completa.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        ${GALLERY.map((item, i) => `
          <button
            class="gallery-item group relative aspect-video rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-sm active:scale-[0.97] transition-all"
            data-gallery-index="${i}"
            aria-label="Ver ${item.title}"
          >
            <img
              src="${item.type === "video" ? item.poster : item.src}"
              alt="${item.title}"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"></span>

            ${item.type === "video" ? `
              <span class="pointer-events-none absolute inset-0 m-auto w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <i data-lucide="play" class="w-4 h-4 text-white ml-0.5"></i>
              </span>
            ` : ""}

            <span class="absolute left-2.5 right-2.5 bottom-2 text-[10px] font-bold text-white leading-tight drop-shadow-sm text-left">
              ${item.title}
            </span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  // ---------------------------------------------------------------
  // Hero: reproducir / pausar
  // ---------------------------------------------------------------
  const heroVideo = container.querySelector("#hero-video");
  const heroToggle = container.querySelector("#hero-toggle");
  const heroToggleMini = container.querySelector("#hero-toggle-mini");

  const renderHeroIcons = () => {
    const playing = !heroVideo.paused && !heroVideo.ended;
    heroToggle.classList.toggle("hidden", playing);
    heroToggleMini.innerHTML = `<i data-lucide="${playing ? "pause" : "play"}" class="w-4 h-4"></i>`;
    heroToggleMini.setAttribute("aria-label", playing ? "Pausar video" : "Reproducir video");
    if (window.lucide) window.lucide.createIcons();
  };

  const toggleHero = () => {
    if (heroVideo.paused || heroVideo.ended) {
      // play() puede rechazar si el navegador exige gesto: no rompe la vista
      heroVideo.play().then(renderHeroIcons).catch(() => {});
    } else {
      heroVideo.pause();
      renderHeroIcons();
    }
  };

  heroToggle.addEventListener("click", toggleHero);
  heroToggleMini.addEventListener("click", toggleHero);
  // Tocar el video también reproduce / pausa (el <video> no tiene controls)
  heroVideo.addEventListener("click", toggleHero);
  heroVideo.addEventListener("play", renderHeroIcons);
  heroVideo.addEventListener("pause", renderHeroIcons);
  heroVideo.addEventListener("ended", renderHeroIcons);

  // ---------------------------------------------------------------
  // Lightbox de la galería (se monta en <body> y se retira al navegar)
  // ---------------------------------------------------------------
  let lightboxEl = null;
  let currentIndex = 0;
  let previousOverflow = "";
  let keyHandler = null;

  const renderMedia = (index) => {
    const item = GALLERY[index];
    const mediaBox = lightboxEl.querySelector("#lb-media");
    mediaBox.innerHTML = item.type === "video"
      ? `<video class="w-full max-h-[70vh] rounded-xl bg-black" controls autoplay playsinline poster="${item.poster}" src="${item.src}"></video>`
      : `<img class="w-full max-h-[70vh] rounded-xl object-contain" src="${item.src}" alt="${item.title}" />`;

    lightboxEl.querySelector("#lb-title").textContent = item.title;
    lightboxEl.querySelector("#lb-counter").textContent = `${index + 1} / ${GALLERY.length}`;
    if (window.lucide) window.lucide.createIcons();
  };

  const closeLightbox = () => {
    if (!lightboxEl) return;
    if (keyHandler) document.removeEventListener("keydown", keyHandler);
    lightboxEl.remove();
    lightboxEl = null;
    document.body.style.overflow = previousOverflow;
  };

  const openLightbox = (index) => {
    if (lightboxEl) closeLightbox();
    currentIndex = index;

    lightboxEl = document.createElement("div");
    lightboxEl.id = "inicio-lightbox";
    lightboxEl.className = "fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-sm flex flex-col";
    lightboxEl.innerHTML = `
      <div class="flex items-center justify-between gap-3 px-4 py-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)]">
        <span id="lb-title" class="text-[11px] font-bold uppercase tracking-wider text-white/80 truncate"></span>
        <div class="flex items-center gap-2 shrink-0">
          <span id="lb-counter" class="text-[11px] font-mono text-white/50"></span>
          <button id="lb-close" class="w-11 h-11 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all" aria-label="Cerrar">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <div class="flex-1 min-h-0 flex items-center justify-center px-4">
        <div id="lb-media" class="w-full max-w-4xl flex items-center justify-center"></div>
      </div>

      <div class="flex items-center justify-center gap-4 px-4 py-5 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)]">
        <button id="lb-prev" class="min-w-12 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-1 text-xs font-semibold active:scale-95 transition-all" aria-label="Anterior">
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
          <span class="hidden sm:inline">Anterior</span>
        </button>
        <button id="lb-next" class="min-w-12 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-1 text-xs font-semibold active:scale-95 transition-all" aria-label="Siguiente">
          <span class="hidden sm:inline">Siguiente</span>
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
        </button>
      </div>
    `;

    // Bloquea el scroll del body mientras el lightbox está abierto
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const step = (delta) => {
      currentIndex = (currentIndex + delta + GALLERY.length) % GALLERY.length;
      renderMedia(currentIndex);
    };

    lightboxEl.querySelector("#lb-close").addEventListener("click", closeLightbox);
    lightboxEl.querySelector("#lb-prev").addEventListener("click", () => step(-1));
    lightboxEl.querySelector("#lb-next").addEventListener("click", () => step(1));
    // Clic fuera del media (fondo) → cerrar
    lightboxEl.addEventListener("click", (e) => {
      if (e.target === lightboxEl || e.target.parentElement === lightboxEl.querySelector("#lb-media")) {
        closeLightbox();
      }
    });

    keyHandler = (e) => {
      if (!lightboxEl) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", keyHandler);

    document.body.appendChild(lightboxEl);
    renderMedia(currentIndex);
  };

  container.querySelectorAll("[data-gallery-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      openLightbox(parseInt(btn.getAttribute("data-gallery-index"), 10));
    });
  });

  // ---------------------------------------------------------------
  // Accesos rápidos
  // ---------------------------------------------------------------
  container.querySelector("#btn-ir-recorrido").addEventListener("click", () => {
    app.navigate("recorrido");
  });
  container.querySelector("#btn-ir-mapa").addEventListener("click", () => {
    app.navigate("map");
  });

  // Al salir de la vista: cerrar lightbox y detener el video del hero
  app.viewCleanup = () => {
    closeLightbox();
    heroVideo.pause();
  };

  return container;
}
