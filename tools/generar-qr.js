/**
 * INNOVARTECH - Generador de QR de la feria (HERRAMIENTA DEL ORGANIZADOR)
 *
 * Uso:
 *   npm run qr:stands   → QR de validación de stands (STAND01..STAND05)
 *   npm run qr:cromos   → QR de cromos secretos  (CROMO01..CROMO05)
 *   npm run qr:todo     → ambas hojas
 *
 * Qué hace:
 *   1. Lee los datos desde src/js/views/stands/standXX.js (código, nombre,
 *      categoría, ubicación y cromo) → nunca se desincroniza de la app.
 *   2. Genera un PNG por código en assets/stands/ y assets/cromos/.
 *   3. Genera qr-stands.html y qr-cromos.html: hojas A4 listas para imprimir.
 *
 * IMPORTANTE: los QR deben imprimirse en tamaño legible (mín. 3 cm) y en
 * lugares con buena iluminación para que la cámara del celular los lea.
 *
 * Esta librería (qrcode) es devDependency: NO viaja a producción.
 */
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const ROOT = path.join(__dirname, "..");
const STANDS_DIR = path.join(ROOT, "src", "js", "views", "stands");
const STAND_FILES = ["stand01.js", "stand02.js", "stand03.js", "stand04.js", "stand05.js"];

// Definición de cada tipo de hoja que sabe generar el script
const SETS = {
  stands: {
    dir: path.join(ROOT, "assets", "stands"),
    sheet: "qr-stands.html",
    title: "QR de validación de stands",
    lead: 'Imprimí, cortá por la línea punteada y pegá cada QR en la <b>mesa o exhibidor visible</b> de su stand.',
    note: "Valida el sello del pasaporte (botón \"Validar visita\" o el QR del stand)."
  },
  cromos: {
    dir: path.join(ROOT, "assets", "cromos"),
    sheet: "qr-cromos.html",
    title: "QR de estampas secretas",
    lead: 'Imprimí, cortá por la línea punteada y pegá cada QR <b>oculto</b> en su stand (donde dice la pista).',
    note: "Registra la misión secreta (botón \"Buscar la estampa\" dentro de cada stand)."
  }
};

// Lee la info del stand y de su cromo desde el módulo fuente (mismo dato que usa la app)
function readStand(file) {
  const src = fs.readFileSync(path.join(STANDS_DIR, file), "utf8");

  const grab = (re) => (src.match(re) || [])[1] || "";
  const num = grab(/num:\s*"(\d+)"/);
  const standName = grab(/name:\s*"([^"]+)"/);
  const standCode = grab(/code:\s*"([^"]+)"/); // STAND01..STAND05 (aparece antes del bloque cromo)
  const category = grab(/category:\s*"([^"]+)"/);
  const location = grab(/location:\s*"([^"]+)"/);

  const block = src.match(/cromo:\s*\{([\s\S]*?)\n\s*\}/);
  let cromo = null;
  if (block) {
    const pick = (key) => (block[1].match(new RegExp(key + ':\\s*"([^"]+)"')) || [])[1] || "";
    cromo = { code: pick("code"), name: pick("name"), rarity: pick("rarity"), hint: pick("hint") };
  }

  return { file, num, standName, standCode, category, location, cromo };
}

function escapeHtml(v) {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Tarjetas de cada hoja
function buildItems(setName, stands) {
  if (setName === "stands") {
    return stands
      .filter((s) => s.standCode)
      .map((s) => ({
        code: s.standCode,
        title: s.standName,
        line1: `Stand ${s.num} · ${s.category}`,
        line2: s.location ? `Ubicación: ${s.location}` : "",
        hint: ""
      }));
  }
  return stands
    .filter((s) => s.cromo && s.cromo.code)
    .map((s) => ({
      code: s.cromo.code,
      title: s.cromo.name,
      line1: `Stand ${s.num} · ${s.standName}`,
      line2: `Rareza ${s.cromo.rarity}`,
      hint: s.cromo.hint ? `Pista: ${s.cromo.hint}` : ""
    }));
}

function renderCard(item, imgDir) {
  return `
      <div class="card">
        <div class="qr-wrap">
          <img src="./${imgDir}/${escapeHtml(item.code)}.png" alt="QR ${escapeHtml(item.code)}" />
        </div>
        <div class="meta">
          <span class="code">${escapeHtml(item.code)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="stand">${escapeHtml(item.line1)}</p>
          ${item.line2 ? `<p class="rarity">${escapeHtml(item.line2)}</p>` : ""}
          ${item.hint ? `<p class="hint">${escapeHtml(item.hint)}</p>` : ""}
        </div>
      </div>`;
}

function buildSheet(setName, items) {
  const set = SETS[setName];
  const imgDir = path.relative(ROOT, set.dir).replace(/\\/g, "/");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${set.title} · INNOVARTECH</title>
  <!-- ARCHIVO GENERADO POR "npm run qr:${setName}" - NO EDITAR A MANO -->
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: Inter, system-ui, -apple-system, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
    }
    .toolbar {
      max-width: 800px;
      margin: 0 auto 20px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .toolbar h1 { font-size: 16px; margin: 0 0 4px; }
    .toolbar p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }
    .toolbar button {
      background: #13b8d4;
      color: #fff;
      border: 0;
      border-radius: 12px;
      padding: 12px 18px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      min-height: 48px;
    }
    .toolbar button:hover { background: #0ea5be; }

    .sheet {
      max-width: 800px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    .card {
      background: #fff;
      border: 2px dashed #94a3b8;
      border-radius: 18px;
      padding: 20px;
      text-align: center;
      break-inside: avoid;
    }
    .qr-wrap img {
      width: 190px;
      height: 190px;
      image-rendering: pixelated;
      display: block;
      margin: 0 auto;
    }
    .meta { margin-top: 14px; }
    .code {
      display: inline-block;
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #0f2742;
      background: #f1f7f9;
      border: 1px solid #e0edee;
      border-radius: 999px;
      padding: 3px 12px;
    }
    .meta h3 { font-size: 18px; margin: 10px 0 2px; }
    .stand { font-size: 12px; color: #64748b; margin: 0; }
    .rarity { font-size: 11px; font-weight: 700; color: #b45309; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 1px; }
    .hint { font-size: 11px; color: #94a3b8; margin: 8px 0 0; line-height: 1.5; font-style: italic; }

    @media (max-width: 640px) { .sheet { grid-template-columns: 1fr; } }

    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none; }
      .sheet { max-width: none; gap: 10mm; }
      .card { border-radius: 12px; padding: 8mm; }
      @page { size: A4 portrait; margin: 12mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <h1>${set.title} · ${items.length} tarjetas</h1>
      <p>${set.lead}<br />
      Usá impresión al 100% (sin ajustar a página) y buen contraste: la cámara del celular debe leerlo desde ~30 cm.</p>
      <p style="margin-top:6px">${set.note}</p>
    </div>
    <button onclick="window.print()">🖨️ Imprimir hoja</button>
  </div>

  <div class="sheet">
${items.map((item) => renderCard(item, imgDir)).join("")}
  </div>
</body>
</html>
`;
}

async function generateSet(setName, stands) {
  const set = SETS[setName];
  const items = buildItems(setName, stands);

  if (!items.length) {
    console.warn(`⚠ ${setName}: no hay datos para generar (revisá src/js/views/stands/standXX.js)`);
    return;
  }

  fs.mkdirSync(set.dir, { recursive: true });

  // 1) PNG de cada QR (nivel de corrección de errores H: se lee aunque esté rayado o torcido)
  for (const item of items) {
    const pngPath = path.join(set.dir, `${item.code}.png`);
    await QRCode.toFile(pngPath, item.code, {
      type: "png",
      width: 900,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#0f2742ff", light: "#ffffffff" }
    });
    const kb = (fs.statSync(pngPath).size / 1024).toFixed(1);
    console.log(`  ✔ ${setName}/${item.code}.png  (${kb} KB)  → ${item.title}`);
  }

  // 2) Hoja imprimible con guías de corte
  fs.writeFileSync(path.join(ROOT, set.sheet), buildSheet(setName, items), "utf8");
  console.log(`  ✔ Hoja imprimible: ${set.sheet}`);
}

async function main() {
  const arg = (process.argv[2] || "all").toLowerCase();

  if (arg !== "all" && !SETS[arg]) {
    console.error(`✖ Opción inválida: "${arg}". Usá: all | ${Object.keys(SETS).join(" | ")}`);
    process.exit(1);
  }

  const stands = STAND_FILES.map(readStand).filter(Boolean);
  if (!stands.length) {
    console.error("✖ No se encontraron stands en src/js/views/stands/standXX.js");
    process.exit(1);
  }

  const targets = arg === "all" ? Object.keys(SETS) : [arg];

  for (const setName of targets) {
    console.log(`\n▶ Generando ${SETS[setName].title}...`);
    await generateSet(setName, stands);
  }

  console.log("");
  console.log("Recordá: la app valida el TEXTO del QR (ej. STAND01 o CROMO01), no la imagen:");
  console.log("si reimprimís uno, asegurate de que el contenido sea exactamente ese código.");
}

main().catch((err) => {
  console.error("✖ Error generando los QR:", err.message);
  process.exit(1);
});
