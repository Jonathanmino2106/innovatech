/**
 * INNOVARTECH - Stand 03: Robots Móviles & Vehículos Autónomos (AGV/AMR)
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_03_INFO = {
  id: "stand-03",
  code: "STAND03",
  num: "03",
  name: "Robots Móviles & Vehículos Autónomos (AGV)",
  category: "Logística Autónoma · Pabellón B",
  badgeLabel: "STAND 03 · FLOTAS INTELIGENTES",
  location: "Pabellón B / Zona Logística Central",
  mapCoords: { x: 86, y: 87 },
  description: "Plataformas robóticas móviles omnidireccionales para almacenes automatizados y esquiva dinámica de peatones.",
  // Misión secreta: cromo escondido en esta estación (pista editable por el organizador)
  cromo: {
    code: "CROMO03",
    name: "Rueda Omnidireccional",
    rarity: "Común",
    hint: "Seguí la línea marcada en el suelo: el cromo espera al final del carril del AGV, pegado a la estantería."
  }
};

export function renderStand03(app) {
  return createStandView(app, STAND_03_INFO);
}
