import { afterEach, describe, expect, it, vi } from "vitest";
import { TurnstileValidator } from "./turnstileValidator";

describe("TurnstileValidator", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("rechaza si falta token o secretKey", async () => {
		const validator = new TurnstileValidator();

		expect(await validator.verify("", "secret-key")).toBe(false);
		expect(await validator.verify("token", "")).toBe(false);
	});

	it("retorna true cuando la API de Cloudflare responde exitosamente", async () => {
		const validator = new TurnstileValidator();

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ success: true }),
		});

		const result = await validator.verify(
			"valid-token",
			"valid-secret",
			"1.2.3.4",
		);
		expect(result).toBe(true);
		expect(global.fetch).toHaveBeenCalledTimes(1);
	});

	it("retorna false cuando la API responde success: false", async () => {
		const validator = new TurnstileValidator();

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ success: false }),
		});

		const result = await validator.verify("invalid-token", "secret", "1.2.3.4");
		expect(result).toBe(false);
	});

	it("retorna false si ocurre un error de red o excepción", async () => {
		const validator = new TurnstileValidator();

		global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

		const result = await validator.verify("token", "secret", "1.2.3.4");
		expect(result).toBe(false);
	});
});
