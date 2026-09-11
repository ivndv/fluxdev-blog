import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import { createCommentsController } from "./commentsController";

describe("commentsController", () => {
	const mockEnv = {
		DB: {} as D1Database,
		KV: {} as KVNamespace,
		TURNSTILE_SECRET_KEY: "secret-key",
	};

	describe("getComments", () => {
		it("retorna comentarios desde cache KV con header X-Cache: HIT", async () => {
			const mockComments = [
				{
					id: 1,
					post_slug: "test-slug",
					author: "Ivan",
					content: "Hola mundo",
				},
			];

			const mockCacheService = {
				getCachedComments: vi.fn().mockResolvedValue(mockComments),
				setCommentsCache: vi.fn(),
				invalidateCommentsCache: vi.fn(),
			};
			const mockDbService = {
				getComments: vi.fn(),
				insertComment: vi.fn(),
			};

			const controller = createCommentsController({
				cacheService: mockCacheService as never,
				dbService: mockDbService as never,
			});

			const mockContext = {
				req: {
					param: vi.fn().mockReturnValue("test-slug"),
				},
				env: mockEnv,
				json: vi.fn().mockImplementation((data, status, headers) => ({
					data,
					status,
					headers,
				})),
			} as unknown as Context;

			const response = await controller.getComments(mockContext as never);

			expect(mockCacheService.getCachedComments).toHaveBeenCalledWith(
				mockEnv.KV,
				"test-slug",
			);
			expect(mockDbService.getComments).not.toHaveBeenCalled();
			expect(mockContext.json).toHaveBeenCalledWith(mockComments, 200, {
				"X-Cache": "HIT",
			});
		});

		it("consulta la BD D1 y guarda en cache si no hay cache previa (MISS)", async () => {
			const mockDbComments = [
				{
					id: 2,
					post_slug: "test-slug",
					author: "Maria",
					content: "Otro comentario",
				},
			];

			const mockCacheService = {
				getCachedComments: vi.fn().mockResolvedValue(null),
				setCommentsCache: vi.fn().mockResolvedValue(undefined),
				invalidateCommentsCache: vi.fn(),
			};
			const mockDbService = {
				getComments: vi.fn().mockResolvedValue(mockDbComments),
				insertComment: vi.fn(),
			};

			const controller = createCommentsController({
				cacheService: mockCacheService as never,
				dbService: mockDbService as never,
			});

			const mockContext = {
				req: {
					param: vi.fn().mockReturnValue("test-slug"),
				},
				env: mockEnv,
				json: vi.fn().mockImplementation((data, status, headers) => ({
					data,
					status,
					headers,
				})),
			} as unknown as Context;

			await controller.getComments(mockContext as never);

			expect(mockCacheService.getCachedComments).toHaveBeenCalled();
			expect(mockDbService.getComments).toHaveBeenCalledWith(
				mockEnv.DB,
				"test-slug",
			);
			expect(mockCacheService.setCommentsCache).toHaveBeenCalledWith(
				mockEnv.KV,
				"test-slug",
				mockDbComments,
			);
			expect(mockContext.json).toHaveBeenCalledWith(mockDbComments, 200, {
				"X-Cache": "MISS",
			});
		});
	});

	describe("createComment", () => {
		it("rechaza peticiones con datos inválidos (400)", async () => {
			const controller = createCommentsController();

			const mockContext = {
				req: {
					param: vi.fn().mockReturnValue("test-slug"),
					json: vi.fn().mockResolvedValue({ author: "", content: "" }),
				},
				env: mockEnv,
				json: vi.fn().mockImplementation((data, status) => ({ data, status })),
			} as unknown as Context;

			await controller.createComment(mockContext as never);

			expect(mockContext.json).toHaveBeenCalledWith(
				expect.objectContaining({ error: "Invalid data" }),
				400,
			);
		});

		it("bloquea por rate limit si la IP excedió intentos (429)", async () => {
			const mockRateLimiter = {
				checkRateLimit: vi.fn().mockResolvedValue(false),
			};

			const controller = createCommentsController({
				rateLimiter: mockRateLimiter as never,
			});

			const mockContext = {
				req: {
					param: vi.fn().mockReturnValue("test-slug"),
					json: vi.fn().mockResolvedValue({
						author: "Ivan",
						content: "Comentario válido",
						token: "turnstile-token",
					}),
					header: vi.fn().mockReturnValue("127.0.0.1"),
				},
				env: mockEnv,
				json: vi.fn().mockImplementation((data, status) => ({ data, status })),
			} as unknown as Context;

			await controller.createComment(mockContext as never);

			expect(mockContext.json).toHaveBeenCalledWith(
				expect.objectContaining({
					error: "Too many comments. Please try again in 15 minutes.",
				}),
				429,
			);
		});

		it("crea el comentario con éxito e invalida cache (201)", async () => {
			const mockRateLimiter = {
				checkRateLimit: vi.fn().mockResolvedValue(true),
			};
			const mockTurnstileValidator = {
				verify: vi.fn().mockResolvedValue(true),
			};
			const mockDbService = {
				getComments: vi.fn(),
				insertComment: vi.fn().mockResolvedValue(true),
			};
			const mockCacheService = {
				getCachedComments: vi.fn(),
				setCommentsCache: vi.fn(),
				invalidateCommentsCache: vi.fn().mockResolvedValue(undefined),
			};

			const controller = createCommentsController({
				rateLimiter: mockRateLimiter as never,
				turnstileValidator: mockTurnstileValidator as never,
				dbService: mockDbService as never,
				cacheService: mockCacheService as never,
			});

			const mockContext = {
				req: {
					param: vi.fn().mockReturnValue("test-slug"),
					json: vi.fn().mockResolvedValue({
						author: "Ivan Dev",
						content: "Excelente post",
						token: "valid-token",
					}),
					header: vi.fn().mockReturnValue("127.0.0.1"),
				},
				env: mockEnv,
				json: vi.fn().mockImplementation((data, status) => ({ data, status })),
			} as unknown as Context;

			await controller.createComment(mockContext as never);

			expect(mockTurnstileValidator.verify).toHaveBeenCalledWith(
				mockEnv.TURNSTILE_SECRET_KEY,
				"valid-token",
				"127.0.0.1",
			);
			expect(mockDbService.insertComment).toHaveBeenCalledWith(
				mockEnv.DB,
				"test-slug",
				"Ivan Dev",
				"Excelente post",
			);
			expect(mockCacheService.invalidateCommentsCache).toHaveBeenCalledWith(
				mockEnv.KV,
				"test-slug",
			);
			expect(mockContext.json).toHaveBeenCalledWith(
				{ message: "Comment added" },
				201,
			);
		});
	});
});
