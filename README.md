# INNOVATECH - Arquitectura Modular ES6 Mobile-First

Aplicación web SPA ligera desarrollada para la feria de robótica INNOVATECH utilizando **HTML5**, **Tailwind CSS (CDN)** y **JavaScript Vanilla (Módulos ES6)** con aislamiento total por componente y stand.

---

## 📂 Estructura del Proyecto en `C:\Proyectos_Joni\innovatech`

```text
C:\Proyectos_Joni\innovatech\
├── index.html                     # Contenedor raíz con <div id="app"> y script type="module"
├── src\
│   ├── components\
│   │   └── navbar.js              # Barra inferior fija (Home, QR flotante, Mapa)
│   ├── css\
│   │   └── styles.css             # Animación láser de escaneo, rebote de pines, toast y grid
│   └── js\
│       ├── app.js                 # Enrutador central y gestión de estado global (LocalStorage)
│       └── views\
│           ├── loginView.js       # Registro de nickname/curso y recuperación de código
│           ├── homeView.js        # Panel de control, barra 0-100%, rango y lista de stands
│           ├── mapView.js         # Plano esquemático con los 5 pines interactivos
│           ├── qrView.js          # Visor de cámara y solapa Plan B (código manual)
│           └── stands\
│               ├── stand01.js     # Stand 01: Robótica Industrial & Brazos Articulados
│               ├── stand02.js     # Stand 02: Drones Autónomos & Visión Espacial
│               ├── stand03.js     # Stand 03: Robots Móviles & Vehículos Autónomos (AGV/AMR)
│               ├── stand04.js     # Stand 04: Robots Humanoides & Locomoción Bípeda
│               └── stand05.js     # Stand 05: Exoesqueletos & Robótica Médica
└── README.md
```

---

## 🧩 Principios de la Arquitectura

1. **Aislamiento por Stand:** Cada archivo `stand01.js` a `stand05.js` es un módulo independiente que encapsula sus metadatos, especificaciones técnicas de robótica, pregunta de opción múltiple, validación visual instantánea y llamada para otorgar el sello. Si se modifica o agrega contenido a un stand, **ningún otro stand se ve afectado**.
2. **Enrutador Central Reactivo:** `app.js` maneja el ciclo de vida del DOM inyectando las vistas en `#app`, controla las rutas (`login`, `home`, `map`, `qr`, `stand-01`... `stand-05`) y sincroniza el estado persistente en `localStorage`.
3. **Navbar Desacoplado:** El componente `navbar.js` recibe el nombre de la ruta activa y emite eventos de navegación a través de su callback hacia el enrutador.
4. **Mobile-First 100%:** Diseñado exclusivamente para interactuar en pantallas de smartphones con accesos táctiles, botones ergonómicos y áreas de seguridad de borde (`safe-bottom`).

---

## 🚀 Cómo Ejecutar en VS Code

1. Abre la carpeta `C:\Proyectos_Joni\innovatech` en **VS Code**.
2. Al tratarse de módulos nativos ES6 (`import` / `export`), inicia un servidor local:
   - Clic derecho en `index.html` > **Open with Live Server**.
   - O en la terminal: `npx serve .`
3. Presiona `F12` y activa la vista de emulación móvil (ej. iPhone 14 o Galaxy S20).
