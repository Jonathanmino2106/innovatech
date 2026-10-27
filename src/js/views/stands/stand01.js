/**
 * INNOVARTECH - Stand 01: Game Zone
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_01_INFO = {
  id: "stand-01",
  code: "STAND01",
  num: "01",
  name: "Game Zone",
  category: "Videojuegos y programación · 6.º año",
  badgeLabel: "STAND 01 · ESPECIAL",
  location: "Entrada / Detrás de la capilla / Sala de informática",
  mapCoords: { x: 30, y: 58 },
  description: "Videojuegos desarrollados por los estudiantes de 6.º año: creatividad, diseño, lógica y programación que se transforman en experiencias interactivas.",
  // Texto completo (según bienvenida InnovartTech GameZone): se muestra en la página del stand
  about: [
    "¡Donde la programación se convierte en diversión!",
    "¿Te imaginás crear tu propio videojuego? Los estudiantes de 6.º año, desde el espacio de Base de Datos y Entorno de Programación, presentan videojuegos desarrollados por ellos mismos. Cada proyecto combina creatividad, diseño, pensamiento lógico y programación para transformar ideas en experiencias interactivas.",
    "¡Te invitamos a explorar, jugar y descubrir el talento de nuestros futuros desarrolladores!",
    "¡Entrá, elegí tu juego y disfrutá la experiencia InnovartTech!"
  ],
  // Misión secreta: cromo escondido en esta estación (pista editable por el organizador)
  cromo: {
    code: "CROMO01",
    name: "Mano Biónica",
    rarity: "Épica",
    hint: "Está escondido en algún rincón del stand Game Zone: mirá bien antes de irte."
  }
};

export function renderStand01(app) {
  return createStandView(app, STAND_01_INFO);
}
