/**
 * INNOVARTECH - Stand 04: InnovartTech RoboLab
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_04_INFO = {
  id: "stand-04",
  code: "STAND04",
  num: "04",
  name: "InnovartTech RoboLab",
  category: "Robótica y programación Arduino · 3.º y 4.º año",
  badgeLabel: "STAND 04 · ROBOLAB",
  location: "Edificio Secundaria / Aula 4",
  mapCoords: { x: 86, y: 56 },
  description: "Proyectos que integran robótica, electrónica y programación con Arduino por estudiantes de 3.º y 4.º año: semáforos inteligentes, barreras, ascensores, autos y bastones de asistencia.",
  // Texto completo (según bienvenida InnovartTech RoboLab): se muestra en la página del stand
  about: [
    "¡De las ideas a la acción: cuando la tecnología cobra vida!",
    "¿Cómo logramos que una máquina detecte obstáculos, responda a sensores o realice acciones automáticamente? Los estudiantes de 3.º y 4.º año presentan proyectos que integran robótica, electrónica y programación con Arduino.",
    "Descubrí semáforos inteligentes, barreras de peaje, cestos automatizados, ascensores, autos que esquivan obstáculos y bastones tecnológicos de asistencia para personas con discapacidad visual.",
    "Cada creación es el resultado de investigar, programar, construir y resolver desafíos. ¡Explorá los prototipos y descubrí cómo funcionan!",
    "¡En RoboLab, las ideas se programan y la innovación cobra vida!"
  ],
  // Formulario de feedback de la muestra (Google Forms)
  formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd2J0J_bz5TsYTifeAO_0o19unn4owzyswbpjMIcSphXs9Ong/viewform",
  // Misión secreta: cromo escondido en esta estación (pista editable por el organizador)
  cromo: {
    code: "CROMO04",
    name: "Pierna Servo",
    rarity: "Lendaria",
    hint: "Está escondido en algún rincón del stand RoboLab: mirá bien antes de irte."
  }
};

export function renderStand04(app) {
  return createStandView(app, STAND_04_INFO);
}
