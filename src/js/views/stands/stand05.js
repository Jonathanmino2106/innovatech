/**
 * INNOVARTECH - Stand 05: Exoesqueletos & Robótica Médica
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_05_INFO = {
  id: "stand-05",
  code: "STAND05",
  num: "05",
  name: "Exoesqueletos & Robótica Médica",
  category: "Biónica · Ala Médica Central",
  badgeLabel: "STAND 05 · BIOMEDICINA",
  location: "Pabellón Central / Ala Médica Biónica",
  mapCoords: { x: 50, y: 35 },
  description: "Estructuras biónicas de asistencia muscular motorizadas mediante señales electromiográficas (EMG) dérmicas.",
  // Misión secreta: cromo escondido en esta estación (pista editable por el organizador)
  cromo: {
    code: "CROMO05",
    name: "Sensor EMG",
    rarity: "Mítica",
    hint: "El cromo siente tus impulsos: está pegado al respaldo de la silla del exoesqueleto, del lado izquierdo."
  }
};

export function renderStand05(app) {
  return createStandView(app, STAND_05_INFO);
}
