import { useEffect, useState } from "react";
import { useStore } from "../store/store";
import { useTranslations } from "../i18n/ui";

function Comments({ slug, lang = "es" }) {
	const comments = useStore((s) => s.comments);
	const commentsLoading = useStore((s) => s.commentsLoading);
	const commentsError = useStore((s) => s.commentsError);
	const submitting = useStore((s) => s.submitting);
	const fetchComments = useStore((s) => s.fetchComments);
	const submitComment = useStore((s) => s.submitComment);
	const [author, setAuthor] = useState("");
	const [content, setContent] = useState("");
	const [msg, setMsg] = useState(null);
	const [msgType, setMsgType] = useState("neutral");
	const t = useTranslations(lang);
	const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

	useEffect(() => {
		fetchComments(slug);
	}, [slug, fetchComments]);

	useEffect(() => {
		if (window.turnstile) {
			window.turnstile.render?.("#turnstile-widget", { sitekey: siteKey });
		}
	}, [siteKey]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const token = formData.get("cf-turnstile-response");

		setMsg(null);
		const ok = await submitComment({ slug, author, content, token });
		if (ok) {
			setAuthor("");
			setContent("");
			setMsg(t("comments.success"));
			setMsgType("success");
			fetchComments(slug);
			if (window.turnstile) {
				window.turnstile.reset("#turnstile-widget");
			}
		} else {
			setMsg(t("comments.error"));
			setMsgType("error");
		}
	};

	const initials = (name) =>
		name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.substring(0, 2)
			.toUpperCase();

	return (
		<div className="mt-16 pt-8 border-t border-border-subtle" id="comments-section">
			<h3 className="text-2xl font-bold mb-6 text-text-primary">
				{t("comments.title")}
			</h3>

			<div className="space-y-6 mb-10">
				{commentsLoading ? (
					<p className="text-text-muted italic">{t("comments.loading")}</p>
				) : commentsError ? (
					<p className="text-red-500">{t("comments.loadError")}</p>
				) : comments.length === 0 ? (
					<p className="text-text-muted">{t("comments.empty")}</p>
				) : (
					comments.map((comment, idx) => {
						const date = new Date(comment.created_at * 1000).toLocaleDateString(
							lang === "en" ? "en-US" : "es-ES",
							{ year: "numeric", month: "long", day: "numeric" },
						);
						return (
							<div
								key={comment.id || idx}
								className="bg-bg-card p-5 rounded-lg border border-border-subtle shadow-sm flex gap-4 transition-transform hover:-translate-y-0.5 duration-300"
								style={{ animationDelay: `${idx * 100}ms` }}
							>
								<div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm select-none">
									{initials(comment.author)}
								</div>
								<div className="flex-1">
									<div className="flex items-center justify-between mb-2">
										<span className="font-bold text-text-primary text-base">
											{comment.author}
										</span>
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
					})
				)}
			</div>

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
							className="w-full pl-4 pr-4 py-3 rounded-lg bg-bg-canvas border border-border-input text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm group-hover:border-accent/50"
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
							className="w-full pl-4 pr-4 py-3 rounded-lg bg-bg-canvas border border-border-input text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm resize-y min-h-[120px] group-hover:border-accent/50"
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
							className="px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:shadow-xl hover:bg-accent/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{submitting ? t("comments.submitting") : t("comments.submit")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Comments;
