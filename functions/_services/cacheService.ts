// CacheService - Gestión de cache de comentarios en Cloudflare Workers KV
const CACHE_TTL_SECONDS = 300;

export class CacheService {
	/**
	 * Obtiene los comentarios cacheados de un post
	 */
	async getCachedComments<T = unknown[]>(
		kv: KVNamespace,
		slug: string,
	): Promise<T | null> {
		return kv.get(`comments:${slug}`, "json") as Promise<T | null>;
	}

	/**
	 * Guarda los comentarios en cache con TTL de 5 minutos
	 */
	async setCommentsCache<T = unknown[]>(
		kv: KVNamespace,
		slug: string,
		data: T,
	): Promise<void> {
		await kv.put(`comments:${slug}`, JSON.stringify(data), {
			expirationTtl: CACHE_TTL_SECONDS,
		});
	}

	/**
	 * Invalida la cache de un post tras agregar un nuevo comentario
	 */
	async invalidateCommentsCache(kv: KVNamespace, slug: string): Promise<void> {
		await kv.delete(`comments:${slug}`);
	}
}

export const cacheService = new CacheService();
