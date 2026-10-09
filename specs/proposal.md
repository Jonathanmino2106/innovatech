# Pasaporte Digital - Arquitectura Técnica y Datos
## Propuesta Técnica (Technical Proposal)

### 1. Arquitectura de Funcionamiento General
El sistema opera bajo un enfoque *mobile-first* y requiere de una infraestructura en la nube para garantizar que no dependa de redes locales internas. El núcleo técnico se define bajo los siguientes pilares:

* **Manual de Funcionamiento e Interfaz:** Web App interactiva optimizada para navegadores móviles con consumo de servicios en tiempo real.
* **Persistencia de Datos:** La información de los registros, validaciones de stands y retos se almacena de forma instantánea en la nube. Al actualizarse, impacta de forma automática en los componentes analíticos de la interfaz.

### 2. Stack Tecnológico y Almacenamiento
Para soportar la lógica del Pasaporte Digital se implementarán las siguientes herramientas:

* **Motor de Base de Datos:** PostgreSQL.
* **Plataforma Backend/BaaS:** Supabase, encargado de la persistencia inmediata, la gestión de los pasaportes únicos y el almacenamiento de las respuestas de las trivias.
* **Componentes Visuales:** Librerías de gráficos optimizadas para renderizar las métricas generales en formatos de **torta** y **dona**.

### 3. Arquitectura de Datos y Persistencia Relacional (Supabase / PostgreSQL)
Para gestionar la información de manera estructurada y segura en la nube (accesible desde cualquier celular en la escuela mediante internet), el sistema utiliza una base de datos relacional basada en tablas mediante Supabase (PostgreSQL).

**Fuente de verdad:** el archivo **`schema.sql`** (raíz del proyecto) contiene el script completo listo para ejecutar en el SQL Editor de Supabase, incluyendo el sembrado (*seed*) de la tabla `stands` y las políticas RLS. El esquema normalizado es el siguiente:

```sql
-- 1. Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    curso VARCHAR(50),
    codigo_pasaporte VARCHAR(20) UNIQUE NOT NULL,
    rango_actual VARCHAR(30) DEFAULT 'Visitante',
    progreso INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Stands (sembrada con los 5 stands de la feria)
CREATE TABLE stands (
    id SERIAL PRIMARY KEY,
    id_stand VARCHAR(20) UNIQUE NOT NULL,   -- ej. STAND01 (QR / Plan B)
    nombre_stand VARCHAR(100) NOT NULL
);

-- 3. Tabla Puente de Visitas / Sellos
CREATE TABLE visitas_estaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    stand_codigo VARCHAR(20) REFERENCES stands(id_stand) ON DELETE CASCADE,
    fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valoracion INT CHECK (valoracion BETWEEN 1 AND 5),
    metodo_ingreso VARCHAR(10) CHECK (metodo_ingreso IN ('qr', 'manual')),
    trivia_correcta BOOLEAN DEFAULT false
);
```

#### 3.1 Correspondencia Esquema ↔ Frontend
| Tabla.Columna | Uso en el código (`src/js/app.js`) |
| :--- | :--- |
| `usuarios.nickname` / `usuarios.curso` | Registro del formulario "Crear mi pasaporte" (RF-01). |
| `usuarios.codigo_pasaporte` | Código único autogenerado `FT26-####` para recuperar sesión (RF-02/RF-03). |
| `usuarios.progreso` / `usuarios.rango_actual` | Se recalculan y actualizan en cada sello obtenido (RF-04/RF-08). |
| `visitas_estaciones.stand_codigo` | Llega como `stand_codigo: "STAND01"` (FK a `stands.id_stand`). |
| `visitas_estaciones.metodo_ingreso` | `'qr'` (cámara) o `'manual'` (Plan B) → alimenta el gráfico de dona (RF-06). |
| `visitas_estaciones.trivia_correcta` | Resultado real de la trivia pedagógica (RF-07). |
| `visitas_estaciones.valoracion` | Puntaje de estrellas 1-5 entregado por el usuario. |
### 5. Estrategia e Infraestructura de Despliegue (Deploy)

Para asegurar que la aplicación cuente con un rendimiento profesional, alta disponibilidad para los visitantes de la feria (padres, alumnos y docentes) y un entorno de desarrollo robusto, se utiliza una tubería de despliegue basada en los siguientes estándares:

* **Entorno de Desarrollo:** Visual Studio Code (VS Code).
* **Control de Versiones:** Git y repositorio remoto en GitHub.
* **Alojamiento y Producción (Frontend):** Vercel (Plan Hobby / Gratuito).
* **Persistencia de Datos (Backend):** Supabase (PostgreSQL en la nube).

#### 5.1 Flujo de Despliegue Paso a Paso

* **Paso 1: Preparación del Código en VS Code:** El código fuente optimizado se organiza localmente estructurando las vistas móviles (HTML, CSS y JavaScript) con un enfoque *mobile-first* y conectándolas mediante variables de entorno seguras hacia la base de datos relacional de Supabase.
* **Paso 2: Versionado con Git y GitHub:** Se inicializa el repositorio local y se sube el código al sistema de control de versiones remoto para garantizar trazabilidad, respaldo y colaboración segura mediante comandos estándar de Git.
* **Paso 3: Conexión y Automatización en Vercel:** Se importa el repositorio de GitHub en Vercel, el cual detecta automáticamente la estructura del proyecto web. Se configuran las credenciales de conexión a Supabase de forma segura en las variables de entorno de Vercel y se ejecuta el *Deploy*, generando una URL pública definitiva bajo protocolo seguro (HTTPS) y optimizada mediante CDN.

#### 5.2 Escalabilidad y Resiliencia en Producción
* **Disponibilidad en Vercel:** La infraestructura global soporta de forma fluida el tráfico simultáneo de los usuarios durante la feria sin caídas ni cuellos de botella en la interfaz visual.
* **Base de Datos en Supabase:** Gestiona las interacciones concurrentes mediante el motor PostgreSQL normalizado, complementado con el Plan B de Resiliencia (ingreso alternativo por código manual alfanumérico `STAND01`) para asegurar el registro ante limitaciones de hardware o conectividad.
