// Utilidades
import { initials } from "../../utils/string";

// Props del componente CommentCard
//  - comment: { author, content, created_at }
//  - lang: "es" | "en" (para formatear fecha)

// Tarjeta individual de comentario con avatar de iniciales
function CommentCard({ comment, lang = "es" }) {
	const date = new Date(comment.created_at * 1000).toLocaleDateString(
		lang === "en" ? "en-US" : "es-ES",
		{ year: "numeric", month: "long", day: "numeric" },
	);

	return (
		<div className="bg-bg-card p-5 rounded-lg border border-border-subtle shadow-sm flex gap-4 transition-transform hover:-translate-y-0.5 duration-300">
			{/* Avatar con iniciales */}
			<div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm select-none">
				{initials(comment.author)}
			</div>
			<div className="flex-1">
				<div className="flex items-center justify-between mb-2">
					<span className="font-bold text-text-primary text-base">
						{comment.author}
					</span>
					{/* Fecha del comentario */}
					<span className="text-xs text-text-muted font-medium bg-bg-subtle px-2 py-1 rounded-md border border-border-subtle">
						{date}
					</span>
				</div>
				<p className="text-text-secondary whitespace-pre-wrap text-sm leading-relaxed">
					{comment.content}
				</p>
			</div>
		</div>
	);
}

export default CommentCard;
