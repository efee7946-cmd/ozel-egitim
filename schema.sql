-- Yıldız Sınıfı — Aiven PostgreSQL şeması
-- Aiven Console → Services → projen → Query Editor'a yapıştır ve çalıştır.

CREATE TABLE IF NOT EXISTS users (
    username       TEXT PRIMARY KEY,
    display_name   TEXT NOT NULL,
    hash           TEXT NOT NULL,
    salt           TEXT NOT NULL,
    email          TEXT,
    email_verified BOOLEAN DEFAULT false,
    data_key       TEXT,
    created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_key TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_attempts INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_expires TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_attempts INT DEFAULT 0;

CREATE TABLE IF NOT EXISTS sessions (
    token        TEXT PRIMARY KEY,
    username     TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    expires_at   TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS app_data (
    user_key   TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);
