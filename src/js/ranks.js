/**
 * INNOVATECH - Módulo Único de Verdad de Rangos (Gamificación)
 * Toda la app (home, pasaporte, rangos y lógica de sello) debe calcular
 * el rango usando estas funciones para evitar inconsistencias.
 *
 * Escala por cantidad de sellos (5 stands en total):
 * 0 → Visitante | 1 → Explorador | 2 → Descubridor | 3 → Pionero | 5 → Visionario
 */

export const RANKS_DATA = [
  { minStamps: 0, title: "VISITANTE", desc: "Recién empieza tu recorrido." },
  { minStamps: 1, title: "EXPLORADOR", desc: "Ya descubriste nuevas ideas en la feria." },
  { minStamps: 2, title: "DESCUBRIDOR", desc: "Tu curiosidad te está llevando lejos." },
  { minStamps: 3, title: "PIONERO", desc: "Casi completaste toda la feria de robótica." },
  { minStamps: 5, title: "VISIONARIO", desc: "Exploraste los 5 stands como una persona visionaria." }
];

/** Devuelve el objeto de rango vigente según los sellos completados. */
export function getCurrentRank(completed) {
  let current = RANKS_DATA[0];
  for (const rank of RANKS_DATA) {
    if (completed >= rank.minStamps) current = rank;
  }
  return current;
}

/** Devuelve solo el título del rango (ej. "PIONERO"). */
export function getRankTitle(completed) {
  return getCurrentRank(completed).title;
}

/** Indica si un rango específico ya fue desbloqueado. */
export function isRankUnlocked(rank, completed) {
  return completed >= rank.minStamps;
}
