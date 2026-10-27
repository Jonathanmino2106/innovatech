/**
 * INNOVARTECH - Stand 02: Drones Autónomos & Visión Espacial
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_02_INFO = {
  id: "stand-02",
  code: "STAND02",
  num: "02",
  name: "Drones Autónomos & Visión Espacial",
  category: "Robótica Aérea · Zona de Vuelo",
  badgeLabel: "STAND 02 · AERO-ROBÓTICA",
  location: "Pabellón A / Zona de Vuelo Exterior",
  mapCoords: { x: 75, y: 63 },
  description: "Cuadricópteros con LiDAR y cámaras estereoscópicas capaces de navegar y esquivar obstáculos sin señal GPS.",
  // Misión secreta: cromo escondido en esta estación (pista editable por el organizador)
  cromo: {
    code: "CROMO02",
    name: "Ala de Carbono",
    rarity: "Rara",
    hint: "Los drones vuelan alto, pero la estampa no: está escondida en el piso de la zona de vuelo, detrás de la pista de aterrizaje."
  }
};

export function renderStand02(app) {
  return createStandView(app, STAND_02_INFO);
}
