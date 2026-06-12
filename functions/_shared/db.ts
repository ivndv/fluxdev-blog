// DB - Operaciones contra D1 (base de datos SQLite en el edge)

// Obtiene los comentarios de un post ordenados por fecha descendente
export async function getComments(
	db: D1Database,
	slug: string,
): Promise<unknown[]> {
	const { results } = await db.prepare(
		"SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC",
	)
		.bind(slug)
		.all();
	return results;
}

// Inserta un nuevo comentario en la base de datos
export async function insertComment(
	db: D1Database,
	slug: string,
	author: string,
	content: string,
): Promise<boolean> {
	const { success } = await db.prepare(
		"INSERT INTO comments (post_slug, author, content) VALUES (?, ?, ?)",
	)
		.bind(slug, author, content)
		.run();
	return success;
}
