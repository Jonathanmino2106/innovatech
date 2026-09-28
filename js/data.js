/**
 * INNOVATECH - PASAPORTE.26
 * 15 Stands de la Feria Tecnológica basados en el diseño oficial
 */

export const STANDS_DATA = [
  {
    id: "stand-01",
    num: "01",
    code: "STAND01",
    name: "Robótica & IA",
    category: "Robótica · Laboratorio de Tecnología",
    badgeLabel: "STAND 01 · ESPECIAL",
    location: "Entrada / Patio central / Laboratorio de Tecnología",
    mapCoords: { x: 30, y: 58 },
    description: "Experimentá con robots, sensores y sistemas de inteligencia artificial.",
    trivia: {
      challengeTitle: "Programá el robot",
      points: "1 puntos · respuesta rápida",
      question: "¿Cuál es la función principal de la visión por computadora en brazos robóticos industriales?",
      options: [
        "Aumentar el consumo de energía eléctrica",
        "Reconocer, clasificar y posicionar piezas con precisión milimétrica",
        "Controlar la temperatura ambiente del taller",
        "Reproducir avisos sonoros de seguridad"
      ],
      correctIndex: 1,
      explanation: "La visión artificial permite al robot inspeccionar, identificar y manipular objetos dinámicamente en tiempo real."
    }
  },
  {
    id: "stand-02",
    num: "02",
    code: "STAND02",
    name: "Programación",
    category: "Software · Aula 2",
    badgeLabel: "STAND 02",
    location: "Ala Central / Aula 2",
    mapCoords: { x: 53, y: 73 },
    description: "Algoritmos, desarrollo web, aplicaciones móviles y arquitectura de microservicios.",
    trivia: {
      challengeTitle: "Lógica de desarrollo",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué paradigma de programación se enfoca en 'qué hacer' mediante funciones puras sin efectos secundarios?",
      options: [
        "Programación Funcional",
        "Programación Secuencial rígida",
        "Ensamblador clásico",
        "Monolítico estricto"
      ],
      correctIndex: 0,
      explanation: "La programación funcional prioriza funciones puras e inmutabilidad de datos."
    }
  },
  {
    id: "stand-03",
    num: "03",
    code: "STAND03",
    name: "Inteligencia Artificial",
    category: "IA Generativa · Pabellón B",
    badgeLabel: "STAND 03",
    location: "Pabellón Este / Stand 03",
    mapCoords: { x: 74, y: 55 },
    description: "Modelos de lenguaje, agentes autónomos y redes neuronales profundas en acción.",
    trivia: {
      challengeTitle: "Redes Neuronales",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué mecanismo permite a los Transformers procesar contexto en grandes textos?",
      options: [
        "Compresión ZIP",
        "Atención (Self-Attention)",
        "Memoria caché de disco",
        "Renderizado por GPU básica"
      ],
      correctIndex: 1,
      explanation: "El mecanismo de autoatención permite ponderar la relevancia de cada palabra respecto al contexto."
    }
  },
  {
    id: "stand-04",
    num: "04",
    code: "STAND04",
    name: "Biotecnología",
    category: "Ciencias de la Vida · Lab Bio",
    badgeLabel: "STAND 04",
    location: "Pabellón Oeste / Lab Bio",
    mapCoords: { x: 19, y: 70 },
    description: "Biosensores no invasivos y soluciones de salud digital y genética aplicada.",
    trivia: {
      challengeTitle: "Bioingeniería",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué tecnología permite la edición precisa de secuencias genéticas?",
      options: [
        "CRISPR-Cas9",
        "Bluetooth 5.0",
        "Rayos infrarrojos",
        "Ultrasonido pasivo"
      ],
      correctIndex: 0,
      explanation: "CRISPR-Cas9 funciona como una 'tijera molecular' guiada para edición genética."
    }
  },
  {
    id: "stand-05",
    num: "05",
    code: "STAND05",
    name: "Energía",
    category: "Sustentabilidad · Patio Verde",
    badgeLabel: "STAND 05",
    location: "Patio Verde / Sector A",
    mapCoords: { x: 30, y: 43 },
    description: "Celdas solares fotovoltaicas bifaciales y microrredes de energía limpia.",
    trivia: {
      challengeTitle: "EcoTecnología",
      points: "1 puntos · respuesta rápida",
      question: "¿Cuál es el principal beneficio de las microrredes inteligentes?",
      options: [
        "Autonomía y distribución eficiente de energías renovables",
        "Dependencia obligatoria de carbón mineral",
        "Eliminar la necesidad de baterías",
        "Aumentar el calor ambiental"
      ],
      correctIndex: 0,
      explanation: "Las microrredes gestionan la distribución local optimizando la resiliencia energética."
    }
  },
  {
    id: "stand-06",
    num: "06",
    code: "STAND06",
    name: "Astronomía",
    category: "Ciencia Espacial · Domo",
    badgeLabel: "STAND 06",
    location: "Ala Central / Domo de Proyección",
    mapCoords: { x: 53, y: 64 },
    description: "Telescopios automatizados, telemetría espacial y exploración orbital.",
    trivia: {
      challengeTitle: "Exploración Orbital",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué telescopio espacial observa principalmente en el espectro infrarrojo profundo?",
      options: [
        "James Webb (JWST)",
        "Galileo I",
        "Kepler Clásico",
        "Sputnik 1"
      ],
      correctIndex: 0,
      explanation: "El telescopio James Webb capta las primeras galaxias mediante sensores infrarrojos infrarrojos."
    }
  },
  {
    id: "stand-07",
    num: "07",
    code: "STAND07",
    name: "Física",
    category: "Ciencias Básicas · Aula Magna",
    badgeLabel: "STAND 07",
    location: "Pabellón Este / Laboratorio 1",
    mapCoords: { x: 74, y: 44 },
    description: "Mecánica cuántica experimental, óptica y superconductores a temperatura ambiente.",
    trivia: {
      challengeTitle: "Mecánica Cuántica",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué propiedad describe dos partículas cuánticas con estados interconectados instantáneamente?",
      options: [
        "Entrelazamiento Cuántico",
        "Fricción cinética",
        "Resistencia óhmica",
        "Polarización estática"
      ],
      correctIndex: 0,
      explanation: "El entrelazamiento cuántico mantiene vinculados los estados cuánticos de dos partículas."
    }
  },
  {
    id: "stand-08",
    num: "08",
    code: "STAND08",
    name: "Química",
    category: "Materiales Avanzados · Lab Químico",
    badgeLabel: "STAND 08",
    location: "Pabellón Oeste / Stand 08",
    mapCoords: { x: 19, y: 57 },
    description: "Grafeno, polímeros biodegradables y nanomateriales de alta resistencia.",
    trivia: {
      challengeTitle: "Nanotecnología",
      points: "1 puntos · respuesta rápida",
      question: "¿Cuántas capas de átomos de carbono componen una lámina de grafeno?",
      options: [
        "Una sola capa (2D)",
        "Diez mil capas",
        "Cincuenta capas",
        "Es un compuesto de silicio"
      ],
      correctIndex: 0,
      explanation: "El grafeno es una estructura bidimensional de carbono de un átomo de espesor."
    }
  },
  {
    id: "stand-09",
    num: "09",
    code: "STAND09",
    name: "Gaming & XR",
    category: "Interactividad · Sala Gamer",
    badgeLabel: "STAND 09",
    location: "Pabellón Norte / Stand 09",
    mapCoords: { x: 30, y: 28 },
    description: "Motores Unreal Engine 5, ray tracing en tiempo real y dinámicas de simulación.",
    trivia: {
      challengeTitle: "Renderizado 3D",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué técnica simula el comportamiento físico real de la luz rebotando en objetos?",
      options: [
        "Ray Tracing",
        "Anti-Aliasing básico",
        "Interpolación lineal simple",
        "Vsync forzado"
      ],
      correctIndex: 0,
      explanation: "El Ray Tracing traza la trayectoria de rayos de luz calculando reflejos y sombras fotorrealistas."
    }
  },
  {
    id: "stand-10",
    num: "10",
    code: "STAND10",
    name: "Electrónica",
    category: "Hardware · Taller Maker",
    badgeLabel: "STAND 10",
    location: "Ala Central / Stand 10",
    mapCoords: { x: 53, y: 54 },
    description: "Microcontroladores ESP32, placas PCB impresas en vivo y sensores IoT.",
    trivia: {
      challengeTitle: "Circuitos Maker",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué componente electrónico se utiliza para almacenar carga y estabilizar voltaje?",
      options: [
        "Capacitor / Condensador",
        "Resistencia fija",
        "Diodo emisor",
        "Transformador pasivo"
      ],
      correctIndex: 0,
      explanation: "Los capacitores acumulan carga eléctrica y filtran variaciones en los circuitos."
    }
  },
  {
    id: "stand-11",
    num: "11",
    code: "STAND11",
    name: "Realidad Virtual",
    category: "Metaverso · Stand 11",
    badgeLabel: "STAND 11",
    location: "Pabellón Este / Stand 11",
    mapCoords: { x: 74, y: 27 },
    description: "Entornos virtuales inmersivos para medicina y simulación de vuelos.",
    trivia: {
      challengeTitle: "Inmersión 360°",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué medida se utiliza para evitar el mareo por movimiento en cascos VR?",
      options: [
        "Tasa de refresco alta (90Hz+) y baja latencia de seguimiento",
        "Bajar la resolución a 240p",
        "Usar pantallas en blanco y negro",
        "Desconectar el audio espacial"
      ],
      correctIndex: 0,
      explanation: "Altas tasas de refresco y baja latencia garantizan coherencia visual y vestibular."
    }
  },
  {
    id: "stand-12",
    num: "12",
    code: "STAND12",
    name: "Ciberseguridad",
    category: "Seguridad Digital · Stand 12",
    badgeLabel: "STAND 12",
    location: "Pabellón Oeste / Stand 12",
    mapCoords: { x: 19, y: 44 },
    description: "Tácticas de Red Team, defensa perimetral, criptografía y phishing defensivo.",
    trivia: {
      challengeTitle: "Defensa Digital",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué pilar sostiene la estrategia de seguridad moderna 'Zero Trust'?",
      options: [
        "Nunca confiar, verificar siempre de manera continua",
        "Confiar siempre en conexiones cableadas",
        "Utilizar la misma clave en todos los sistemas",
        "Deshabilitar los registros de auditoría"
      ],
      correctIndex: 0,
      explanation: "Zero Trust exige autenticación estricta y privilegios mínimos para cualquier acceso."
    }
  },
  {
    id: "stand-13",
    num: "13",
    code: "STAND13",
    name: "Drones & Aviación",
    category: "Movilidad Aérea · Stand 13",
    badgeLabel: "STAND 13",
    location: "Patio Sur / Zona de Vuelo",
    mapCoords: { x: 34, y: 76 },
    description: "Vehículos aéreos no tripulados para monitoreo agrícola y rescate de emergencia.",
    trivia: {
      challengeTitle: "Telemetría Aérea",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué sensor permite a un dron mantener su orientación y estabilidad de vuelo?",
      options: [
        "IMU (Unidad de Medición Inercial - Giróscopo y Acelerómetro)",
        "Sensor de huella digital",
        "Micrófono piezoeléctrico",
        "Altavoz ultrasónico"
      ],
      correctIndex: 0,
      explanation: "La IMU calcula en milisegundos la inclinación, aceleración y giro del dron."
    }
  },
  {
    id: "stand-14",
    num: "14",
    code: "STAND14",
    name: "Impresión 3D",
    category: "Manufactura Digital · Stand 14",
    badgeLabel: "STAND 14",
    location: "Ala Central / Stand 14",
    mapCoords: { x: 53, y: 45 },
    description: "Fabricación aditiva por filamento (FDM) y resina SLA para prototipado rápido.",
    trivia: {
      challengeTitle: "Prototipado",
      points: "1 puntos · respuesta rápida",
      question: "¿Cuál es el formato estándar de archivo 3D más utilizado por los programas cortadores (slicers)?",
      options: [
        ".STL u .OBJ",
        ".MP3",
        ".DOCX",
        ".EXE"
      ],
      correctIndex: 0,
      explanation: "El formato STL describe la geometría superficial mediante triángulos tridimensionales."
    }
  },
  {
    id: "stand-15",
    num: "15",
    code: "STAND15",
    name: "Internet de las Cosas (IoT)",
    category: "Conectividad · Stand 15",
    badgeLabel: "STAND 15",
    location: "Pabellón Este / Stand 15",
    mapCoords: { x: 74, y: 70 },
    description: "Ciudades inteligentes, domótica y sensores interconectados por protocolos MQTT.",
    trivia: {
      challengeTitle: "Sensores Conectados",
      points: "1 puntos · respuesta rápida",
      question: "¿Qué protocolo ligero de mensajería 'Publicación/Suscripción' es estándar en IoT?",
      options: [
        "MQTT",
        "FTP clásico",
        "Telnet sin cifrar",
        "POP3 de correo"
      ],
      correctIndex: 0,
      explanation: "MQTT es liviano y óptimo para dispositivos con ancho de banda y batería reducida."
    }
  }
];

export const RANKS = [
  { threshold: 0, title: "VISITANTE", minStamps: 0, desc: "Recién empieza tu recorrido." },
  { threshold: 3, title: "EXPLORADOR", minStamps: 3, desc: "Ya descubriste nuevas ideas." },
  { threshold: 6, title: "DESCUBRIDOR", minStamps: 6, desc: "Tu curiosidad te está llevando lejos." },
  { threshold: 9, title: "PIONERO", minStamps: 9, desc: "Casi completaste toda la feria." },
  { threshold: 13, title: "VISIONARIO", minStamps: 13, desc: "Exploraste la feria como una persona visionaria." }
];

export const ACHIEVEMENTS = [
  { id: "ach-1", title: "Primera señal", desc: "Completaste tu primera estación", icon: "scan", condition: (count) => count >= 1 },
  { id: "ach-2", title: "Ruta completa", desc: "Completaste las 15 estaciones de la feria", icon: "award", condition: (count) => count >= 15 },
  { id: "ach-3", title: "Mente en movimiento", desc: "Superaste 5 desafíos técnicos con éxito", icon: "sparkles", condition: (count) => count >= 5 }
];
