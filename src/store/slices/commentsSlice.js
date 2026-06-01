export const createCommentsSlice = (set) => ({
	comments: [],
	commentsLoading: false,
	commentsError: null,
	submitting: false,

	fetchComments: async (slug) => {
		set({ commentsLoading: true, commentsError: null });
		try {
			const res = await fetch(`/api/comments/${slug}`);
			if (!res.ok) throw new Error("Error al cargar comentarios");
			const comments = await res.json();
			set({ comments, commentsLoading: false });
		} catch (e) {
			set({ commentsError: e.message, commentsLoading: false });
		}
	},

	submitComment: async ({ slug, author, content, token }) => {
		set({ submitting: true });
		try {
			const res = await fetch(`/api/comments/${slug}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ author, content, token }),
			});
			return res.ok;
		} catch {
			return false;
		} finally {
			set({ submitting: false });
		}
	},
});
