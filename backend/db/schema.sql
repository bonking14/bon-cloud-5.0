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
