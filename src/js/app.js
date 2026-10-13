/**
 * INNOVATECH - Enrutador Central y Orquestador de Estado con Supabase
 * - Login Obligatorio: Si no hay usuario en localStorage, fuerza la vista 'crea-pasaporte'.
 * - Persistencia dual en Supabase ('usuarios' y 'visitas_estaciones') y localStorage.
 * - Navegación fluida por 'home1', 'crea-pasaporte', 'map', 'qr', 'passport', 'ranks' y los 5 stands.
 */

import { supabase } from './supabaseClient.js';
import { getRankTitle } from './ranks.js';
import { createHeader, createBottomNavbar } from '../components/navbar.js';
import { createCreaPasaporteView } from './views/loginView.js';
import { createHomeView } from './views/homeView.js';
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

const STORAGE_KEY = "innovatech_session_v2";

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
    // Si ya existe, ingresa directo a 'home1' y sincroniza datos con Supabase.
    if (this.state.user && this.state.user.id) {
      await this.syncWithSupabase();
      this.navigate("home1");
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
        await this.loadVisitsFromSupabase(data.id);
        await this.loadChromesFromSupabase(data.id);
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
    if (!this.state.user || !this.state.user.id) return;
    try {
      await this.loadVisitsFromSupabase(this.state.user.id);
      await this.loadChromesFromSupabase(this.state.user.id);
    } catch (e) {
      console.warn("Sincronización diferida:", e);
    }
  }

  // Cargar visitas registradas de la tabla visitas_estaciones
  async loadVisitsFromSupabase(userId) {
    if (!supabase || !userId || String(userId).startsWith("local-")) return;

    try {
      const { data, error } = await supabase
        .from('visitas_estaciones')
        .select('*')
        .eq('usuario_id', userId);

      if (data && !error) {
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
      }
    } catch (e) {
      console.warn("Aviso al consultar visitas_estaciones:", e);
    }
  }

  // Cargar cromos secretos encontrados (tabla cromos_secretos)
  async loadChromesFromSupabase(userId) {
    if (!supabase || !userId || String(userId).startsWith("local-")) return;

    try {
      const { data, error } = await supabase
        .from('cromos_secretos')
        .select('*')
        .eq('usuario_id', userId);

      if (data && !error) {
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
      }
    } catch (e) {
      console.warn("Aviso al consultar cromos_secretos:", e);
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

      if (supabase && this.state.user && this.state.user.id && !String(this.state.user.id).startsWith("local-")) {
        const standObj = this.standsList.find(s => s.id === standId);
        try {
          await supabase
            .from('cromos_secretos')
            .update({ metodo_ingreso: 'qr' })
            .eq('usuario_id', this.state.user.id)
            .eq('stand_codigo', standObj ? standObj.code : standId);
        } catch (e) {
          console.warn("Aviso al actualizar metodo_ingreso del cromo:", e);
        }
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
    if (supabase && this.state.user && this.state.user.id && !String(this.state.user.id).startsWith("local-")) {
      const standObj = this.standsList.find(s => s.id === standId);
      try {
        await supabase
          .from('cromos_secretos')
          .insert([{
            usuario_id: this.state.user.id,
            stand_codigo: standObj ? standObj.code : standId,
            metodo_ingreso: metodo,
            fecha_encuentro: chromeData.foundAt
          }]);
      } catch (e) {
        console.warn("Aviso al persistir cromo en Supabase:", e);
      }
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

      if (supabase && this.state.user && this.state.user.id && !String(this.state.user.id).startsWith("local-")) {
        const standObj = this.standsList.find(s => s.id === standId);
        try {
          await supabase
            .from('visitas_estaciones')
            .update({ metodo_ingreso: 'qr' })
            .eq('usuario_id', this.state.user.id)
            .eq('stand_codigo', standObj ? standObj.code : standId);
        } catch (e) {
          console.warn("Aviso al actualizar metodo_ingreso:", e);
        }
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
    if (supabase && this.state.user && this.state.user.id && !String(this.state.user.id).startsWith("local-")) {
      // El stand viaja por su código único (FK a stands.id_stand, ej. STAND01)
      const standObj = this.standsList.find(s => s.id === standId);

      try {
        await supabase
          .from('visitas_estaciones')
          .insert([{
            usuario_id: this.state.user.id,
            stand_codigo: standObj ? standObj.code : standId,
            metodo_ingreso: metodo,
            fecha_visita: stampData.unlockedAt
          }]);

        await supabase
          .from('usuarios')
          .update({ progreso, rango_actual })
          .eq('id', this.state.user.id);

      } catch (e) {
        console.warn("Aviso al persistir en Supabase:", e);
      }
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

    if (supabase && this.state.user && this.state.user.id && !String(this.state.user.id).startsWith("local-")) {
      const standObj = this.standsList.find(s => s.id === standId);
      try {
        await supabase
          .from('visitas_estaciones')
          .update({ valoracion: stars })
          .eq('usuario_id', this.state.user.id)
          .eq('stand_codigo', standObj ? standObj.code : standId);
      } catch (e) {
        console.warn("Aviso al persistir valoración:", e);
      }
    }

    this.showToast(`Valoración guardada: ${stars}/5`);
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
    } else if (this.currentRoute === "home1" || this.currentRoute === "home") {
      viewElement = createHomeView(this);
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
      viewElement = this.state.user ? createHomeView(this) : createCreaPasaporteView(this);
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
