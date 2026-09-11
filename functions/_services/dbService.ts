import type { Comment } from "../_shared/types";

// DbService - Operaciones de base de datos contra Cloudflare D1
export class DbService {
	/**
	 * Obtiene los comentarios de un post ordenados por fecha descendente
	 */
	async getComments(db: D1Database, slug: string): Promise<Comment[]> {
		const { results } = await db
			.prepare(
				"SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC",
			)
			.bind(slug)
			.all<Comment>();
		return results;
	}

	/**
	 * Inserta un nuevo comentario en la base de datos
	 */
	async insertComment(
		db: D1Database,
		slug: string,
		author: string,
		content: string,
	): Promise<boolean> {
		const { success } = await db
			.prepare(
				"INSERT INTO comments (post_slug, author, content) VALUES (?, ?, ?)",
			)
			.bind(slug, author, content)
			.run();
		return success;
	}
}

export const dbService = new DbService();
