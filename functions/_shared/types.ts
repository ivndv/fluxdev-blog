// Tipos compartidos para el backend de Cloudflare Pages Functions

export interface Env {
	DB: D1Database;
	KV: KVNamespace;
	TURNSTILE_SECRET_KEY: string;
}

export interface Comment {
	id?: number;
	post_slug: string;
	author: string;
	content: string;
	created_at?: string;
}

export interface ApiResponse<T = unknown> {
	message?: string;
	error?: string;
	details?: unknown;
	data?: T;
}
