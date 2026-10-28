/**
 * INNOVARTECH - Stand 02: InnovarTech en Escena
 * Los retos/trivias de esta estación se gestionan externamente (Google Forms).
 */

import { createStandView } from "./standView.js";

export const STAND_02_INFO = {
  id: "stand-02",
  code: "STAND02",
  num: "02",
  name: "InnovarTech en Escena",
  category: "Imágenes, Música y Emociones",
  badgeLabel: "STAND 02 · EN ESCENA",
  location: "Edificio Secundaria / Aula 2",
  mapCoords: { x: 75, y: 63 },
  description: "Un espacio para compartir recuerdos, experiencias y emociones de nuestra comunidad educativa a través de fotografías, videos y producciones audiovisuales.",
  // Texto completo (según bienvenida InnovarTech en Escena): se muestra en la página del stand
  about: [
    "Imágenes, Música y Emociones",
    "Un espacio para compartir recuerdos, experiencias y emociones de nuestra comunidad educativa.",
    "A través de fotografías, videos y producciones audiovisuales, revivimos momentos especiales de nuestros alumnos y de la vida escolar.",
    "Porque aprender también es crear, compartir y emocionarse.",
    "¡Los invitamos a disfrutar de este recorrido audiovisual!"
  ],
  // Misión secreta: cromo escondido en esta estación (pista editable por el organizador)
  cromo: {
    code: "CROMO02",
    name: "Ala de Carbono",
    rarity: "Rara",
    hint: "Está escondido en algún rincón del stand InnovarTech en Escena: mirá bien antes de irte."
  }
};

export function renderStand02(app) {
  return createStandView(app, STAND_02_INFO);
}
