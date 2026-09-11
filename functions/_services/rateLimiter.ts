// RateLimiter - Control de tráfico por IP basado en Cloudflare Workers KV
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5;
const TTL_SECONDS = 900; // 15 minutos

export interface RateLimitData {
	attempts: number;
	resetAt: number;
}

export class RateLimiter {
	/**
	 * Verifica si la IP no ha excedido el límite de comentarios permitidos
	 */
	async checkRateLimit(kv: KVNamespace, ip: string): Promise<boolean> {
		const key = `rate-limit:comment:${ip}`;
		const now = Date.now();

		const data = (await kv.get(key, "json")) as RateLimitData | null;

		// 1. Si no hay registro previo o la ventana expiró, crea un nuevo ciclo
		if (!data || now > data.resetAt) {
			await kv.put(
				key,
				JSON.stringify({ attempts: 1, resetAt: now + WINDOW_MS }),
				{ expirationTtl: TTL_SECONDS },
			);
			return true;
		}

		// 2. Si excedió el número máximo de intentos dentro de la ventana
		if (data.attempts >= MAX_ATTEMPTS) {
			return false;
		}

		// 3. Incrementa el contador y actualiza en KV
		await kv.put(
			key,
			JSON.stringify({ attempts: data.attempts + 1, resetAt: data.resetAt }),
			{
				expirationTtl: Math.floor((data.resetAt - now) / 1000),
			},
		);

		return true;
	}
}

export const rateLimiter = new RateLimiter();
