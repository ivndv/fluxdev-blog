-- Schema de base de datos D1 para comentarios del blog

-- Tabla de comentarios: id, post_slug, autor, contenido y timestamp
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Indice para optimizar consultas por slug de post
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);