/**
 * INNOVATECH - Vista de Estadísticas Analíticas (organizadores / jurados)
 * Gráfico de TORTA: visitas acumuladas por stand.
 * Gráfico de DONA: uso de escáner QR vs código manual (Plan B).
 * Tabla de clasificación: visitas totales + valoración promedio (estrellas).
 * Fuente de datos: Supabase (visitas_estaciones), con fallback a localStorage.
 */

import { supabase } from '../supabaseClient.js';

const CHART_COLORS = ['#13b8d4', '#0f2742', '#10b981', '#f59e0b', '#8b5cf6'];

export function createStatsView(app) {
  const container = document.createElement("div");
  container.className = "w-full max-w-5xl px-4 py-6 md:py-8 space-y-6 pb-24 md:pb-12";

  container.innerHTML = `
    <!-- Cabecera -->
    <div class="flex items-start justify-between">
      <div>
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-0.5">
          MÉTRICAS EN VIVO
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Estadísticas de la feria.
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">Visitas, métodos de validación y valoración de los visitantes.</p>
      </div>

      <span id="stats-source-badge" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
        <span>Cargando…</span>
      </span>
    </div>

    <!-- Fila de 3 gráficos: Torta + Dona + Perfiles -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <!-- Gráfico de Torta: visitas por stand -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
          VISITAS POR STAND
        </span>
        <h3 class="text-lg font-extrabold text-slate-900 mb-3">Distribución de recorrido</h3>
        <div class="relative w-full max-w-xs mx-auto">
          <canvas id="chart-pie"></canvas>
        </div>
      </div>

      <!-- Gráfico de Dona: QR vs Manual -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
          MÉTODO DE INGRESO
        </span>
        <h3 class="text-lg font-extrabold text-slate-900 mb-3">Cámara QR vs Código manual</h3>
        <div class="relative w-full max-w-xs mx-auto">
          <canvas id="chart-doughnut"></canvas>
        </div>
      </div>

      <!-- Gráfico de Dona: perfiles de visitantes -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
          PERFILES
        </span>
        <h3 class="text-lg font-extrabold text-slate-900 mb-3">¿Quién visita la feria?</h3>
        <div class="relative w-full max-w-xs mx-auto">
          <canvas id="chart-visitors"></canvas>
        </div>
      </div>

    </div>

    <!-- Tabla: Actividad Digital -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
      <div>
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
          TABLA · ACTIVIDAD DIGITAL
        </span>
        <h3 class="text-lg font-extrabold text-slate-900">Actividad digital</h3>
        <p class="text-xs text-slate-500 mt-0.5">Sellos, escaneos y misiones secretas registradas en la feria.</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead>
            <tr class="text-left text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-100">
              <th class="py-2 pr-3 font-bold">Métrica</th>
              <th class="py-2 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody id="stats-digital-body">
            <tr><td colspan="2" class="py-6 text-center text-slate-400">Cargando datos…</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabla de Clasificación -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
      <div>
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
          TABLA DE CLASIFICACIÓN
        </span>
        <h3 class="text-lg font-extrabold text-slate-900">Estaciones de mayor interés</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead>
            <tr class="text-left text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-100">
              <th class="py-2 pr-3 font-bold">Stand</th>
              <th class="py-2 pr-3 font-bold">Proyecto</th>
              <th class="py-2 pr-3 font-bold text-right">Visitas</th>
              <th class="py-2 font-bold text-right">Valoración</th>
            </tr>
          </thead>
          <tbody id="stats-table-body">
            <tr><td colspan="4" class="py-6 text-center text-slate-400">Cargando datos…</td></tr>
          </tbody>
        </table>
      </div>

      <p id="stats-empty-msg" class="hidden text-center text-xs text-slate-400 bg-slate-50 rounded-2xl p-4">
        Aún no hay visitas registradas. ¡Los sellos aparecerán acá en tiempo real!
      </p>
    </div>
  `;

  // Destruir gráficos previos si la vista se re-renderiza
  function safeDestroy(canvasId) {
    const canvas = container.querySelector(`#${canvasId}`);
    if (!canvas) return null;
    const prev = window.Chart && window.Chart.getChart ? window.Chart.getChart(canvas) : null;
    if (prev) prev.destroy();
    return canvas;
  }

  // Filas normalizadas desde Supabase
  async function fetchVisitRows() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('visitas_estaciones')
          .select('stand_codigo, metodo_ingreso, valoracion');
        if (!error && data && data.length) return { rows: data, source: "supabase" };
      } catch (e) {
        console.warn("Stats: fallo Supabase, usando datos locales:", e);
      }
    }
    // Fallback local (sello del dispositivo actual)
    const rows = Object.keys(app.state.stamps).map((standId) => {
      const stand = app.standsList.find((s) => s.id === standId);
      const stamp = app.state.stamps[standId];
      return {
        stand_codigo: stand ? stand.code : standId,
        metodo_ingreso: stamp.metodoIngreso || "manual",
        valoracion: stamp.valoracion ?? null
      };
    });
    return { rows, source: "local" };
  }

  // Perfiles de visitantes: pasaportes creados por tipo (columna tipo_visitante)
  async function fetchVisitorProfiles() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('tipo_visitante');
        if (!error && data) return data;
      } catch (e) {
        console.warn("Stats: fallo al consultar perfiles:", e);
      }
    }
    // Fallback local: el usuario de este dispositivo
    return app.state.user && app.state.user.tipo_visitante
      ? [{ tipo_visitante: app.state.user.tipo_visitante }]
      : [];
  }

  // Cromos secretos encontrados (misión secreta): tabla cromos_secretos
  async function fetchChromeCount() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('cromos_secretos')
          .select('id');
        // Sin error → el valor real (aunque sea 0); con error (tabla ausente) → fallback local
        if (!error && data) return data.length;
      } catch (e) {
        console.warn("Stats: fallo al consultar cromos_secretos:", e);
      }
    }
    return app.getChromeCount();
  }

  function standName(code) {
    const stand = app.standsList.find((s) => s.code === code);
    return stand ? stand.name : code;
  }

  function standNum(code) {
    const stand = app.standsList.find((s) => s.code === code);
    return stand ? stand.num : code;
  }

  function stars(n) {
    if (!n) return "—";
    return "⭐".repeat(n) + ` ${n}.0`;
  }

  function renderDigitalActivity(rows, chromeCount) {
    const tbody = container.querySelector("#stats-digital-body");
    if (!tbody) return;

    const qrCount = rows.filter((r) => r.metodo_ingreso === "qr").length;

    // Clases literales completas: Tailwind las detecta en el código fuente (JIT por build)
    const TONES = {
      cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
      amber: "bg-amber-50 text-amber-700 border-amber-100"
    };

    const metrics = [
      { label: "QR escaneados", value: qrCount, icon: "scan", tone: TONES.cyan },
      { label: "Misiones completadas", value: rows.length, icon: "stamp", tone: TONES.emerald },
      { label: "Misiones secretas encontradas", value: chromeCount, icon: "gem", tone: TONES.amber }
    ];

    tbody.innerHTML = metrics
      .map(
        (m) => `
          <tr class="border-b border-slate-50 last:border-0">
            <td class="py-2.5 pr-3">
              <span class="inline-flex items-center gap-2.5 font-semibold text-slate-800">
                <span class="w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 ${m.tone}">
                  <i data-lucide="${m.icon}" class="w-3.5 h-3.5"></i>
                </span>
                ${m.label}
              </span>
            </td>
            <td class="py-2.5 text-right font-mono font-bold text-slate-900">${m.value}</td>
          </tr>
        `
      )
      .join("");

    if (window.lucide) window.lucide.createIcons();
  }

  function renderAll(rows, source, profiles, chromeCount) {
    const badge = container.querySelector("#stats-source-badge");
    badge.innerHTML = source === "supabase"
      ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>Supabase · en vivo</span>'
      : '<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>Datos locales</span>';

    const emptyMsg = container.querySelector("#stats-empty-msg");
    const tbody = container.querySelector("#stats-table-body");

    // Gráfico de perfiles: independiente de las visitas (usa pasaportes creados)
    renderVisitorsChart(profiles);

    // Actividad digital: se renderiza siempre (aunque no haya visitas aún)
    renderDigitalActivity(rows, chromeCount);

    if (!rows.length) {
      emptyMsg.classList.remove("hidden");
      tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-slate-400">Sin visitas aún</td></tr>';
      return;
    }
    emptyMsg.classList.add("hidden");

    // ---- Torta: visitas por stand ----
    const byStand = {};
    rows.forEach((r) => { byStand[r.stand_codigo] = (byStand[r.stand_codigo] || 0) + 1; });
    const standCodes = Object.keys(byStand).sort();

    const pieCanvas = safeDestroy("chart-pie");
    new window.Chart(pieCanvas, {
      type: "pie",
      data: {
        labels: standCodes.map((c) => `Stand ${standNum(c)}`),
        datasets: [{
          data: standCodes.map((c) => byStand[c]),
          backgroundColor: standCodes.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.1,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${standName(standCodes[ctx.dataIndex])}: ${ctx.raw} visitas`
            }
          }
        }
      }
    });

    // ---- Dona: QR vs manual ----
    let qr = 0, manual = 0;
    rows.forEach((r) => { if (r.metodo_ingreso === "qr") qr++; else manual++; });

    const donutCanvas = safeDestroy("chart-doughnut");
    new window.Chart(donutCanvas, {
      type: "doughnut",
      data: {
        labels: ["Cámara QR", "Código manual (Plan B)"],
        datasets: [{
          data: [qr, manual],
          backgroundColor: ["#13b8d4", "#f59e0b"],
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.1,
        cutout: "58%",
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });

    // ---- Dona: perfiles de visitantes ----
    function renderVisitorsChart(profiles) {
      const PROFILE_ORDER = ["Alumno", "Profesor", "Familiar", "Visitante"];
      const PROFILE_COLORS = {
        Alumno: "#13b8d4",
        Profesor: "#0f2742",
        Familiar: "#f59e0b",
        Visitante: "#10b981"
      };

      const byProfile = {};
      profiles.forEach((p) => {
        const key = p.tipo_visitante && PROFILE_ORDER.includes(p.tipo_visitante) ? p.tipo_visitante : null;
        if (key) byProfile[key] = (byProfile[key] || 0) + 1;
      });
      const profileLabels = PROFILE_ORDER.filter((k) => byProfile[k]);

      const visitorsCanvas = safeDestroy("chart-visitors");
      if (!visitorsCanvas || !visitorsCanvas.parentElement) return; // ya reemplazado por mensaje
      if (!profileLabels.length) {
        visitorsCanvas.parentElement.innerHTML =
          '<p class="text-xs text-slate-400 text-center py-10 leading-relaxed">Aún no hay pasaportes con perfil registrado.<br />Los datos aparecerán aquí en vivo.</p>';
        return;
      }
      new window.Chart(visitorsCanvas, {
        type: "doughnut",
        data: {
          labels: profileLabels,
          datasets: [{
            data: profileLabels.map((k) => byProfile[k]),
            backgroundColor: profileLabels.map((k) => PROFILE_COLORS[k]),
            borderWidth: 2,
            borderColor: "#ffffff"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.1,
          cutout: "58%",
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }

    // ---- Tabla de clasificación ----
    const total = rows.length;
    tbody.innerHTML = standCodes
      .sort((a, b) => byStand[b] - byStand[a])
      .map((code) => {
        const visits = byStand[code];
        const ratings = rows
          .filter((r) => r.stand_codigo === code && r.valoracion)
          .map((r) => Number(r.valoracion));
        const avg = ratings.length
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length)
          : null;
        const pct = Math.round((visits / total) * 100);
        return `
          <tr class="border-b border-slate-50 last:border-0">
            <td class="py-2.5 pr-3">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-50 text-cyan-700 font-bold text-[10px] border border-cyan-100">${standNum(code)}</span>
            </td>
            <td class="py-2.5 pr-3 font-semibold text-slate-800">${standName(code)}</td>
            <td class="py-2.5 pr-3 text-right font-mono font-bold text-slate-900">${visits} <span class="text-slate-400 font-normal">(${pct}%)</span></td>
            <td class="py-2.5 text-right text-amber-500 font-semibold">${stars(avg ? Math.round(avg) : null)}${avg ? ` <span class="text-slate-400 font-normal">${avg.toFixed(1)}</span>` : ""}</td>
          </tr>
        `;
      })
      .join("");
  }

  // Carga inicial
  (async () => {
    const [{ rows, source }, profiles, chromeCount] = await Promise.all([
      fetchVisitRows(),
      fetchVisitorProfiles(),
      fetchChromeCount()
    ]);
    renderAll(rows, source, profiles, chromeCount);
    if (window.lucide) window.lucide.createIcons();
  })();

  return container;
}
