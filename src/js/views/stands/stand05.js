/**
 * INNOVARTECH - Stand 05: InnovartTech MotionArt
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_05_INFO = {
  id: "stand-05",
  code: "STAND05",
  num: "05",
  name: "InnovartTech MotionArt",
  category: "Arte, movimiento e iniciación a la robótica · 1.º y 2.º año",
  badgeLabel: "STAND 05 · MOTIONART",
  location: "Edificio Secundaria / Aula 5",
  mapCoords: { x: 92, y: 76 },
  description: "Primeras experiencias de robótica, circuitos eléctricos, mecanismos y esculturas autómatas creadas por estudiantes de 1.º y 2.º año combinando creatividad, ciencia y movimiento.",
  // Texto completo (según bienvenida InnovartTech MotionArt): se muestra en la página del stand
  about: [
    "¡El arte y la tecnología en movimiento!",
    "¿Puede la física convertirse en arte? Los estudiantes de 1.º y 2.º año presentan sus primeras experiencias de robótica, circuitos eléctricos y mecanismos, junto con una exposición de esculturas autómatas creadas desde Educación Artística.",
    "A través de máquinas simples, como poleas, palancas y engranajes, combinan creatividad, ciencia y movimiento.",
    "¡Estas creaciones necesitan de vos para cobrar vida! Girá una manivela, accioná un mecanismo y descubrí cómo una idea se transforma en movimiento.",
    "¡En MotionArt, el arte no solo se observa, también se activa!"
  ],
  // Misión secreta: cromo escondido en esta estación (pista editable por el organizador)
  cromo: {
    code: "CROMO05",
    name: "Sensor EMG",
    rarity: "Mítica",
    hint: "Está escondido en algún rincón del stand MotionArt: mirá bien antes de irte."
  }
};

export function renderStand05(app) {
  return createStandView(app, STAND_05_INFO);
}
