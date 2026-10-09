# INNOVATECH - Arquitectura Modular ES6 Mobile-First

Aplicación web SPA ligera desarrollada para la feria de robótica INNOVATECH utilizando **HTML5**, **Tailwind CSS (CDN)** y **JavaScript Vanilla (Módulos ES6)** con aislamiento total por componente y stand.

---

## 📂 Estructura del Proyecto

```text
innovatech\
├── index.html                     # Contenedor raíz con <div id="app"> y script type="module"
├── build.js                       # Genera src/js/config.js desde .env / variables de Vercel
├── schema.sql                     # FUENTE DE VERDAD de la base de datos (ejecutar en Supabase)
├── .env.example                   # Plantilla de variables de entorno (copiar a .env)
├── server.js                      # Servidor estático local sin dependencias
├── src\
│   ├── components\
│   │   └── navbar.js              # Header superior + navbar inferior móvil
│   ├── css\
│   │   └── styles.css             # Animación láser de escaneo, rebote de pines, toast y grid
│   └── js\
│       ├── app.js                 # Enrutador central y gestión de estado global
│       ├── config.js              # GENERADO por build.js (credenciales Supabase, no editar)
│       ├── ranks.js               # Módulo Único de verdad de rangos (gamificación)
│       ├── supabaseClient.js      # Cliente Supabase (lee de config.js)
│       └── views\
│           ├── loginView.js       # Registro de nickname/curso y recuperación de código
│           ├── homeView.js        # Panel de control, barra 0-100%, rango y accesos rápidos
│           ├── mapView.js         # Plano esquemático con los 5 pines interactivos
│           ├── qrView.js          # Visor de cámara y solapa Plan B (código manual)
│           ├── passportView.js    # Colección de sellos y avance de la ruta
│           ├── ranksView.js       # Rangos alcanzables y logros desbloqueables
│           ├── statsView.js       # Gráficos de torta/dona y tabla de clasificación (Chart.js)
│           └── stands\
│               ├── standView.js   # Plantilla común de estación (hero + validación QR)
│               ├── stand01.js     # Stand 01: Robótica Industrial & Brazos Articulados
│               ├── stand02.js     # Stand 02: Drones Autónomos & Visión Espacial
│               ├── stand03.js     # Stand 03: Robots Móviles & Vehículos Autónomos (AGV)
│               ├── stand04.js     # Stand 04: Robots Humanoides & Locomoción Bípeda
│               └── stand05.js     # Stand 05: Exoesqueletos & Robótica Médica
└── README.md
```

---

## 🔐 Variables de Entorno (Supabase)

Las credenciales **nunca** se escriben a mano en el código fuente (regla de la constitución del proyecto):

1. **Local:** copia `.env.example` a `.env` y completa tus claves. Ejecuta `npm run build` (o `npm run dev`, que lo ejecuta automáticamente) para generar `src/js/config.js`.
2. **Vercel:** configura las mismas variables (`SUPABASE_URL` y `SUPABASE_ANON_KEY`) en *Project Settings > Environment Variables*. Vercel ejecuta `npm run build` en cada deploy y `build.js` las inyecta automáticamente.
3. **Base de datos:** ejecuta `schema.sql` en el SQL Editor de Supabase antes del primer uso.

> Si faltan las variables, la app no se rompe: funciona en modo solo-local (`localStorage`) mostrando un aviso.

---

## 🧩 Principios de la Arquitectura

1. **Aislamiento por Stand:** Cada archivo `stand01.js` a `stand05.js` exporta únicamente los metadatos y especificaciones técnicas de su proyecto, renderizados por la plantilla común `stands/standView.js`. Si se modifica o agrega contenido a un stand, **ningún otro stand se ve afectado**. Los retos pedagógicos se gestionan externamente con Google Forms.
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
