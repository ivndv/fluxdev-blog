import { describe, expect, it } from "vitest";
import { CommentSchema } from "./schema";

describe("CommentSchema", () => {
	it("valida un comentario con datos correctos", () => {
		const validData = {
			author: "Ivan Dev",
			content: "Excelente artículo sobre Astro y Cloudflare Workers.",
			token: "valid-turnstile-token",
		};

		const result = CommentSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("falla si el autor está vacío o falta", () => {
		const invalidData = {
			author: "",
			content: "Buen post",
			token: "valid-token",
		};

		const result = CommentSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("falla si el contenido excede los 1000 caracteres", () => {
		const invalidData = {
			author: "Usuario",
			content: "a".repeat(1001),
			token: "valid-token",
		};

		const result = CommentSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("falla si no se proporciona el token de Turnstile", () => {
		const invalidData = {
			author: "Usuario",
			content: "Buen post",
			token: "",
		};

		const result = CommentSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
