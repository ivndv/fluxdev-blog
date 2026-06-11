// Slice de comentarios: fetch, submit y estados de carga/error
export const createCommentsSlice = (set) => ({
	// Estado inicial
	comments: [],
	commentsLoading: false,
	commentsError: null,
	submitting: false,

	// Obtiene los comentarios de un post por slug
	fetchComments: async (slug) => {
		// 1. Inicia carga y limpia error previo
		set({ commentsLoading: true, commentsError: null });
		try {
			// 2. Solicita comentarios al endpoint
			const res = await fetch(`/api/comments/${slug}`);
			if (!res.ok) throw new Error("Error al cargar comentarios");
			// 3. Almacena comentarios y finaliza carga
			const comments = await res.json();
			set({ comments, commentsLoading: false });
		} catch (e) {
			// 4. En caso de error, guarda el mensaje
			set({ commentsError: e.message, commentsLoading: false });
		}
	},

	// Envía un nuevo comentario al servidor
	submitComment: async ({ slug, author, content, token }) => {
		// 1. Marca envío en curso
		set({ submitting: true });
		try {
			// 2. POST al endpoint con datos del comentario
			const res = await fetch(`/api/comments/${slug}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ author, content, token }),
			});
			// 3. Retorna true si la request fue exitosa
			return res.ok;
		} catch {
			// 4. Retorna false si hubo error
			return false;
		} finally {
			// 5. Finaliza estado de envío
			set({ submitting: false });
		}
	},
});
