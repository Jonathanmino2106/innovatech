/**
 * INNOVARTECH - Stand 01: Robótica Industrial & Brazos Articulados
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_01_INFO = {
  id: "stand-01",
  code: "STAND01",
  num: "01",
  name: "Robótica Industrial & Brazos Articulados",
  category: "Robótica · Laboratorio de Tecnología",
  badgeLabel: "STAND 01 · ESPECIAL",
  location: "Entrada / Patio central / Laboratorio de Tecnología",
  mapCoords: { x: 30, y: 58 },
  description: "Experimentá con robots, sensores y sistemas de inteligencia artificial.",
  // Misión secreta: cromo escondido en esta estación (pista editable por el organizador)
  cromo: {
    code: "CROMO01",
    name: "Mano Biónica",
    rarity: "Épica",
    hint: "No está montado en el brazo articulado: mirá debajo de la mesa del stand, donde se apoya el panel de control."
  }
};

export function renderStand01(app) {
  return createStandView(app, STAND_01_INFO);
}
