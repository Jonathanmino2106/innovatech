# Pasaporte Digital - Documentación Integral del Proyecto
## Especificación de Producto (Product Spec)

Documento institucional definitivo para la presentación de la Feria de Robótica.

### 1. Resumen Ejecutivo y Propósito del Proyecto
El Pasaporte Digital es una página web interactiva desarrollada bajo un enfoque *mobile-first* con el objetivo de dinamizar, gamificar y digitalizar el recorrido de los visitantes (estudiantes, docentes y jurados) a través de los 5 stands clave de la Feria de Robótica escolar.

En lugar de utilizar planillas de papel o sistemas locales dependientes de una red interna, la plataforma permite:
* Registrarse de forma ágil.
* Validar la presencia en las estaciones mediante escaneo de códigos QR (con una alternativa robusta por código manual alfanumérico).
* Completar retos educativos.
* Acumular rangos.
* Visualizar estadísticas en tiempo real.

### 2. Flujo de Usuario y Funcionamiento General
El ciclo de vida de la interacción de un usuario con el sistema se compone de las siguientes fases operativas:

1. **Acceso y Registro Ligero:** El usuario abre la Web App desde su dispositivo móvil (vía navegador web con conexión a internet). Ingresa su seudónimo (*nickname*) y selecciona su perfil de visitante (Alumno, Profesor, Familiar o Visitante) sin requerir contraseñas complejas. El sistema le asigna un código único de pasaporte.
2. **Panel Principal (Home):** Visualiza una barra de avance porcentual (0%-100%), su rango actual de gamificación y accesos rápidos al mapa interactivo y al escáner.
3. **Recorrido y Mapa:** El usuario consulta el plano esquemático de la feria para identificar la ubicación y estado (pendiente o visitado) de cada stand.
4. **Validación Dual (QR o Plan B):** Al llegar al stand, el usuario escanea el código QR institucional mediante la cámara del celular. Si el dispositivo presenta fallas de hardware, poca luz o problemas de permisos de cámara, puede ingresar directamente un código alfanumérico alternativo (ej. `STAND01`).
5. **Reto Pedagógico (Google Forms) y Valoración:** El reto pedagógico de cada stand se completa mediante un Google Forms externo (fuera del alcance de la web app). Tras validar la visita, el usuario otorga una puntuación en estrellas (1 a 5) que se persiste en la base de datos.
6. **Visualización de Estadísticas:** El usuario puede visualizar los gráficos analíticos (torta y dona) en el panel general.

### 3. Reporte de Métricas y Visualización Analítica 
Los resultados estructurados de la base de datos devuelven datos limpios que alimentan de forma dinámica los componentes gráficos en el frontend:

* **Gráfico de Torta (Pie):** Representa el porcentaje de visitas acumuladas por cada uno de los 5 stands de la feria basándose en la consulta SQL.
* **Gráfico de Dona (Doughnut):** Mide la proporción de uso entre el escáner QR tradicional y el ingreso alternativo por código manual (Plan B) utilizando filtros relacionales.

#### Tabla de Clasificación
Métricas de interacción recopiladas durante la Feria de Robótica para identificar las estaciones de mayor interés, niveles de retención y valoración cualitativa:

| Nº Stand | Nombre del Proyecto / Estación | Visitas Totales | Valoración Promedio (Estrellas) |
| :--- | :--- | :---: | :---: |
| **Stand 01** | Robótica & IA (Laboratorio de Tecnología) | 142 | ⭐ 4.9 / 5.0 |
| **Stand 03** | Vehículo Autónomo / Seguidor de Línea | 135 | ⭐ 4.8 / 5.0 |
| **Stand 07** | Brazo Robótico Industrial | 128 | ⭐ 4.7 / 5.0 |
| **Stand 05** | Domótica y Automatización Hogareña | 115 | ⭐ 4.5 / 5.0 |
| **Stand 09** | Impresión 3D y Prototipado Rápido | 110 | ⭐ 4.6 / 5.0 |

### 4. Conclusiones y Próximas Mejoras
El módulo de estadísticas es una herramienta fundamental para los organizadores y docentes. La integración con Supabase (PostgreSQL) aporta una base de datos relacional robusta, estructurada y profesional, ideal para la defensa del proyecto.

### 5. Estructura y Distribución de Pantallas (Flujo Mobile-First)

| Pantalla / Vista | Objetivo Principal | Elementos Clave de la Interfaz (UI) | Estrategia UX / Accesibilidad |
| :--- | :--- | :--- | :--- |
| **1. Login / Acceso y Recuperación** | Identificar al usuario nuevo o permitirle recuperar su sesión activa anterior. | Pestañas o botones divididos: "Crear mi pasaporte" (Nickname y Curso) y "Ya tengo mi pasaporte" (Ingreso por código único, ej. FT26-2470). | Evita la pérdida de datos si el usuario cierra el navegador o se queda sin batería temporalmente. Acceso rápido sin contraseñas complejas. |
| **2. Panel de Recorrido (Home)** | Mostrar el estado general de avance y acceso rápido al mapa. | Barra de progreso porcentual (0%-100%), tarjeta de "Siguiente Estación recomendada", tablero de accesos rápidos. | Gamificación visual inmediata. El usuario sabe exactamente dónde está y qué le falta. |
| **3. Mapa Interactivo** | Ubicar geográficamente los stands y su estado actual. | Plano esquemático simplificado, pines interactivos (Verde = Visitado, Gris/Rojo = Pendiente). | Evita el uso de mapas complejos con zoom excesivo. Cada pin abre la tarjeta informativa del stand. |
| **4. Validación por QR (Cámara / Código)** | Registrar la visita física al stand mediante escaneo o alternativa. | Visor de cámara con mira de enfoque y solapa alterna para ingresar código demostrativo (ej. STAND01). | Crítico: Soluciona fallas de hardware, falta de permisos de cámara o poca luz con un teclado numérico/alfanumérico alternativo. |
| **5. Validación de la Estación** | Registrar la visita física y valorar la experiencia. | Tarjeta informativa del proyecto de robótica y botón "Validar presencia · ver QR". Los retos se gestionan con Google Forms externo; la valoración por estrellas (1-5) se registra tras el sello. | Pantalla breve sin scroll pesado para mantener ágil el flujo en los pasillos de la feria. |
| **6. Rangos y Logros (Gamificación)** | Incentivar la finalización del recorrido completo. | Niveles desbloqueables (Visitante, Explorador, Descubridor, Pionero, Visionario) y grilla de medallas. | Aumenta la motivación intrínseca de los estudiantes mediante un sistema de estatus y logros acumulativos. |

### 6. Especificación de Requerimientos

#### 6.1 Requerimientos Funcionales (RF)
* **RF-01: Identificación y Registro Inicial.** El sistema permite al usuario ingresar un seudónimo (*nickname*) y seleccionar su perfil de visitante (Alumno, Profesor, Familiar o Visitante) para generar un identificador único de recorrido.
* **RF-02: Recuperación de Sesión por Código de Pasaporte.** El sistema incluye una vista de inicio de sesión que permite ingresar el código único asignado previamente (ej. FT26-2470) para consultar la base de datos de Supabase y restaurar instantáneamente todos los sellos, visitas y el porcentaje de avance del usuario.
* **RF-03: Generación de Pasaporte Digital.** El sistema asigna un código único de seguimiento al usuario tras el registro inicial para vincular su progreso.
* **RF-04: Visualización del Panel de Recorrido (Home).** El sistema muestra un resumen gráfico del avance del usuario en porcentaje (0%-100%), los sellos activos y un acceso directo a la siguiente estación recomendada.
* **RF-05: Mapa Interactivo de Estaciones.** El sistema ofrece un plano esquemático visual de la feria donde se despliegan pines interactivos con el estado de cada stand (Pendiente / Visitado).
* **RF-06: Sistema de Validación Dual (QR y Código Manual).** El sistema valida la presencia física del usuario mediante lectura de códigos QR o mediante entrada alternativa por código alfanumérico (ej. STAND01) para garantizar accesibilidad.
* **RF-07: Módulo de Retos por Estación (externo).** Los retos pedagógicos de cada stand se gestionan mediante formularios Google Forms vinculados a cada estación; la web app registra la visita física y la valoración del usuario.
* **RF-08: Gamificación y Rangos.** El sistema categoriza el progreso del usuario mediante rangos desbloqueables (Visitante, Explorador, Descubridor, Pionero, Visionario) en función de la cantidad de sellos acumulados.

#### 6.2 Requerimientos No Funcionales (RNF)
* **RNF-01: Enfoque Mobile-First (Usabilidad).** La interfaz está adaptada prioritariamente para dispositivos móviles, garantizando áreas táctiles amplias (botones > 48px de altura) y márgenes laterales seguros.
* **RNF-02: Rendimiento y Carga Ligera.** Al tratarse de una página para una feria escolar con alta concurrencia, las vistas cargan de forma instantánea utilizando componentes ligeros.
* **RNF-03: Tolerancia a Fallos y Persistencia.** El sistema contempla modos de validación manual (STAND01) y recuperación de sesiones mediante Supabase para asegurar que la experiencia no se interrumpa por problemas técnicos o cierres accidentales de la aplicación.
