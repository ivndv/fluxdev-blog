// React
import { useEffect } from "react";
// Store
import { useStore } from "../../store/store";
// Traducciones
import { useTranslations } from "../../i18n/ui";
// Hooks
import { useTurnstile } from "../../hooks/useTurnstile";
// Componentes
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";

// Sección de comentarios de un post con lista y formulario
function Comments({ slug, lang = "es" }) {
	const comments = useStore((s) => s.comments);
	const commentsLoading = useStore((s) => s.commentsLoading);
	const commentsError = useStore((s) => s.commentsError);
	const submitting = useStore((s) => s.submitting);
	const fetchComments = useStore((s) => s.fetchComments);
	const submitComment = useStore((s) => s.submitComment);
	const t = useTranslations(lang);
	const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

	// 1. Renderiza el widget Turnstile al montar el componente
	useTurnstile(siteKey);

	// 2. Carga los comentarios al montar o cambiar de post
	useEffect(() => {
		fetchComments(slug);
	}, [slug, fetchComments]);

	return (
		<div className="mt-16 pt-8 border-t border-border-subtle" id="comments-section">
			<h3 className="text-2xl font-bold mb-6 text-text-primary">
				{t("comments.title")}
			</h3>

			{/* Lista de comentarios */}
			<div className="space-y-6 mb-10">
				{commentsLoading ? (
					<p className="text-text-muted italic">{t("comments.loading")}</p>
				) : commentsError ? (
					<p className="text-red-500">{t("comments.loadError")}</p>
				) : comments.length === 0 ? (
					<p className="text-text-muted">{t("comments.empty")}</p>
				) : (
					comments.map((comment, idx) => (
						<div key={comment.id || idx} style={{ animationDelay: `${idx * 100}ms` }}>
							<CommentCard comment={comment} lang={lang} />
						</div>
					))
				)}
			</div>

			{/* Formulario de nuevo comentario */}
			<CommentForm
				lang={lang}
				siteKey={siteKey}
				submitting={submitting}
				onSubmit={(data) => {
					return submitComment({ ...data, slug }).then((ok) => {
						if (ok) fetchComments(slug);
						return ok;
					});
				}}
			/>
		</div>
	);
}

export default Comments;
