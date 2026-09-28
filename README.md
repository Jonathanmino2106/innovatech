# INNOVATECH - Pasaporte y Guía Interactiva Mobile-First

Aplicación web ligera (SPA) desarrollada con **HTML5 semántico**, **Tailwind CSS (CDN)** y **JavaScript Vanilla (ES Modules)**, diseñada de forma nativa para dispositivos móviles de los visitantes a la feria de innovación y tecnología.

---

## 📱 Vistas y Módulos Desarrollados

1. **Pantalla de Bienvenida / Acceso (Login Local):**
   - Creación de pasaporte digital único (`INNO-XXXX`) ingresando seudónimo y curso/institución opcional.
   - Pestaña para reanudar o recuperar sesiones previas con el código de pasaporte sin necesidad de base de datos ni backend invasivo.

2. **Home / Panel de Control del Visitante:**
   - Barra de progreso porcentual dinámica (0% a 100%) y conteo de sellos.
   - Sistema de rangos escalonados en tiempo real (*Visitante Curioso, Explorador Tech, Innovador Activo, Pionero Digital, Visionario INNOVATECH*).
   - Accesos directos y listado visual de stands pendientes y completados.

3. **Mapa Interactivo de la Feria:**
   - Plano esquemático adaptable por pabellones vectoriales (Pabellón A, B y C Central).
   - Pines geoposicionados con pulso de atención que cambian de color (cian brillante = pendiente, verde esmeralda = visitado).
   - Tarjeta previa emergente al tocar cada pin con enlace directo al desafío.

4. **Módulo de Escaneo QR y Plan B (Manual):**
   - Visor de cámara simulada con escaneo láser animado y botón de validación inmediata.
   - Solapa alternativa **Plan B** con ingreso por código (ej. `STAND01`) y botones de 1 solo toque para asegurar que ningún visitante quede varado ante fallas de cámara o baja iluminación.

5. **Trivia Interactiva del Stand:**
   - Cuestionarios técnicos de opción múltiple vinculados a cada stand.
   - Validación inmediata con efectos visuales (éxito en verde con explicación técnica / vibración en rojo para reintentar).
   - Desbloqueo instantáneo del sello en el pasaporte y recálculo automático de rango.

6. **Pasaporte y Certificación:**
   - Credencial digital con la cuadrícula de sellos obtenidos y opción de reinicio/cierre de sesión.

---

## 🛠️ Estructura del Proyecto

```text
C:\innovatech\
├── index.html            # SPA con estructura semántica mobile-first y modales
├── css/
│   └── styles.css        # Animaciones láser QR, pulsos de mapa, grid futurista
├── js/
│   ├── app.js            # Controlador SPA principal y renderizado interactivo
│   ├── data.js           # Base de datos local de stands, coordenadas y trivias
│   └── state.js          # Manejo de estado persistente en LocalStorage
├── vercel.json           # Configuración directa lista para Vercel
└── README.md             # Documentación técnica
```

---

## 🚀 Cómo Probar Localmente en VS Code

1. Abre la carpeta `C:\innovatech` en **Visual Studio Code**.
2. Al utilizar módulos JavaScript nativos (`type="module"`), se recomienda ejecutarlo a través de un servidor local:
   - Con la extensión **Live Server**: clic derecho en `index.html` > **Open with Live Server**.
   - O usando cualquier servidor local como `npx serve .` o `python -m http.server 3000`.
3. Abre las herramientas de desarrollador (`F12`) y activa el **Modo Dispositivo Móvil** (ej. iPhone 14 / Pixel 7) para disfrutar de la experiencia 100% pensada para smartphones.

---

## 🌐 Despliegue en Vercel

El proyecto incluye el archivo `vercel.json` y no requiere pasos de compilación (*zero-build*):
1. Sube el repositorio a GitHub o ejecuta en la terminal:
   ```bash
   npx vercel
   ```
2. ¡Listo! Vercel detectará la web estática y te entregará una URL HTTPS pública al instante.
