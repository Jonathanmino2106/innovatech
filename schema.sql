-- ============================================================================
-- PASAPORTE DIGITAL - Esquema de Base de Datos (FUENTE DE VERDAD)
-- Supabase / PostgreSQL
--
-- Cómo ejecutar:
--   1. Abre tu proyecto en Supabase > SQL Editor
--   2. Pega todo este archivo y ejecuta (Run)
--   3. Verifica que las 5 tablas/índices aparezcan en Database > Table Editor
--
-- Nota: el frontend (src/js/app.js) inserta/consulta usando EXACTAMENTE
-- estos nombres de tablas y columnas. Cualquier cambio debe reflejarse
-- también en specs/proposal.md §3.
-- ============================================================================

-- 1. Tabla de Usuarios ------------------------------------------------------
-- NOTA: id DEBE ser autoincremental real (SERIAL/IDENTITY). Si la tabla se
-- crea a mano desde el dashboard de Supabase, marcar "Auto Increment":
-- un id que devuelva 0 hace que el frontend (JS trata 0 como falso) deje de
-- persistir visitas y cromos. Ver fix-persistencia-visitas.sql.
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    tipo_visitante VARCHAR(20) CHECK (tipo_visitante IN ('Alumno', 'Profesor', 'Familiar', 'Visitante')),
    codigo_pasaporte VARCHAR(20) UNIQUE NOT NULL,
    rango_actual VARCHAR(30) DEFAULT 'Visitante',
    progreso INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Stands (sembrada con los 5 stands de la feria) ----------------
CREATE TABLE stands (
    id SERIAL PRIMARY KEY,
    id_stand VARCHAR(20) UNIQUE NOT NULL,   -- código alfanumérico del QR/Plan B (ej. STAND01)
    nombre_stand VARCHAR(100) NOT NULL
);

INSERT INTO stands (id_stand, nombre_stand) VALUES
    ('STAND01', 'Game Zone'),
    ('STAND02', 'InnovarTech en Escena'),
    ('STAND03', 'InnovartTech MotionArt'),
    ('STAND04', 'InnovartTech RoboLab'),
    ('STAND05', 'InnovartTech MotionArt');

-- 3. Tabla Puente de Visitas / Sellos ---------------------------------------
CREATE TABLE visitas_estaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    stand_codigo VARCHAR(20) REFERENCES stands(id_stand) ON DELETE CASCADE,
    fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valoracion INT CHECK (valoracion BETWEEN 1 AND 5),   -- estrellas 1-5 (opcional hasta Fase B)
    metodo_ingreso VARCHAR(10) CHECK (metodo_ingreso IN ('qr', 'manual')),  -- Plan B → 'manual'
    trivia_correcta BOOLEAN DEFAULT false,               -- resultado real de la trivia pedagógica
    -- Un sello por usuario+stand: garantía de dominio y sincronización idempotente
    CONSTRAINT uq_visitas_usuario_stand UNIQUE (usuario_id, stand_codigo)
);

-- Índices para las consultas del panel de estadísticas (torta y dona)
CREATE INDEX idx_visitas_usuario ON visitas_estaciones (usuario_id);
CREATE INDEX idx_visitas_stand ON visitas_estaciones (stand_codigo);

-- 3.5 Tabla Puente de Cromos Secretos (misiones secretas) ---------------------
-- [APLICADO en el proyecto de Supabase el 2026-10-13]
-- Cada stand esconde un cromo físico con su propio QR (CROMO01..CROMO05).
-- El visitante lo registra desde la sección "Misión secreta" de ese stand.
-- UNIQUE (usuario_id, stand_codigo) evita duplicados si re-escanea el mismo cromo.
CREATE TABLE cromos_secretos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    stand_codigo VARCHAR(20) REFERENCES stands(id_stand) ON DELETE CASCADE,
    fecha_encuentro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_ingreso VARCHAR(10) CHECK (metodo_ingreso IN ('qr', 'manual')),
    UNIQUE (usuario_id, stand_codigo)
);

CREATE INDEX idx_cromos_usuario ON cromos_secretos (usuario_id);
CREATE INDEX idx_cromos_stand ON cromos_secretos (stand_codigo);

-- 4. Seguridad (RLS) --------------------------------------------------------
-- La app es una web kiosco pública sin login de usuarios reales, por lo que
-- se habilitan políticas permisivas para el rol "anon" (clave publishable).
-- IMPORTANTE: en Supabase, ve a Database > Policies y confirma que estas
-- políticas existan (el SQL Editor a veces requiere ejecutarlas por separado).
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE stands ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas_estaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cromos_secretos ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_usuarios_select ON usuarios FOR SELECT USING (true);
CREATE POLICY public_usuarios_insert ON usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY public_usuarios_update ON usuarios FOR UPDATE USING (true);

CREATE POLICY public_stands_select ON stands FOR SELECT USING (true);

CREATE POLICY public_visitas_select ON visitas_estaciones FOR SELECT USING (true);
CREATE POLICY public_visitas_insert ON visitas_estaciones FOR INSERT WITH CHECK (true);
-- UPDATE hace falta: valoración por estrellas (rateStamp) y upgrade manual→qr
CREATE POLICY public_visitas_update ON visitas_estaciones FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY public_cromos_select ON cromos_secretos FOR SELECT USING (true);
CREATE POLICY public_cromos_insert ON cromos_secretos FOR INSERT WITH CHECK (true);
CREATE POLICY public_cromos_update ON cromos_secretos FOR UPDATE USING (true);
