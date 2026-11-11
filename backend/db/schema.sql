-- Esquema de BonCloud. Es idempotente: se puede ejecutar varias veces sin romper nada
-- (npm run db:migrate). La tabla usuarios ya existe en producción, por eso las columnas
-- nuevas se agregan con ADD COLUMN IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS usuarios (
  id                SERIAL PRIMARY KEY,
  nombre            VARCHAR(100) NOT NULL,
  email             VARCHAR(254) NOT NULL UNIQUE,
  password          VARCHAR(255) NOT NULL,
  intentos_fallidos INTEGER      NOT NULL DEFAULT 0,
  bloqueado         BOOLEAN      NOT NULL DEFAULT FALSE,
  bloqueado_hasta   TIMESTAMPTZ,
  ultimo_login      TIMESTAMPTZ,
  creado_en         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Por si la tabla de producción se creó antes de alguna de estas columnas
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS intentos_fallidos INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS bloqueado BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMPTZ;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS bloqueado_hasta TIMESTAMPTZ;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- El login y el registro buscan por LOWER(email)
CREATE INDEX IF NOT EXISTS usuarios_email_lower_idx ON usuarios (LOWER(email));

CREATE TABLE IF NOT EXISTS progreso_usuario (
  usuario_id    INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  leccion_id    INTEGER     NOT NULL,
  completada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, leccion_id)
);

-- ── Cuentas: roles y verificación de correo ──
-- Los usuarios que ya existen quedan como estudiante y con el correo sin verificar.
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol VARCHAR(20) NOT NULL DEFAULT 'estudiante';
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS email_verificado_en TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_rol_valido') THEN
    ALTER TABLE usuarios ADD CONSTRAINT usuarios_rol_valido CHECK (rol IN ('estudiante', 'profesor', 'administrador'));
  END IF;
END $$;

-- Enlaces de un solo uso para recuperar la contraseña y verificar el correo.
-- Se guarda la huella SHA-256 del enlace, nunca el enlace: quien lea la base no puede usarlos.
CREATE TABLE IF NOT EXISTS tokens_cuenta (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo       VARCHAR(20) NOT NULL CHECK (tipo IN ('recuperar', 'verificar')),
  token_hash CHAR(64)    NOT NULL UNIQUE,
  expira_en  TIMESTAMPTZ NOT NULL,
  usado_en   TIMESTAMPTZ,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS tokens_cuenta_usuario_idx ON tokens_cuenta (usuario_id, tipo);

-- ── Grupos de un profesor y notas de los quizzes ──
CREATE TABLE IF NOT EXISTS grupos (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  profesor_id INTEGER      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  -- Código que el profesor comparte para que sus estudiantes se unan
  codigo      VARCHAR(12)  NOT NULL UNIQUE,
  archivado   BOOLEAN      NOT NULL DEFAULT FALSE,
  creado_en   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS grupos_profesor_idx ON grupos (profesor_id);

CREATE TABLE IF NOT EXISTS grupo_miembros (
  grupo_id   INTEGER     NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
  usuario_id INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  unido_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (grupo_id, usuario_id)
);
CREATE INDEX IF NOT EXISTS grupo_miembros_usuario_idx ON grupo_miembros (usuario_id);

-- Un registro por cada quiz terminado, aprobado o no
CREATE TABLE IF NOT EXISTS intentos_quiz (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  leccion_id INTEGER     NOT NULL,
  aciertos   INTEGER     NOT NULL CHECK (aciertos >= 0),
  total      INTEGER     NOT NULL CHECK (total > 0 AND aciertos <= total),
  aprobado   BOOLEAN     NOT NULL,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS intentos_quiz_usuario_idx ON intentos_quiz (usuario_id, leccion_id);

-- ── Examen final por módulo y certificado ──
-- Cada examen guarda qué preguntas le tocaron al estudiante y en qué orden salieron las
-- opciones; el servidor califica con eso, no con lo que diga el navegador.
CREATE TABLE IF NOT EXISTS examenes (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo      INTEGER     NOT NULL,
  preguntas   JSONB       NOT NULL,
  iniciado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira_en   TIMESTAMPTZ NOT NULL,
  enviado_en  TIMESTAMPTZ,
  aciertos    INTEGER,
  total       INTEGER     NOT NULL,
  aprobado    BOOLEAN
);
CREATE INDEX IF NOT EXISTS examenes_usuario_idx ON examenes (usuario_id, modulo);

CREATE TABLE IF NOT EXISTS certificados (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER     NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  -- Código público con el que cualquiera comprueba el certificado
  codigo     VARCHAR(16) NOT NULL UNIQUE,
  -- Nombre y nota tal como eran al emitirlo: no cambian si el usuario edita su perfil
  nombre     VARCHAR(100) NOT NULL,
  nota       INTEGER     NOT NULL,
  emitido_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
