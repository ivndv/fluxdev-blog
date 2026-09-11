import type { Context } from "hono";
import sanitizeHtml from "sanitize-html";
import { cacheService as defaultCacheService } from "../_services/cacheService";
import { dbService as defaultDbService } from "../_services/dbService";
import { rateLimiter as defaultRateLimiter } from "../_services/rateLimiter";
import { turnstileValidator as defaultTurnstileValidator } from "../_services/turnstileValidator";
import { CommentSchema } from "../_shared/schema";
import type { ApiResponse, Comment, Env } from "../_shared/types";

export interface CommentsControllerDependencies {
	cacheService?: typeof defaultCacheService;
	dbService?: typeof defaultDbService;
	rateLimiter?: typeof defaultRateLimiter;
	turnstileValidator?: typeof defaultTurnstileValidator;
}

/**
 * Fabrica el controlador de comentarios permitiendo inyección de dependencias
 */
export const createCommentsController = (
	deps: CommentsControllerDependencies = {},
) => {
	const cache = deps.cacheService || defaultCacheService;
	const db = deps.dbService || defaultDbService;
	const limiter = deps.rateLimiter || defaultRateLimiter;
	const turnstile = deps.turnstileValidator || defaultTurnstileValidator;

	return {
		/**
		 * GET /api/comments/:slug - Obtiene comentarios de un post con cache en KV
		 */
		async getComments(c: Context<{ Bindings: Env }>) {
			const slug = c.req.param("slug");

			try {
				// 1. Intenta obtener desde cache KV
				const cached = await cache.getCachedComments<Comment[]>(c.env.KV, slug);
				if (cached) {
					return c.json(cached, 200, { "X-Cache": "HIT" });
				}

				// 2. Consulta D1 si no hay cache
				const results = await db.getComments(c.env.DB, slug);

				// 3. Guarda en cache por 5 minutos
				await cache.setCommentsCache(c.env.KV, slug, results);

				return c.json(results, 200, { "X-Cache": "MISS" });
			} catch (e) {
				console.error("[CommentsController] Error al obtener comentarios:", e);
				return c.json<ApiResponse>({ error: "Error fetching comments" }, 500);
			}
		},

		/**
		 * POST /api/comments/:slug - Crea un comentario con validación, rate limit y Turnstile
		 */
		async createComment(c: Context<{ Bindings: Env }>) {
			const slug = c.req.param("slug");

			try {
				// 1. Valida el cuerpo con Zod
				const body = await c.req.json();
				const result = CommentSchema.safeParse(body);
				if (!result.success) {
					return c.json<ApiResponse>(
						{ error: "Invalid data", details: result.error.issues },
						400,
					);
				}
				let { author, content } = result.data;

				// 2. Control de tráfico por IP (Rate Limiter)
				const ip = c.req.header("CF-Connecting-IP") || "unknown";
				const allowed = await limiter.checkRateLimit(c.env.KV, ip);
				if (!allowed) {
					return c.json<ApiResponse>(
						{ error: "Too many comments. Please try again in 15 minutes." },
						429,
					);
				}

				// 3. Sanitización de HTML contra XSS
				content = sanitizeHtml(content, {
					allowedTags: [],
					allowedAttributes: {},
				});
				author = sanitizeHtml(author, {
					allowedTags: [],
					allowedAttributes: {},
				});

				// 4. Verificación de seguridad Turnstile
				const turnstileOk = await turnstile.verify(
					c.env.TURNSTILE_SECRET_KEY,
					result.data.token,
					ip,
				);
				if (!turnstileOk) {
					return c.json<ApiResponse>({ error: "Invalid Captcha" }, 403);
				}

				// 5. Inserción del comentario en D1
				const ok = await db.insertComment(c.env.DB, slug, author, content);
				if (!ok) {
					return c.json<ApiResponse>({ error: "Failed to add comment" }, 500);
				}

				// 6. Invalidación de la cache KV para este post
				await cache.invalidateCommentsCache(c.env.KV, slug);

				return c.json<ApiResponse>({ message: "Comment added" }, 201);
			} catch (e) {
				console.error("[CommentsController] Error al crear comentario:", {
					error: e instanceof Error ? e.message : e,
					slug,
					ip: c.req.header("CF-Connecting-IP"),
				});
				return c.json<ApiResponse>({ error: "Server error" }, 500);
			}
		},
	};
};

export const commentsController = createCommentsController();
