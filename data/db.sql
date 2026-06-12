-- Activa validacion de claves foraneas
PRAGMA defer_foreign_keys=TRUE;

-- Tabla de comentarios: almacena comentarios de los posts
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Indice para consultas por slug
CREATE INDEX idx_comments_post_slug ON comments(post_slug);
