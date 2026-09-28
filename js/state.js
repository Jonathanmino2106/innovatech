/**
 * INNOVATECH - PASAPORTE.26
 * Manejo de Estado Local con persistencia en LocalStorage
 */

const STORAGE_KEY = "innovatech_pasaporte_session";

export const State = {
  user: null, // { nickname, grade, passportCode, createdAt }
  stamps: {}, // { "stand-01": { unlocked: true, unlockedAt: "..." } }

  init() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.user = parsed.user || null;
        this.stamps = parsed.stamps || {};
      } catch (e) {
        console.error("Error al cargar sesión local:", e);
        this.user = null;
        this.stamps = {};
      }
    }
  },

  createPassport(nickname, grade = "") {
    // Generar formato FT26-XXXX tal como en el diseño (ej: FT26-2470)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const passportCode = `FT26-${randomDigits}`;

    this.user = {
      nickname: nickname.trim(),
      grade: grade.trim(),
      passportCode,
      createdAt: new Date().toISOString()
    };
    this.stamps = {};
    this.save();
    return this.user;
  },

  restorePassport(code) {
    const cleanCode = code.trim().toUpperCase();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.user && parsed.user.passportCode === cleanCode) {
        this.user = parsed.user;
        this.stamps = parsed.stamps || {};
        this.save();
        return true;
      }
    }
    this.user = {
      nickname: cleanCode.replace(/[^A-Za-z0-9]/g, '').slice(-4) || 'Visitante',
      grade: "",
      passportCode: cleanCode,
      createdAt: new Date().toISOString()
    };
    this.stamps = {};
    this.save();
    return true;
  },

  unlockStamp(standId) {
    if (!this.stamps[standId]) {
      this.stamps[standId] = {
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };
      this.save();
      return true;
    }
    return false;
  },

  isStandCompleted(standId) {
    return !!(this.stamps[standId] && this.stamps[standId].unlocked);
  },

  getCompletedCount() {
    return Object.keys(this.stamps).filter(k => this.stamps[k] && this.stamps[k].unlocked).length;
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: this.user,
      stamps: this.stamps
    }));
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.user = null;
    this.stamps = {};
  }
};
