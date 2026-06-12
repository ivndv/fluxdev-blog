// Definición de tipos para el runtime de Cloudflare Workers

/// <reference path="../.astro/types.d.ts" />

// Tipos de Cloudflare Workers importados dinámicamente
type D1Database = import("@cloudflare/workers-types").D1Database;
type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

// Bindings disponibles en el Hono Worker (DB, KV, Turnstile)
type ENV = {
	// Base de datos D1 para comentarios
	DB: D1Database;
	// KV para cache y rate limiting
	KV: KVNamespace;
	// Secret key de Turnstile para validación server-side
	TURNSTILE_SECRET_KEY: string;
};
