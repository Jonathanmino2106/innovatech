/**
 * INNOVATECH - Generador de QR de cromos secretos (HERRAMIENTA DEL ORGANIZADOR)
 *
 * Uso:   npm run qr:cromos
 *
 * Qué hace:
 *   1. Lee los datos de cada cromo desde src/js/views/stands/standXX.js
 *      (código, nombre, rareza y pista) → nunca se desincroniza de la app.
 *   2. Genera un PNG por cromo en assets/cromos/CROMOxx.png
 *   3. Genera qr-cromos.html: hoja A4 lista para imprimir, cortar y pegar
 *      OCULTO en cada stand.
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
const OUT_DIR = path.join(ROOT, "assets", "cromos");
const OUT_HTML = path.join(ROOT, "qr-cromos.html");

const STAND_FILES = ["stand01.js", "stand02.js", "stand03.js", "stand04.js", "stand05.js"];

// Lee la info del stand y de su cromo desde el módulo fuente (mismo dato que usa la app)
function readStand(file) {
  const src = fs.readFileSync(path.join(STANDS_DIR, file), "utf8");

  const standName = (src.match(/name:\s*"([^"]+)"/) || [])[1] || "Stand";
  const num = (src.match(/num:\s*"(\d+)"/) || [])[1] || "";

  const block = src.match(/cromo:\s*\{([\s\S]*?)\n\s*\}/);
  if (!block) return null;

  const pick = (key) => {
    const m = block[1].match(new RegExp(key + ':\\s*"([^"]+)"'));
    return m ? m[1] : "";
  };

  const code = pick("code");
  if (!code) return null;

  return { file, num, standName, code, name: pick("name"), rarity: pick("rarity"), hint: pick("hint") };
}

function escapeHtml(v) {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function main() {
  const cromos = STAND_FILES.map(readStand).filter(Boolean);

  if (!cromos.length) {
    console.error("✖ No se encontró ningún cromo en src/js/views/stands/standXX.js");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // 1) PNG de cada QR (alto nivel de corrección de errores: se lee aunque esté rayado o torcido)
  for (const c of cromos) {
    const pngPath = path.join(OUT_DIR, `${c.code}.png`);
    await QRCode.toFile(pngPath, c.code, {
      type: "png",
      width: 900,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#0f2742ff", light: "#ffffffff" }
    });
    const kb = (fs.statSync(pngPath).size / 1024).toFixed(1);
    console.log(`✔ ${c.code}.png  (${kb} KB)  → ${c.name}`);
  }

  // 2) Hoja imprimible con guías de corte
  const cards = cromos
    .map(
      (c) => `
      <div class="card">
        <div class="qr-wrap">
          <img src="./assets/cromos/${c.code}.png" alt="QR ${escapeHtml(c.code)}" />
        </div>
        <div class="meta">
          <span class="code">${escapeHtml(c.code)}</span>
          <h3>${escapeHtml(c.name)}</h3>
          <p class="stand">Stand ${escapeHtml(c.num)} · ${escapeHtml(c.standName)}</p>
          <p class="rarity">Rareza ${escapeHtml(c.rarity)}</p>
          <p class="hint">Pista: ${escapeHtml(c.hint)}</p>
        </div>
      </div>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QR de cromos secretos · INNOVATECH</title>
  <!-- ARCHIVO GENERADO POR "npm run qr:cromos" - NO EDITAR A MANO -->
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
      <h1>QR de cromos secretos · ${cromos.length} stands</h1>
      <p>Imprimí, cortá por la línea punteada y pegá cada QR <b>oculto</b> en su stand.<br />
      Usá impresión al 100% (sin ajustar a página) y buen contraste: la cámara del celular debe leerlo desde ~30 cm.</p>
    </div>
    <button onclick="window.print()">🖨️ Imprimir hoja</button>
  </div>

  <div class="sheet">
    ${cards}
  </div>
</body>
</html>
`;

  fs.writeFileSync(OUT_HTML, html, "utf8");

  console.log("");
  console.log(`✔ ${cromos.length} QR generados en assets/cromos/`);
  console.log(`✔ Hoja imprimible: qr-cromos.html`);
  console.log("");
  console.log("Recordá: el código del QR debe ser EXACTAMENTE el que aparece en la tarjeta");
  console.log("(la app valida por el texto del QR, no por la imagen).");
}

main().catch((err) => {
  console.error("✖ Error generando los QR:", err.message);
  process.exit(1);
});
