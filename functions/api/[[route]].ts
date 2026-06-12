// Hono
import { Hono } from "hono";
// Sanitización
import sanitizeHtml from "sanitize-html";
// Compartidos
import { CommentSchema } from "../_shared/schema";
import { checkRateLimit } from "../_shared/rateLimit";
import { verifyTurnstile } from "../_shared/turnstile";
import { getComments, insertComment } from "../_shared/db";
import { getCachedComments, setCommentsCache, invalidateCommentsCache } from "../_shared/cache";

// Bindings de Cloudflare disponibles en el runtime del Worker
type Env = {
	DB: D1Database;
	KV: KVNamespace;
	TURNSTILE_SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

// GET /api/comments/:slug - Obtiene comentarios de un post con cache en KV
app.get("/api/comments/:slug", async (c) => {
	const slug = c.req.param("slug");

	try {
		// 1. Intenta obtener desde cache KV
		const cached = await getCachedComments(c.env.KV, slug);
		if (cached) {
			return c.json(cached, 200, { "X-Cache": "HIT" });
		}

		// 2. Consulta D1 si no hay cache
		const results = await getComments(c.env.DB, slug);

		// 3. Guarda en cache por 5 minutos
		await setCommentsCache(c.env.KV, slug, results);

		return c.json(results, 200, { "X-Cache": "MISS" });
	} catch (e) {
		console.error(e);
		return c.json({ error: "Error fetching comments" }, 500);
	}
});

// POST /api/comments/:slug - Crea un comentario con validación y rate limiting
app.post("/api/comments/:slug", async (c) => {
	const slug = c.req.param("slug");

	try {
		// 1. Valida el cuerpo con Zod
		const body = await c.req.json();
		const result = CommentSchema.safeParse(body);
		if (!result.success) {
			return c.json({ error: "Invalid data", details: result.error.issues }, 400);
		}
		let { author, content } = result.data;

		// 2. Rate limiting por IP
		const ip = c.req.header("CF-Connecting-IP") || "unknown";
		const allowed = await checkRateLimit(c.env.KV, ip);
		if (!allowed) {
			return c.json({ error: "Too many comments. Please try again in 15 minutes." }, 429);
		}

		// 3. Sanitiza HTML (defensa en profundidad contra XSS)
		content = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} });
		author = sanitizeHtml(author, { allowedTags: [], allowedAttributes: {} });

		// 4. Verifica el token Turnstile
		const turnstileOk = await verifyTurnstile(c.env.TURNSTILE_SECRET_KEY, result.data.token, ip);
		if (!turnstileOk) {
			return c.json({ error: "Invalid Captcha" }, 403);
		}

		// 5. Inserta el comentario en D1
		const ok = await insertComment(c.env.DB, slug, author, content);
		if (!ok) {
			return c.json({ error: "Failed to add comment" }, 500);
		}

		// 6. Invalida la cache del post
		await invalidateCommentsCache(c.env.KV, slug);

		return c.json({ message: "Comment added" }, 201);
	} catch (e) {
		console.error({ error: e instanceof Error ? e.message : e, slug, ip: c.req.header("CF-Connecting-IP") });
		return c.json({ error: "Server error" }, 500);
	}
});

// Adapter para Cloudflare Pages Functions
export const onRequest: PagesFunction<Env> = async (context) => {
	return app.fetch(context.request, context.env);
};
