import { z } from "zod";

// Esquema de validación para comentarios
export const CommentSchema = z.object({
	author: z.string().trim().min(1, "Author required").max(50, "Author too long"),
	content: z.string().trim().min(1, "Content required").max(1000, "Content too long"),
	token: z.string().min(1, "Captcha token required"),
});

// Tipo inferido del schema (sin token, solo datos útiles)
export type CommentInput = z.infer<typeof CommentSchema>;
