// React
import { useState } from "react";
// Traducciones
import { useTranslations } from "../../i18n/ui";

// Props del formulario de comentarios
//  - lang: "es" | "en"
//  - siteKey: clave pública de Turnstile
//  - submitting: bool (deshabilitar botón)
//  - onSubmit: ({ author, content }) => Promise<boolean>

// Formulario para agregar un comentario con Turnstile
function CommentForm({ lang, siteKey, submitting, onSubmit }) {
	const t = useTranslations(lang);
	const [author, setAuthor] = useState("");
	const [content, setContent] = useState("");
	const [msg, setMsg] = useState(null);
	const [msgType, setMsgType] = useState("neutral");

	// Maneja el envío del formulario de comentario
	const handleSubmit = async (e) => {
		// 1. Evita la recarga de la página
		e.preventDefault();
		// 2. Obtiene el token de Turnstile del formulario
		const formData = new FormData(e.target);
		const token = formData.get("cf-turnstile-response");

		// 3. Envía el comentario al servidor
		setMsg(null);
		try {
			const ok = await onSubmit({ author, content, token });
			if (ok) {
				// 4. Resetea el formulario y muestra éxito
				setAuthor("");
				setContent("");
				setMsg(t("comments.success"));
				setMsgType("success");
				if (window.turnstile) {
					window.turnstile.reset("#turnstile-widget");
				}
			} else {
				// 5. Muestra mensaje de error del servidor
				setMsg(t("comments.error"));
				setMsgType("error");
			}
		} catch {
			// 6. Captura errores de red y muestra mensaje genérico
			setMsg(t("comments.error"));
			setMsgType("error");
		}
	};

	return (
		<div className="bg-gradient-to-br from-bg-card to-bg-subtle p-8 rounded-2xl border border-border-subtle shadow-lg">
			<h4 className="text-xl font-bold mb-6 text-text-primary flex items-center gap-2">
				<span className="icon-[solar--chat-line-outline] text-accent w-5 h-5" />
				{t("comments.leave")}
			</h4>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label
						htmlFor="author"
						className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1"
					>
						{t("comments.name")}
					</label>
					<input
						type="text"
						id="author"
						name="author"
						required
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						className="w-full pl-4 pr-4 py-3 rounded-lg bg-bg-canvas border border-border-input text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm"
						placeholder={t("comments.namePlaceholder")}
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="content"
						className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1"
					>
						{t("comments.comment")}
					</label>
					<textarea
						id="content"
						name="content"
						required
						rows="4"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full pl-4 pr-4 py-3 rounded-lg bg-bg-canvas border border-border-input text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm resize-y min-h-[120px]"
						placeholder={t("comments.commentPlaceholder")}
					/>
				</div>

				<div id="turnstile-widget" className="cf-turnstile" data-sitekey={siteKey} />

				<div className="flex items-center justify-between pt-2">
					{msg && (
						<p
							className={`text-sm ${msgType === "success" ? "text-green-500" : "text-red-500"}`}
							role="status"
							aria-live="polite"
						>
							{msg}
						</p>
					)}
					<button
						type="submit"
						disabled={submitting}
						className="px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:shadow-xl hover:bg-accent/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{submitting ? t("comments.submitting") : t("comments.submit")}
					</button>
				</div>
			</form>
		</div>
	);
}

export default CommentForm;
