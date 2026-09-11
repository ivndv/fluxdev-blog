import { describe, expect, it } from "vitest";
import { RateLimiter } from "./rateLimiter";

// Mock minimal de KVNamespace
const createMockKV = (store: Record<string, string> = {}) => {
	return {
		get: async (key: string, type?: string) => {
			const val = store[key];
			if (!val) return null;
			return type === "json" ? JSON.parse(val) : val;
		},
		put: async (key: string, value: string) => {
			store[key] = value;
		},
		delete: async (key: string) => {
			delete store[key];
		},
	} as unknown as KVNamespace;
};

describe("RateLimiter", () => {
	it("permite el primer intento y registra en KV", async () => {
		const kv = createMockKV();
		const limiter = new RateLimiter();

		const allowed = await limiter.checkRateLimit(kv, "192.168.1.1");
		expect(allowed).toBe(true);
	});

	it("permite intentos hasta el límite máximo de 5", async () => {
		const kv = createMockKV();
		const limiter = new RateLimiter();

		for (let i = 0; i < 5; i++) {
			const allowed = await limiter.checkRateLimit(kv, "192.168.1.1");
			expect(allowed).toBe(true);
		}

		// El 6to intento debe ser bloqueado
		const blocked = await limiter.checkRateLimit(kv, "192.168.1.1");
		expect(blocked).toBe(false);
	});

	it("mantiene contadores independientes para diferentes IPs", async () => {
		const kv = createMockKV();
		const limiter = new RateLimiter();

		for (let i = 0; i < 5; i++) {
			await limiter.checkRateLimit(kv, "10.0.0.1");
		}

		expect(await limiter.checkRateLimit(kv, "10.0.0.1")).toBe(false);
		expect(await limiter.checkRateLimit(kv, "10.0.0.2")).toBe(true);
	});
});
