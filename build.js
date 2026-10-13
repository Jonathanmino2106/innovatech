/**
 * INNOVATECH - Build Script de Variables de Entorno
 * Genera src/js/config.js a partir de .env (local) o process.env (Vercel).
 * Así las credenciales de Supabase NUNCA quedan hardcodeadas en el código fuente.
 *
 * Local:      npm run build   (lee ./env)
 * Vercel:     npm run build   (lee las Environment Variables del panel de Vercel)
 */
const fs = require("fs");
const path = require("path");

const ENV_PATH = path.join(__dirname, ".env");
const CONFIG_PATH = path.join(__dirname, "src", "js", "config.js");

// 1. Leer .env si existe (desarrollo local)
function loadLocalEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const env = {};
  fs.readFileSync(ENV_PATH, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      // Quitar comillas envolventes si las hay
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    });
  return env;
}

const localEnv = loadLocalEnv();

// process.env (Vercel) tiene prioridad sobre .env local
let SUPABASE_URL = process.env.SUPABASE_URL || localEnv.SUPABASE_URL || "";
let SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || localEnv.SUPABASE_ANON_KEY || "";

// 2. Rechazar plantillas sin completar (.env.example copiado tal cual):
//    si no, un "copy .env.example .env" sin editar pisaría las credenciales
//    válidas con el placeholder y Supabase dejaría de responder.
const PLACEHOLDER_RE = /TU[-_](PROYECTO|CLAVE)/i;
const esPlantilla =
  PLACEHOLDER_RE.test(SUPABASE_URL) ||
  PLACEHOLDER_RE.test(SUPABASE_ANON_KEY) ||
  !/^https:\/\/[^\s]+\.supabase\.co\/?$/i.test(SUPABASE_URL);
if (esPlantilla && (SUPABASE_URL || SUPABASE_ANON_KEY)) {
  console.warn("⚠ .env con valores de plantilla sin completar: se ignoran.");
  SUPABASE_URL = "";
  SUPABASE_ANON_KEY = "";
}

// 3. Si NO hay credenciales disponibles pero el config.js existente ya las
//    trae (p. ej. un clon nuevo de GitHub, que lo incluye), NO se pisa:
//    sin este guardas, `npm run dev` borraría las credenciales válidas y la
//    app caería en modo solo-local sin que se entienda por qué.
if ((!SUPABASE_URL || !SUPABASE_ANON_KEY) && fs.existsSync(CONFIG_PATH)) {
  const actual = fs.readFileSync(CONFIG_PATH, "utf8");
  if (actual.includes("SUPABASE_CONFIGURED = true")) {
    console.log(
      "✔ Se conserva el src/js/config.js existente (ya tiene credenciales de Supabase)."
    );
    console.log(
      "  Para moverte de PC no hace falta nada más: clonar e instalar alcanza."
    );
    process.exit(0);
  }
}

// 4. Generar src/js/config.js (valores escapados de forma segura)
const content = `/**
 * ARCHIVO GENERADO AUTOMÁTICAMENTE POR build.js - NO EDITAR A MANO.
 * Fuente de verdad: variables de entorno (.env local o Vercel Environment Variables).
 */
export const SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
export const SUPABASE_ANON_KEY = ${JSON.stringify(SUPABASE_ANON_KEY)};
export const SUPABASE_CONFIGURED = ${SUPABASE_URL && SUPABASE_ANON_KEY ? "true" : "false"};
`;

fs.writeFileSync(CONFIG_PATH, content, "utf8");

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  console.log("✔ config.js generado con credenciales de Supabase.");
} else {
  console.warn(
    "⚠ config.js generado SIN credenciales: define SUPABASE_URL y SUPABASE_ANON_KEY en .env (local) o en el panel de Vercel."
  );
  console.warn("  La app funcionará en modo solo-local (localStorage) hasta configurarlas.");
}
