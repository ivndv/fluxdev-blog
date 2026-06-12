// Rate limiter basado en KV para limitar intentos por IP
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const TTL_SECONDS = 900;

// Verifica si la IP no ha excedido el límite de solicitudes
export async function checkRateLimit(
	kv: KVNamespace,
	ip: string,
): Promise<boolean> {
	const key = `rate-limit:comment:${ip}`;
	const now = Date.now();

	const data = (await kv.get(key, "json")) as {
		attempts: number;
		resetAt: number;
	} | null;

	// 1. Si no hay registro o expiró, crea uno nuevo
	if (!data || now > data.resetAt) {
		await kv.put(
			key,
			JSON.stringify({ attempts: 1, resetAt: now + WINDOW_MS }),
			{ expirationTtl: TTL_SECONDS },
		);
		return true;
	}

	// 2. Si excedió los intentos, rechaza
	if (data.attempts >= MAX_ATTEMPTS) {
		return false;
	}

	// 3. Incrementa el contador
	await kv.put(
		key,
		JSON.stringify({ attempts: data.attempts + 1, resetAt: data.resetAt }),
		{
			expirationTtl: Math.floor((data.resetAt - now) / 1000),
		},
	);

	return true;
}
