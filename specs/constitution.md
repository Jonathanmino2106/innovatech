# Pasaporte Digital - Feria de Robótica
## Constitución del Proyecto (Project Constitution)

Este documento establece las reglas fundamentales, restricciones técnicas, entorno de infraestructura y convenciones de desarrollo no negociables para la página, Pasaporte Digital. Cualquier agente de IA o desarrollador debe priorizar estas directrices antes de escribir código.

### 1. Stack Tecnológico Permitido (Restricciones Estrictas)
Queda estrictamente prohibido el uso de tecnologías, frameworks o librerías fuera de este listado:

*   **Frontend / Lenguajes:** HTML5, **Tailwind CSS** (para todo el diseño y maquetación visual) y JavaScript (Vanilla JS) u optimizaciones en React.
*   **Enfoque de Diseño:** Exclusivamente **Mobile-First**.
*   **Base de Datos y Backend (BaaS):** Supabase (PostgreSQL en la nube).
*   **Librería de Gráficos:** Chart.js (únicamente gráficos de Torta y Dona).
*   **Plataforma de Despliegue (Hosting):** **Vercel (Plan Hobby / Gratuito)** para el entorno de producción definitivo.
*   **Editor y Versiones:** Visual Studio Code para desarrollo local y Git/GitHub para el control de versiones remoto.

### 2. Directrices de Infraestructura y Despliegue (Vercel)
*   **Alojamiento en Vercel:** Toda la interfaz pública y lógica del cliente debe estar optimizada para el despliegue automático en la infraestructura global de Vercel (CDN).
*   **Seguridad y SSL:** El proyecto debe aprovechar la generación automática de certificados SSL/HTTPS de Vercel para asegurar la transferencia segura de datos entre los teléfonos de los visitantes y la base de datos.
*   **Variables de Entorno Estrictas:** Queda prohibido escribir las credenciales de Supabase de manera explícita (*hardcoded*) en el código fuente. La IA debe configurar la conexión utilizando variables de entorno de producción (`.env`) mapeadas directamente en el panel de control de Vercel.

### 3. Convenciones de Código y Arquitectura
*   **Diseño con Tailwind CSS:** Todo el estilado debe realizarse mediante las clases utilitarias de Tailwind. No se deben crear archivos `.css` adicionales para estilos particulares a menos que sea estrictamente necesario para configuraciones globales.
*   **Mobile-First Mandatorio:** Toda interfaz debe diseñarse pensando primero en pantallas de celulares, garantizando áreas táctiles amplias (botones con una altura mínima de **48px** / `h-12` en Tailwind) para asegurar la accesibilidad en los pasillos de la feria.
*   **Estilo Limpio y Sin Scroll Pesado:** Las pantallas de retos y formularios deben resolverse en una sola pantalla sin necesidad de scrolls largos para mantener la agilidad del evento.

### 4. Reglas de Negocio Críticas (Tolerancia a Fallos)
*   **Persistencia Inmediata:** Toda acción del usuario (registro, escaneo, trivias) debe impactar de forma instantánea en Supabase y actualizar dinámicamente el frontend.
*   **Principio de Validación Dual:** El sistema siempre debe contar con dos caminos de validación en la interfaz de escaneo:
    1. Lector de cámara de código QR institucional.
    2. Campo de entrada alfanumérico manual alternativo (Plan B de resiliencia, ej: `STAND01`) para mitigar fallas de hardware, cámara o conectividad escolar intermitente.
*   **Sin Contraseñas Complejas:** El acceso y la recuperación de progreso se realizan únicamente mediante el **Seudónimo (nickname)** y el **Código Único de Pasaporte** autogenerado (ej. FT26-2470) para evitar fricciones de logueo.

### 5. Flujo de Trabajo (Git Workflow)
*   El desarrollo se mantendrá organizado mediante Git local sincronizado hacia el repositorio remoto de GitHub.
*   Cada cambio significativo o funcionalidad resuelta por la IA debe acompañarse de su correspondiente confirmación (*commit*) siguiendo la nomenclatura estándar (ej. `feat: [descripción del cambio]`).
