/**
 * INNOVARTECH - Enrutador Central y Orquestador de Estado con Supabase
 * - Login Obligatorio: Si no hay usuario en localStorage, fuerza la vista 'crea-pasaporte'.
 * - Persistencia dual en Supabase ('usuarios' y 'visitas_estaciones') y localStorage.
 * - Navegación fluida por 'inicio', 'recorrido', 'crea-pasaporte', 'map', 'qr', 'passport', 'ranks' y los 5 stands.
 */

import { supabase } from './supabaseClient.js';
import { getRankTitle } from './ranks.js';
import { createHeader, createBottomNavbar } from '../components/navbar.js';
import { showRutaCompletaModal } from '../components/rutaCompleta.js';
import { createCreaPasaporteView } from './views/loginView.js';
import { createInicioView } from './views/inicioView.js';
import { createRecorridoView } from './views/recorridoView.js';
import { createMapView } from './views/mapView.js';
import { createQrView } from './views/qrView.js';
import { createPassportView } from './views/passportView.js';
import { createRanksView } from './views/ranksView.js';
import { createStatsView } from './views/statsView.js';

import { STAND_01_INFO, renderStand01 } from './views/stands/stand01.js';
import { STAND_02_INFO, renderStand02 } from './views/stands/stand02.js';
import { STAND_03_INFO, renderStand03 } from './views/stands/stand03.js';
import { STAND_04_INFO, renderStand04 } from './views/stands/stand04.js';
import { STAND_05_INFO, renderStand05 } from './views/stands/stand05.js';

const STORAGE_KEY = "innovartech_session_v2";

// ---- Helpers de sesión / ids ----------------------------------------------
// En JS el número 0 es FALSY: validar ids con truthiness (`if (user.id)`)
// rompió la app cuando Supabase devolvió id=0 (la sesión se borraba al
// recargar y los sellos/estampas jamás se persistían). Siempre comparar
// explícitamente contra null/undefined.
function hasSession(user) {
  return !!user && user.id !== null && user.id !== undefined && user.id !== "";
}
// id que se persiste en Supabase: cualquier id no-local ("local-*" = solo dispositivo).
function isCloudId(id) {
  return id !== null && id !== undefined && id !== "" && !String(id).startsWith("local-");
}
function hasCloudUser(user) {
  return !!user && isCloudId(user.id);
}

class AppRouter {
  constructor() {
    this.appRoot = document.getElementById("app");
    this.currentRoute = "crea-pasaporte";
    this.qrTargetStandId = null;
    this.qrMode = "sello"; // 'sello' (validar stand) | 'cromo' (misión secreta)

    // Catálogo unificado de los 5 stands provistos por sus propios módulos
    this.standsMap = {
      "stand-01": { info: STAND_01_INFO, render: renderStand01 },
      "stand-02": { info: STAND_02_INFO, render: renderStand02 },
      "stand-03": { info: STAND_03_INFO, render: renderStand03 },
      "stand-04": { info: STAND_04_INFO, render: renderStand04 },
      "stand-05": { info: STAND_05_INFO, render: renderStand05 }
    };

    this.standsList = Object.values(this.standsMap).map(s => s.info);

    // Estado global de la sesión
    this.state = {
      user: null, // { id, nickname, codigo_pasaporte, rango_actual, progreso, creado_en }
      stamps: {}, // { "stand-01": { unlocked: true, unlockedAt: "..." } }
      cromos: {}  // { "stand-01": { found: true, metodoIngreso: "qr", foundAt: "..." } } (misión secreta)
    };

    this.init();
  }

  async init() {
    this.loadLocalState();

    // 2. Lógica de Autenticación Inicial Obligatoria:
    // Al ingresar por primera vez, el sistema NO asigna usuario por defecto.
    // Si no hay usuario guardado en localStorage, muestra 'crea-pasaporte'.
    // Si ya existe, ingresa directo a 'inicio' y sincroniza datos con Supabase.
    if (hasSession(this.state.user)) {
      await this.syncWithSupabase();
      this.navigate("inicio");
    } else {
      this.state.user = null;
      this.state.stamps = {};
      this.state.cromos = {};
      this.navigate("crea-pasaporte");
    }
  }

  // Carga de estado local
  loadLocalState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.state.user = parsed.user || null;
        this.state.stamps = parsed.stamps || {};
        this.state.cromos = parsed.cromos || {};
      } catch (e) {
        console.error("Error al cargar localStorage:", e);
        this.state.user = null;
        this.state.stamps = {};
        this.state.cromos = {};
      }
    }
  }

  // Guardado en localStorage
  saveLocalState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  // Escritura en Supabase con manejo de errores REAL.
  // supabase-js NO lanza excepciones: devuelve { error } en el resultado.
  // Antes los .insert()/.update() no se destructuraban y todo fallo
  // (RLS, FK, red caída) era invisible: el try/catch no veía nada.
  // `23505` (fila ya existente) se tolera: no es un fallo.
  // Devuelve true si se guardó en la nube.
  async cloudWrite(builder, scope) {
    try {
      const { error } = await builder;
      if (error && error.code !== '23505') throw new Error(error.message);
      return true;
    } catch (e) {
      console.error(`Supabase · ${scope}:`, e);
      this.showToast("No se pudo guardar en la nube · se mantiene en este dispositivo");
      return false;
    }
  }

  // "Jonathan Mino" → "jonathan-mino" | "José 26!" → "jose-26"
  // Minúsculas, sin tildes, espacios/especiales → guion, máx. 20 caracteres.
  slugifyCode(nickname) {
    const slug = String(nickname)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")   // quitar tildes/acentos
      .replace(/[^a-z0-9]+/g, "-")       // espacios y especiales → guion
      .replace(/^-+|-+$/g, "")
      .slice(0, 20)
      .replace(/-+$/g, "");
    return slug || "visitante";
  }

  // Siguiente número correlativo global (orden de registro).
  // Excluye los códigos legados FT26-#### para que la serie nueva empiece en 0001.
  async nextPassportNumber() {
    const { data, error } = await supabase.from('usuarios').select('codigo_pasaporte');
    if (error) throw new Error(error.message);
    let max = 0;
    (data || []).forEach((row) => {
      const code = String(row.codigo_pasaporte || "");
      if (/^ft26-/i.test(code)) return; // códigos antiguos no cuentan
      const m = /(\d+)$/.exec(code);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return max + 1;
  }

  // Crear usuario en Supabase (tabla usuarios) y guardar en localStorage
  // visitorType: 'Alumno' | 'Profesor' | 'Familiar' | 'Visitante' (columna tipo_visitante)
  // Código: slug-del-nickname-0001 (número correlativo de registro)
  async createSession(nickname, visitorType = "Visitante") {
    const slug = this.slugifyCode(nickname);

    const newUserPayload = {
      nickname: nickname.trim(),
      tipo_visitante: visitorType,
      codigo_pasaporte: `${slug}-0001`, // provisorio; se asigna en el bucle
      rango_actual: "Visitante",
      progreso: 0,
      fecha_creacion: new Date().toISOString()
    };

    let savedUser = null;

    if (!supabase) {
      savedUser = { id: `local-${Date.now()}`, ...newUserPayload, passportCode: newUserPayload.codigo_pasaporte };
      this.state.user = savedUser;
      this.state.stamps = {};
      this.state.cromos = {};
      this.saveLocalState();
      this.showToast(`Pasaporte local: ${newUserPayload.codigo_pasaporte} (sin nube)`);
      return this.state.user;
    }

    // Número correlativo en orden de registro
    let nextNum = 1;
    try {
      nextNum = await this.nextPassportNumber();
    } catch (e) {
      console.warn("No se pudo calcular el correlativo, uso 0001:", e.message);
    }

    // Insertar con reintento ante colisión (la BD garantiza UNIQUE con error 23505)
    for (let attempt = 0; attempt < 5; attempt++) {
      const codigo = `${slug}-${String(nextNum + attempt).padStart(4, "0")}`;
      newUserPayload.codigo_pasaporte = codigo;
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .insert([newUserPayload])
          .select()
          .single();

        if (!error) {
          savedUser = { ...data, passportCode: data.codigo_pasaporte };
          break;
        }
        if (error.code === '23505') {
          // Dos personas llegaron al mismo milisegundo: incremento y reintento
          console.warn(`Código ${codigo} duplicado, reintentando...`);
          continue;
        }
        console.warn("Aviso Supabase usuarios insert:", error.message);
        break; // otro error de BD → fallback local
      } catch (e) {
        console.warn("Error de conexión con Supabase:", e);
        break; // sin red → fallback local
      }
    }

    if (!savedUser) {
      // Fallback robusto con ID generado localmente (misma apariencia de código)
      savedUser = { id: `local-${Date.now()}`, ...newUserPayload, passportCode: newUserPayload.codigo_pasaporte };
      this.state.user = savedUser;
      this.state.stamps = {};
      this.state.cromos = {};
      this.saveLocalState();
      this.showToast(`Pasaporte local: ${savedUser.passportCode} (sin nube)`);
      return this.state.user;
    }

    this.state.user = savedUser;
    this.state.stamps = {};
    this.state.cromos = {};
    this.saveLocalState();
    this.showToast(`¡Pasaporte creado: ${savedUser.passportCode}!`);
    return this.state.user;
  }

  // Restaurar usuario existente por código desde Supabase o localStorage
  async restoreSession(code) {
    const cleanCode = code.trim();
    if (!cleanCode) return false;
    const norm = (v) => String(v || "").trim().toUpperCase();

    try {
      // ilike = sin distinguir mayúsculas/minúsculas:
      // cubre los nuevos códigos "kevin-0001" y los legados "FT26-8335"
      const escaped = cleanCode.replace(/([%_\\])/g, "\\$1");
      const { data, error } = supabase
        ? await supabase
            .from('usuarios')
            .select('*')
            .ilike('codigo_pasaporte', escaped)
            .maybeSingle()
        : { data: null, error: null };

      if (data && !error) {
        this.state.user = { ...data, passportCode: data.codigo_pasaporte };
        // syncWithSupabase carga visitas + cromos y sube lo que falte en la nube
        await this.syncWithSupabase();
        this.saveLocalState();
        this.showToast(`Bienvenido de vuelta, ${data.nickname}`);
        return true;
      }
    } catch (e) {
      console.warn("Error al buscar en Supabase:", e);
    }

    // Si coincide con el local anterior
    const localRaw = localStorage.getItem(STORAGE_KEY);
    if (localRaw) {
      try {
        const parsed = JSON.parse(localRaw);
        if (parsed.user && (norm(parsed.user.codigo_pasaporte) === norm(cleanCode) || norm(parsed.user.passportCode) === norm(cleanCode))) {
          this.state.user = parsed.user;
          this.state.stamps = parsed.stamps || {};
          this.state.cromos = parsed.cromos || {};
          this.saveLocalState();
          this.showToast(`Bienvenido, ${this.state.user.nickname}`);
          return true;
        }
      } catch (e) {
        console.warn("localStorage corrupto al restaurar:", e);
      }
    }

    // Código no encontrado en la nube ni en este dispositivo
    return false;
  }

  // Sincronizar visitas desde Supabase
  async syncWithSupabase() {
    if (!hasSession(this.state.user)) return;
    try {
      const visitRows = await this.loadVisitsFromSupabase(this.state.user.id);
      const cromoRows = await this.loadChromesFromSupabase(this.state.user.id);
      // Auto-reparado: si ambas lecturas fueron OK, subir a la nube los
      // sellos/estampas que existen en este dispositivo pero no en Supabase
      // (p. ej. registrados con la sesión rota anterior, cuando id=0 se
      // trataba como "sin nube"). Solo sube lo que FALTA (sin duplicar).
      if (Array.isArray(visitRows) && Array.isArray(cromoRows)) {
        await this.reconcileMissingRows(visitRows, cromoRows);
      }
    } catch (e) {
      console.warn("Sincronización diferida:", e);
    }
  }

  // Sube a la nube sellos/estampas locales ausentes en Supabase.
  // Nunca inserta filas que ya existen: se calcula la diferencia por código.
  async reconcileMissingRows(visitRows, cromoRows) {
    if (!supabase || !hasCloudUser(this.state.user)) return;

    const userId = this.state.user.id;
    const cloudVisits = new Set(visitRows.map(r => r.stand_codigo));
    const cloudCromos = new Set(cromoRows.map(r => r.stand_codigo));
    let failed = 0;

    for (const stand of this.standsList) {
      const stamp = this.state.stamps[stand.id];
      if (stamp && stamp.unlocked && !cloudVisits.has(stand.code)) {
        const ok = await this.cloudWrite(
          supabase
            .from('visitas_estaciones')
            .insert([{
              usuario_id: userId,
              stand_codigo: stand.code,
              metodo_ingreso: stamp.metodoIngreso === 'qr' ? 'qr' : 'manual',
              fecha_visita: stamp.unlockedAt || new Date().toISOString(),
              valoracion: stamp.valoracion ?? null
            }]),
          `sync visita ${stand.code}`
        );
        if (!ok) failed++;
      }

      const cromo = this.state.cromos[stand.id];
      if (cromo && cromo.found && !cloudCromos.has(stand.code)) {
        const ok = await this.cloudWrite(
          supabase
            .from('cromos_secretos')
            .insert([{
              usuario_id: userId,
              stand_codigo: stand.code,
              metodo_ingreso: cromo.metodoIngreso === 'qr' ? 'qr' : 'manual',
              fecha_encuentro: cromo.foundAt || new Date().toISOString()
            }]),
          `sync cromo ${stand.code}`
        );
        if (!ok) failed++;
      }
    }

    if (failed) {
      console.error(`Sync a nube: ${failed} fila(s) no pudieron subirse.`);
    }
  }

  // Cargar visitas registradas de la tabla visitas_estaciones.
  // Devuelve las filas leídas o null si no se pudo verificar (sin conexión,
  // error, sesión local): null hace que syncWithSupabase NO intente subir nada.
  async loadVisitsFromSupabase(userId) {
    if (!supabase || !isCloudId(userId)) return null;

    try {
      const { data, error } = await supabase
        .from('visitas_estaciones')
        .select('*')
        .eq('usuario_id', userId);

      if (error) {
        console.warn("Aviso al consultar visitas_estaciones:", error.message);
        return null;
      }
      if (data) {
        data.forEach(v => {
          // El stand se identifica por su código único (ej. STAND01)
          const standObj = this.standsList.find(s => s.code === v.stand_codigo);
          const key = standObj ? standObj.id : v.stand_codigo;
          this.state.stamps[key] = {
            unlocked: true,
            // Importante: preservar el método de ingreso (qr | manual), si no
            // toda sincronización borra el dato y las estadísticas lo muestran como 'manual'.
            metodoIngreso: v.metodo_ingreso || 'manual',
            valoracion: v.valoracion ?? null,
            unlockedAt: v.fecha_visita
          };
        });
        this.saveLocalState();
        return data;
      }
      return null;
    } catch (e) {
      console.warn("Aviso al consultar visitas_estaciones:", e);
      return null;
    }
  }

  // Cargar cromos secretos encontrados (tabla cromos_secretos).
  // Devuelve las filas leídas o null si no se pudo verificar (ver loadVisits).
  async loadChromesFromSupabase(userId) {
    if (!supabase || !isCloudId(userId)) return null;

    try {
      const { data, error } = await supabase
        .from('cromos_secretos')
        .select('*')
        .eq('usuario_id', userId);

      if (error) {
        console.warn("Aviso al consultar cromos_secretos:", error.message);
        return null;
      }
      if (data) {
        data.forEach(c => {
          // El stand se identifica por su código único (ej. STAND01)
          const standObj = this.standsList.find(s => s.code === c.stand_codigo);
          const key = standObj ? standObj.id : c.stand_codigo;
          this.state.cromos[key] = {
            found: true,
            metodoIngreso: c.metodo_ingreso || 'qr',
            foundAt: c.fecha_encuentro
          };
        });
        this.saveLocalState();
        return data;
      }
      return null;
    } catch (e) {
      console.warn("Aviso al consultar cromos_secretos:", e);
      return null;
    }
  }

  // Registrar un cromo secreto encontrado (misión secreta, no afecta progreso ni rango)
  // metodoIngreso: 'qr' | 'manual'
  // Igual que los sellos: si estaba en 'manual' y luego se escanea el QR real, se mejora a 'qr'.
  async unlockChrome(standId, metodoIngreso = 'manual') {
    const metodo = metodoIngreso === 'qr' ? 'qr' : 'manual';
    const existing = this.state.cromos[standId];

    if (existing) {
      if (!existing.found || metodo !== 'qr' || existing.metodoIngreso === 'qr') return false;

      existing.metodoIngreso = 'qr';
      this.saveLocalState();

      if (supabase && hasCloudUser(this.state.user)) {
        const standObj = this.standsList.find(s => s.id === standId);
        await this.cloudWrite(
          supabase
            .from('cromos_secretos')
            .update({ metodo_ingreso: 'qr' })
            .eq('usuario_id', this.state.user.id)
            .eq('stand_codigo', standObj ? standObj.code : standId),
          "update metodo_ingreso del cromo"
        );
      }
      return true;
    }

    const chromeData = {
      found: true,
      metodoIngreso: metodo,
      foundAt: new Date().toISOString()
    };

    this.state.cromos[standId] = chromeData;
    this.saveLocalState();

    // Persistir en Supabase si el usuario tiene ID real (no local)
    if (supabase && hasCloudUser(this.state.user)) {
      const standObj = this.standsList.find(s => s.id === standId);
      await this.cloudWrite(
        supabase
          .from('cromos_secretos')
          .insert([{
            usuario_id: this.state.user.id,
            stand_codigo: standObj ? standObj.code : standId,
            metodo_ingreso: metodo,
            fecha_encuentro: chromeData.foundAt
          }]),
        "insert cromo"
      );
    }

    return true;
  }

  isChromeFound(standId) {
    return !!(this.state.cromos[standId] && this.state.cromos[standId].found);
  }

  getChromeCount() {
    return Object.keys(this.state.cromos).filter(k => this.state.cromos[k]?.found).length;
  }

  // Registrar un sello obtenido (en Supabase y localStorage)
  // metodoIngreso: 'qr' | 'manual'  (columna metodo_ingreso de visitas_estaciones)
  // Si el sello ya existía en 'manual' y ahora llega un escaneo real de cámara,
  // se "mejora" el método a 'qr' y se corrige la fila en la nube.
  async unlockStamp(standId, metodoIngreso = 'manual') {
    const metodo = metodoIngreso === 'qr' ? 'qr' : 'manual';
    const existing = this.state.stamps[standId];

    if (existing) {
      // Ya sellado y no hay mejora de método → no se registra de nuevo
      if (!existing.unlocked || metodo !== 'qr' || existing.metodoIngreso === 'qr') return false;

      // Upgrade manual → qr (el visitante escaneó el QR físico de la estación)
      existing.metodoIngreso = 'qr';
      this.saveLocalState();

      if (supabase && hasCloudUser(this.state.user)) {
        const standObj = this.standsList.find(s => s.id === standId);
        await this.cloudWrite(
          supabase
            .from('visitas_estaciones')
            .update({ metodo_ingreso: 'qr' })
            .eq('usuario_id', this.state.user.id)
            .eq('stand_codigo', standObj ? standObj.code : standId),
          "update metodo_ingreso de la visita"
        );
      }
      return true;
    }

    const stampData = {
      unlocked: true,
      metodoIngreso: metodo,
      valoracion: null,
      unlockedAt: new Date().toISOString()
    };

    this.state.stamps[standId] = stampData;
    this.saveLocalState();

    // Calcular progreso y rango (módulo único de verdad: ranks.js)
    const total = this.standsList.length;
    const completed = this.getCompletedCount();
    const progreso = Math.round((completed / total) * 100);
    const rango_actual = getRankTitle(completed);

    if (this.state.user) {
      this.state.user.progreso = progreso;
      this.state.user.rango_actual = rango_actual;
      this.saveLocalState();
    }

    // Persistir visita en Supabase si el usuario tiene ID real (no local)
    if (supabase && hasCloudUser(this.state.user)) {
      // El stand viaja por su código único (FK a stands.id_stand, ej. STAND01)
      const standObj = this.standsList.find(s => s.id === standId);

      await this.cloudWrite(
        supabase
          .from('visitas_estaciones')
          .insert([{
            usuario_id: this.state.user.id,
            stand_codigo: standObj ? standObj.code : standId,
            metodo_ingreso: metodo,
            fecha_visita: stampData.unlockedAt
          }]),
        "insert visita"
      );

      await this.cloudWrite(
        supabase
          .from('usuarios')
          .update({ progreso, rango_actual })
          .eq('id', this.state.user.id),
        "update progreso/rango del usuario"
      );
    }

    // RUTA COMPLETA: al conseguir los 5 sellos se despliega el agradecimiento
    // con acceso al formulario de votación del mejor stand.
    if (this.getCompletedCount() === this.standsList.length) {
      showRutaCompletaModal();
    }

    return true;
  }

  isStandCompleted(standId) {
    return !!(this.state.stamps[standId] && this.state.stamps[standId].unlocked);
  }

  // Valorar una estación con 1-5 estrellas (columna valoracion de visitas_estaciones)
  async rateStamp(standId, stars) {
    const stamp = this.state.stamps[standId];
    if (!stamp || !stars || stars < 1 || stars > 5) return;

    stamp.valoracion = stars;
    this.saveLocalState();

    let cloudSaved = true;
    if (supabase && hasCloudUser(this.state.user)) {
      const standObj = this.standsList.find(s => s.id === standId);
      cloudSaved = await this.cloudWrite(
        supabase
          .from('visitas_estaciones')
          .update({ valoracion: stars })
          .eq('usuario_id', this.state.user.id)
          .eq('stand_codigo', standObj ? standObj.code : standId),
        "update valoración"
      );
    }

    // Si la nube falló, cloudWrite ya mostró el toast de error
    if (cloudSaved) this.showToast(`Valoración guardada: ${stars}/5`);
  }

  getCompletedCount() {
    return Object.keys(this.state.stamps).filter(k => this.state.stamps[k]?.unlocked).length;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.state.user = null;
    this.state.stamps = {};
    this.state.cromos = {};
    this.showToast("Sesión cerrada.");
  }

  navigate(route) {
    // Limpieza de la vista anterior (ej. detener el stream de la cámara QR)
    if (typeof this.viewCleanup === "function") {
      this.viewCleanup();
      this.viewCleanup = null;
    }

    // Si no hay usuario y se intenta navegar a una vista protegida, redirigir a 'crea-pasaporte'
    if (!this.state.user && route !== "crea-pasaporte") {
      this.currentRoute = "crea-pasaporte";
    } else {
      this.currentRoute = route;
    }
    this.render();
  }

  // navigateQr(standId)           → escaneo de sello (validación de stand)
  // navigateQr(standId, 'cromo')  → escaneo de cromo secreto (misión secreta)
  navigateQr(standId, mode = "sello") {
    this.qrTargetStandId = standId;
    this.qrMode = mode === "cromo" ? "cromo" : "sello";
    this.navigate("qr");
  }

  render() {
    this.appRoot.innerHTML = "";

    // 1. Header superior con logo corporativo
    const header = createHeader(this);
    this.appRoot.appendChild(header);

    // 2. Inyección de la vista correspondiente
    let viewElement = null;

    if (this.currentRoute === "crea-pasaporte") {
      viewElement = createCreaPasaporteView(this);
    } else if (this.currentRoute === "inicio") {
      // Portada de la feria: de qué trata, a qué está dedicada y galería del recorrido
      viewElement = createInicioView(this);
    } else if (this.currentRoute === "recorrido" || this.currentRoute === "home1" || this.currentRoute === "home") {
      // Panel de recorrido (la vista que antes era el inicio)
      viewElement = createRecorridoView(this);
    } else if (this.currentRoute === "map") {
      viewElement = createMapView(this);
    } else if (this.currentRoute === "qr") {
      viewElement = createQrView(this, this.qrTargetStandId, this.qrMode);
    } else if (this.currentRoute === "passport") {
      viewElement = createPassportView(this);
    } else if (this.currentRoute === "ranks") {
      viewElement = createRanksView(this);
    } else if (this.currentRoute === "stats") {
      viewElement = createStatsView(this);
    } else if (this.standsMap[this.currentRoute]) {
      viewElement = this.standsMap[this.currentRoute].render(this);
    } else {
      viewElement = this.state.user ? createInicioView(this) : createCreaPasaporteView(this);
    }

    // Clase común para el respiro inferior móvil (ver .app-view en styles.css)
    viewElement.classList.add("app-view");
    this.appRoot.appendChild(viewElement);

    // 3. Barra inferior de navegación sólo visible cuando ya existe usuario autenticado
    if (this.state.user && this.currentRoute !== "crea-pasaporte") {
      const bottomNav = createBottomNavbar(this);
      this.appRoot.appendChild(bottomNav);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showToast(message) {
    const toast = document.getElementById("global-toast");
    const msg = document.getElementById("global-toast-msg");
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.classList.remove("hidden");

    if (window.lucide) window.lucide.createIcons();

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 3200);
  }
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  new AppRouter();
});
