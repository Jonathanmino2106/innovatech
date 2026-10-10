# INNOVATECH - Arquitectura Modular ES6 Mobile-First

Aplicación web SPA ligera desarrollada para la feria de robótica INNOVATECH utilizando **HTML5**, **Tailwind CSS (CLI con build estático)** y **JavaScript Vanilla (Módulos ES6)** con aislamiento total por componente y stand.

---

## 📂 Estructura del Proyecto

```text
innovatech\
├── index.html                     # Contenedor raíz con <div id="app"> y script type="module"
├── build.js                       # Genera src/js/config.js desde .env / variables de Vercel
├── tailwind.config.js             # Config de Tailwind (colores theme.* y fonts), antes era inline en index.html
├── schema.sql                     # FUENTE DE VERDAD de la base de datos (ejecutar en Supabase)
├── server.js                      # Servidor estático local sin dependencias
├── src\
│   ├── components\
│   │   └── navbar.js              # Header superior + navbar inferior móvil
│   ├── css\
│   │   ├── tailwind.css           # Input de Tailwind CLI (@tailwind base/components/utilities)
│   │   ├── tailwind.generated.css # GENERADO por `npm run css` (gitignored, se regenera en cada build)
│   │   └── styles.css             # Animación láser de escaneo, rebote de pines, FAB mapa, toast y grid
│   └── js\
│       ├── app.js                 # Enrutador central y gestión de estado global
│       ├── config.js              # GENERADO por build.js (credenciales Supabase, no editar)
│       ├── ranks.js               # Módulo Único de verdad de rangos (gamificación)
│       ├── supabaseClient.js      # Cliente Supabase (lee de config.js)
│       └── views\
│           ├── loginView.js       # Pestañas: crear pasaporte / recuperar por código
│           ├── homeView.js        # Panel de control, barra 0-100%, rango y accesos rápidos
│           ├── mapView.js         # Plano esquemático con los 5 pines interactivos
│           ├── qrView.js          # Lector QR real por cámara + solapa Plan B (código manual)
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

1. **Local:** crea un archivo `.env` en la raíz con `SUPABASE_URL` y `SUPABASE_ANON_KEY`. Ejecuta `npm run dev` (ejecuta `build.js` y el build de Tailwind automáticamente) para generar `src/js/config.js` y `src/css/tailwind.generated.css`.
2. **Vercel:** configura las mismas variables (`SUPABASE_URL` y `SUPABASE_ANON_KEY`) en *Project Settings > Environment Variables*. Vercel ejecuta `npm run build` en cada deploy y `build.js` las inyecta automáticamente.
3. **Base de datos:** ejecuta `schema.sql` en el SQL Editor de Supabase antes del primer uso.

> Si faltan las variables, la app no se rompe: funciona en modo solo-local (`localStorage`) mostrando un aviso.

---

## 🖨️ QR de los cromos secretos (organizador)

Cada stand esconde un cromo físico con su propio QR (`CROMO01`…`CROMO05`). Para imprimirlos:

```bash
npm run qr:cromos
```

Eso genera:
- `assets/cromos/CROMOxx.png` — los 5 QR (900×900 px, nivel de corrección de errores H).
- `qr-cromos.html` — hoja A4 lista para imprimir con guías de corte y la pista de cada cromo.

Abrí `qr-cromos.html` en el navegador, presioná **Imprimir** (al 100%, sin "ajustar a página"), cortá por la línea punteada y pegá cada QR **oculto** en su stand. El script lee los cromos desde `src/js/views/stands/standXX.js`, así que si cambiás un nombre o una pista, volvé a correr `npm run qr:cromos`.

> La app valida el **texto** del QR (ej. `CROMO01`), no la imagen: si reimprimís uno, asegurate de que el contenido sea exactamente ese código.

---

## 🧩 Principios de la Arquitectura

1. **Aislamiento por Stand:** Cada archivo `stand01.js` a `stand05.js` exporta únicamente los metadatos y especificaciones técnicas de su proyecto, renderizados por la plantilla común `stands/standView.js`. Si se modifica o agrega contenido a un stand, **ningún otro stand se ve afectado**. Los retos pedagógicos se gestionan externamente con Google Forms.
2. **Enrutador Central Reactivo:** `app.js` maneja el ciclo de vida del DOM inyectando las vistas en `#app`, controla las rutas (`crea-pasaporte`, `home1`, `map`, `qr`, `stats`, `passport`, `ranks`, `stand-01`... `stand-05`) y sincroniza el estado persistente en `localStorage` + Supabase.
3. **Navbar Desacoplado:** El componente `navbar.js` recibe el nombre de la ruta activa y emite eventos de navegación a través de su callback hacia el enrutador.
4. **Mobile-First 100%:** Diseñado exclusivamente para interactuar en pantallas de smartphones con áreas táctiles mínimas de 48px (`min-h-12`) y áreas de seguridad de borde (`safe-bottom`).

---

## 🚀 Cómo Ejecutar en VS Code

1. Abre la carpeta del proyecto en **VS Code**.
2. En la terminal ejecuta:
   ```bash
   npm install       # primera vez: instala Tailwind CLI (devDependency)
   npm run dev
   ```
   (Node.js ≥ 18. Genera `config.js` desde el `.env`, compila el CSS de Tailwind y levanta el servidor estático local.)
3. **Desarrollo con cambios de clases CSS:** en una segunda terminal dejá corriendo
   ```bash
   npm run css:watch
   ```
   para que `tailwind.generated.css` se recompile solo cada vez que agregás o cambiás clases. Si no lo dejás corriendo, volvé a ejecutar `npm run dev` (o `npm run css`) después de tocar clases.
4. Abre `http://localhost:3000` y presiona `F12` para activar la vista de emulación móvil (ej. iPhone 14 o Galaxy S20).
5. **Escáner QR:** la cámara requiere un contexto seguro — en local funciona en `localhost`, y en producción Vercel provee HTTPS automáticamente.
