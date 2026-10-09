/**
 * INNOVATECH - Stand 04: Robots Humanoides & Locomoción Bípeda
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_04_INFO = {
  id: "stand-04",
  code: "STAND04",
  num: "04",
  name: "Robots Humanoides & Locomoción Bípeda",
  category: "Bípedos · Arena de Pruebas",
  badgeLabel: "STAND 04 · HUMANOIDES",
  location: "Pabellón B / Arena de Pruebas",
  mapCoords: { x: 19, y: 70 },
  description: "Robots de silueta humana capaces de caminar sobre terrenos irregulares y mantener equilibrio frente a empujes dinámicos."
};

export function renderStand04(app) {
  return createStandView(app, STAND_04_INFO);
}
