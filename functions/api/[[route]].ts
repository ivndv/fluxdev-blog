/**
 * API de comentarios para el blog: gestión de CRUD con Hono, D1, KV y Turnstile.
 *
 * @description Endpoint para obtener y crear comentarios con validación, rate limiting y cache.
 * @runtime Cloudflare Pages Functions (adaptado desde Workers)
 * @dependencies D1 (persistencia), KV (cache + rate limiting), Turnstile (anti-spam)
 */

import { Hono } from "hono";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

/**
 * Bindings de Cloudflare disponibles en el runtime del Worker.
 */
type Env = {
	DB: D1Database;
	KV: KVNamespace;
	TURNSTILE_SECRET_KEY: string;
};

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const FETCH_TIMEOUT_MS = 5000;

const app = new Hono<{ Bindings: Env }>();

const CommentSchema = z.object({
	author: z.string().trim().min(1, "Author required").max(50, "Author too long"),
	content: z.string().trim().min(1, "Content required").max(1000, "Content too long"),
	token: z.string().min(1, "Captcha token required"),
});

const checkRateLimit = async (
	kv: KVNamespace,
	ip: string,
): Promise<boolean> => {
	const key = `rate-limit:comment:${ip}`;
	const now = Date.now();

	const data = (await kv.get(key, "json")) as {
		attempts: number;
		resetAt: number;
	} | null;

	if (!data || now > data.resetAt) {
		await kv.put(
			key,
			JSON.stringify({ attempts: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }),
			{ expirationTtl: 900 },
		);
		return true;
	}

	if (data.attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
		return false;
	}

	await kv.put(
		key,
		JSON.stringify({ attempts: data.attempts + 1, resetAt: data.resetAt }),
		{
			expirationTtl: Math.floor((data.resetAt - now) / 1000),
		},
	);

	return true;
};

/**
 * GET /api/comments/:slug - Obtiene comentarios para un post.
 *
 * @behavior
 * - Primero consulta cache en KV (TTL: 5 min)
 * - Si no hay cache, consulta D1 y popula cache
 * - Retorna header X-Cache: HIT/MISS para debugging
 *
 * @response 200: Array de comentarios | 400: Slug faltante | 500: Error de servidor
 */
app.get("/api/comments/:slug", async (c) => {
	const slug = c.req.param("slug");

	try {
		// 1. Intentar obtener desde cache KV
		const cached = await c.env.KV.get(`comments:${slug}`, "json");
		if (cached) {
			return c.json(cached, 200, { "X-Cache": "HIT" });
		}

		// 2. Consultar D1 si no hay cache
		const { results } = await c.env.DB.prepare(
			"SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC",
		)
			.bind(slug)
			.all();

		// 3. Guardar resultado en cache por 5 minutos
		await c.env.KV.put(`comments:${slug}`, JSON.stringify(results), {
			expirationTtl: 300,
		});

		return c.json(results, 200, { "X-Cache": "MISS" });
	} catch (e) {
		console.error(e);
		return c.json({ error: "Error fetching comments" }, 500);
	}
});

/**
 * POST /api/comments/:slug - Crea un nuevo comentario.
 *
 * @behavior
 * 1. Rate limiting: 5 intentos por IP cada 15 min
 * 2. Validación de entrada con Zod (author, content, token)
 * 3. Verificación de token Turnstile con API de Cloudflare
 * 4. Inserción en D1 con parámetros vinculados (previene SQL injection)
 * 5. Invalidación de cache para el post afectado
 *
 * @response 201: Creado | 400: Validación fallida | 403: Captcha inválido | 429: Rate limit | 500: Error de servidor
 */
app.post("/api/comments/:slug", async (c) => {
	const slug = c.req.param("slug");

	try {
		// 1. Validación de cuerpo con Zod (antes del rate limit para no gastar intentos con bodies inválidos)
		const body = await c.req.json();
		const result = CommentSchema.safeParse(body);
		if (!result.success) {
			return c.json(
				{ error: "Invalid data", details: result.error.issues },
				400,
			);
		}
		let { author, content, token } = result.data;

		// 2. Rate limiting por IP
		const ip = c.req.header("CF-Connecting-IP") || "unknown";
		const allowed = await checkRateLimit(c.env.KV, ip);
		if (!allowed) {
			return c.json(
				{ error: "Too many comments. Please try again in 15 minutes." },
				429,
			);
		}

		// 3. Sanitizar HTML en contenido (defensa en profundidad)
		content = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
		author = sanitizeHtml(author, { allowedTags: [], allowedAttributes: {} });

		// 4. Verificación de token Turnstile con timeout
		const formData = new FormData();
		formData.append("secret", c.env.TURNSTILE_SECRET_KEY);
		formData.append("response", token);
		formData.append("remoteip", ip);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
		let outcome: { success: boolean };
		try {
			const verifyResult = await fetch(
				"https://challenges.cloudflare.com/turnstile/v0/siteverify",
				{ method: "POST", body: formData, signal: controller.signal },
			);
			outcome = (await verifyResult.json()) as { success: boolean };
		} finally {
			clearTimeout(timeoutId);
		}

		if (!outcome.success) {
			return c.json({ error: "Invalid Captcha" }, 403);
		}

		// 5. Insertar comentario en D1
		const { success } = await c.env.DB.prepare(
			"INSERT INTO comments (post_slug, author, content) VALUES (?, ?, ?)",
		)
			.bind(slug, author, content)
			.run();

		if (!success) {
			return c.json({ error: "Failed to add comment" }, 500);
		}

		// 6. Invalidar cache del post para reflejar nuevo comentario
		await c.env.KV.delete(`comments:${slug}`);

		return c.json({ message: "Comment added" }, 201);
	} catch (e) {
		console.error({ error: e instanceof Error ? e.message : e, slug, ip: c.req.header("CF-Connecting-IP") });
		return c.json({ error: "Server error" }, 500);
	}
});

/**
 * Adapter para Cloudflare Pages Functions.
 * Convierte el contexto de Pages al formato que espera Hono.
 * @param context - Contexto de Cloudflare Pages
 * @returns {Promise<Response>} Respuesta generada por Hono
 */
export const onRequest: PagesFunction<Env> = async (context) => {
	return app.fetch(context.request, context.env);
};
