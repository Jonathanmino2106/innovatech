/**
 * INNOVATECH - Enrutador Central y Orquestador de Estado con Supabase
 * - Login Obligatorio: Si no hay usuario en localStorage, fuerza la vista 'crea-pasaporte'.
 * - Persistencia dual en Supabase ('usuarios' y 'visitas_estaciones') y localStorage.
 * - Navegación fluida por 'home1', 'crea-pasaporte', 'map', 'qr', 'passport', 'ranks' y los 5 stands.
 */

import { supabase } from './supabaseClient.js';
import { createHeader, createBottomNavbar } from '../components/navbar.js';
import { createCreaPasaporteView } from './views/loginView.js';
import { createHomeView } from './views/homeView.js';
import { createMapView } from './views/mapView.js';
import { createQrView } from './views/qrView.js';
import { createPassportView } from './views/passportView.js';
import { createRanksView } from './views/ranksView.js';

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
      stamps: {}  // { "stand-01": { unlocked: true, unlockedAt: "..." } }
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
      } catch (e) {
        console.error("Error al cargar localStorage:", e);
        this.state.user = null;
        this.state.stamps = {};
      }
    }
  }

  // Guardado en localStorage
  saveLocalState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  // Crear usuario en Supabase (tabla usuarios) y guardar en localStorage
  async createSession(nickname, grade = "") {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const codigo_pasaporte = `FT26-${randomDigits}`;

    const newUserPayload = {
      nickname: nickname.trim(),
      codigo_pasaporte,
      rango_actual: "Visitante",
      progreso: 0,
      creado_en: new Date().toISOString()
    };

    let savedUser = null;

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([newUserPayload])
        .select()
        .single();

      if (error) {
        console.warn("Aviso Supabase usuarios insert:", error.message);
        // Fallback robusto con ID generado localmente si hubiera restricción RLS
        savedUser = { id: `local-${Date.now()}`, ...newUserPayload, passportCode: codigo_pasaporte };
      } else {
        savedUser = { ...data, passportCode: data.codigo_pasaporte };
      }
    } catch (e) {
      console.warn("Error de conexión con Supabase:", e);
      savedUser = { id: `local-${Date.now()}`, ...newUserPayload, passportCode: codigo_pasaporte };
    }

    this.state.user = savedUser;
    this.state.stamps = {};
    this.saveLocalState();
    this.showToast(`¡Pasaporte creado: ${savedUser.passportCode}!`);
    return this.state.user;
  }

  // Restaurar usuario existente por código desde Supabase o localStorage
  async restoreSession(code) {
    const cleanCode = code.trim().toUpperCase();

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('codigo_pasaporte', cleanCode)
        .maybeSingle();

      if (data && !error) {
        this.state.user = { ...data, passportCode: data.codigo_pasaporte };
        await this.loadVisitsFromSupabase(data.id);
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
      const parsed = JSON.parse(localRaw);
      if (parsed.user && (parsed.user.codigo_pasaporte === cleanCode || parsed.user.passportCode === cleanCode)) {
        this.state.user = parsed.user;
        this.state.stamps = parsed.stamps || {};
        this.saveLocalState();
        this.showToast(`Bienvenido, ${this.state.user.nickname}`);
        return true;
      }
    }

    // Fallback creando sesión con dicho código
    return await this.createSession(`Visitante ${cleanCode.slice(-4)}`);
  }

  // Sincronizar visitas desde Supabase
  async syncWithSupabase() {
    if (!this.state.user || !this.state.user.id) return;
    try {
      await this.loadVisitsFromSupabase(this.state.user.id);
    } catch (e) {
      console.warn("Sincronización diferida:", e);
    }
  }

  // Cargar visitas registradas de la tabla visitas_estaciones
  async loadVisitsFromSupabase(userId) {
    if (!userId || String(userId).startsWith("local-")) return;

    try {
      const { data, error } = await supabase
        .from('visitas_estaciones')
        .select('*')
        .eq('usuario_id', userId);

      if (data && !error) {
        data.forEach(v => {
          // Identificar el stand correspondiente por código o id
          const standObj = this.standsList.find(s => s.id === v.stand_id || s.code === v.stand_id);
          const key = standObj ? standObj.id : v.stand_id;
          this.state.stamps[key] = {
            unlocked: true,
            triviaCorrecta: v.trivia_correcta,
            unlockedAt: v.fecha_visita
          };
        });
        this.saveLocalState();
      }
    } catch (e) {
      console.warn("Aviso al consultar visitas_estaciones:", e);
    }
  }

  // Registrar un sello obtenido (en Supabase y localStorage)
  async unlockStamp(standId, tipoIngreso = 'manual', triviaCorrecta = true) {
    if (this.state.stamps[standId]) return false;

    const stampData = {
      unlocked: true,
      triviaCorrecta,
      unlockedAt: new Date().toISOString()
    };

    this.state.stamps[standId] = stampData;
    this.saveLocalState();

    // Calcular progreso
    const total = this.standsList.length;
    const completed = this.getCompletedCount();
    const progreso = Math.round((completed / total) * 100);

    let rango_actual = "Visitante";
    if (progreso >= 100) rango_actual = "Visionario";
    else if (progreso >= 80) rango_actual = "Pionero";
    else if (progreso >= 40) rango_actual = "Descubridor";
    else if (progreso >= 20) rango_actual = "Explorador";

    if (this.state.user) {
      this.state.user.progreso = progreso;
      this.state.user.rango_actual = rango_actual;
      this.saveLocalState();
    }

    // Persistir visita en Supabase si el usuario tiene ID
    if (this.state.user && this.state.user.id && !String(this.state.user.id).startsWith("local-")) {
      try {
        await supabase
          .from('visitas_estaciones')
          .insert([{
            usuario_id: this.state.user.id,
            stand_id: standId,
            tipo_ingreso: tipoIngreso,
            trivia_correcta: triviaCorrecta,
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

  getCompletedCount() {
    return Object.keys(this.state.stamps).filter(k => this.state.stamps[k]?.unlocked).length;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.state.user = null;
    this.state.stamps = {};
    this.showToast("Sesión cerrada.");
  }

  navigate(route) {
    // Si no hay usuario y se intenta navegar a una vista protegida, redirigir a 'crea-pasaporte'
    if (!this.state.user && route !== "crea-pasaporte") {
      this.currentRoute = "crea-pasaporte";
    } else {
      this.currentRoute = route;
    }
    this.render();
  }

  navigateQr(standId) {
    this.qrTargetStandId = standId;
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
      viewElement = createQrView(this, this.qrTargetStandId);
    } else if (this.currentRoute === "passport") {
      viewElement = createPassportView(this);
    } else if (this.currentRoute === "ranks") {
      viewElement = createRanksView(this);
    } else if (this.standsMap[this.currentRoute]) {
      viewElement = this.standsMap[this.currentRoute].render(this);
    } else {
      viewElement = this.state.user ? createHomeView(this) : createCreaPasaporteView(this);
    }

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
