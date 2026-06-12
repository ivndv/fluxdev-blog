// Cache - Gestión de cache de comentarios en KV
const CACHE_TTL_SECONDS = 300;

// Obtiene los comentarios cacheados de un post
export async function getCachedComments(
	kv: KVNamespace,
	slug: string,
): Promise<unknown[] | null> {
	return kv.get(`comments:${slug}`, "json") as Promise<unknown[] | null>;
}

// Guarda los comentarios en cache
export async function setCommentsCache(
	kv: KVNamespace,
	slug: string,
	data: unknown[],
): Promise<void> {
	await kv.put(`comments:${slug}`, JSON.stringify(data), {
		expirationTtl: CACHE_TTL_SECONDS,
	});
}

// Invalida la cache de un post
export async function invalidateCommentsCache(
	kv: KVNamespace,
	slug: string,
): Promise<void> {
	await kv.delete(`comments:${slug}`);
}
