import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { commentsController } from "../_controllers/commentsController";
import type { Env } from "../_shared/types";

// Instancia de Hono tipada con los bindings de Cloudflare (D1, KV, Turnstile)
export const app = new Hono<{ Bindings: Env }>();

// GET /api/comments/:slug - Obtiene comentarios de un post con cache en KV
app.get("/api/comments/:slug", commentsController.getComments);

// POST /api/comments/:slug - Crea un comentario con validación, rate limit y captcha
app.post("/api/comments/:slug", commentsController.createComment);

// Adaptador para Cloudflare Pages Functions
export const onRequest = handle(app);
