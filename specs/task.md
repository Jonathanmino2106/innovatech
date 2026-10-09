# Pasaporte Digital - Plan de Tareas 
## Lista de Tareas Secuenciales (Tasks Backlog)

Este archivo guía la implementación atómica del proyecto. Cada tarea debe marcarse como completada `[x]` antes de proceder con la siguiente.

### Fase 1: Infraestructura y Base de Datos (Supabase)
*   [ ] **Tarea 1.1:** Inicializar el proyecto local con la estructura del modo de trabajo e instalar/configurar Tailwind CSS.
*   [ ] **Tarea 1.2:** Crear e inicializar la base de datos relacional en Supabase ejecutando el archivo **`schema.sql`** (raíz del proyecto; fuente de verdad. Tablas: `usuarios`, `stands` sembrada con los 5 stands, `visitas_estaciones`, políticas RLS. Ver detalle en `proposal.md` §3).
*   [ ] **Tarea 1.3:** Configurar las variables de entorno: copiar `.env.example` a `.env` con las API keys de Supabase (nunca escribirlas en el código). El script `build.js` (ejecutado por `npm run build`, automático en Vercel) las inyecta en `src/js/config.js`. En Vercel: Project Settings > Environment Variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).

### Fase 2: Vistas de Acceso y Panel Principal (Mobile-First)
*   [ ] **Tarea 2.1:** Desarrollar la pantalla de **Login / Acceso y Recuperación** (RF-01, RF-02) utilizando clases utilitarias de Tailwind. Debe incluir pestañas para "Crear pasaporte" y "Ya tengo mi pasaporte".
*   [x] **Tarea 2.2:** Desarrollar el **Panel de Recorrido (Home)** (RF-04), maquetando la barra de progreso de avance porcentual (0%-100%), el rango de gamificación y los accesos rápidos con un diseño táctil superior a 48px (`h-12`).
*   [x] **Tarea 2.3:** Implementar el **Módulo de Lógica de Sesión**, permitiendo guardar el código único generado en el almacenamiento local o recuperarlo desde Supabase para restaurar el progreso si el usuario cierra el navegador de su celular.

### Fase 3: Recorrido, Validación y Retos
*   [x] **Tarea 3.1:** Crear la vista del **Mapa Interactivo** (RF-05) utilizando el plano esquemático simplificado y pines interactivos de colores (Verde = Visitado, Gris/Rojo = Pendiente).
*   [ ] **Tarea 3.2:** Implementar la interfaz de **Validación por QR e Ingreso Manual (Plan B)** (RF-06). Asegurar que la solapa alternativa con teclado alfanumérico funcione correctamente si falla la cámara.
*   [x] **Tarea 3.3:** Sistema de **calificación por estrellas (1 a 5)** tras obtener el sello, persistido en Supabase (`visitas_estaciones.valoracion`). Los retos pedagógicos (RF-07) se externalizan a Google Forms, fuera del alcance de la web app.

### Fase 4: Estadísticas y Gamificación 
*   [x] **Tarea 4.1:** Programar el componente de **Rangos y Logros** (RF-08) que calcule de manera automática el estatus acumulativo del estudiante (Visitante hasta Visionario) según los sellos logrados.
*   [x] **Tarea 4.2:** Integrar Chart.js para procesar los datos de las visitas mediante filtros relacionales y renderizar los componentes visuales de los gráficos analíticos de **torta** y **dona**.
*   [ ] **Tarea 4.3:** Realizar pruebas de conexión integrales de extremo a extremo (Registro ➡️ Escaneo QR/Manual ➡️ Valoración ➡️ Actualización de Gráficos) y documentar el pipeline final listo para el despliegue en Vercel.
