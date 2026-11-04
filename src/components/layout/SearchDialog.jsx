// React
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
// i18n
import { useTranslations } from "../../i18n/ui";

// Bundle generado por Pagefind en el build
const BUNDLE_PATH = "/pagefind/";

// Modal de búsqueda que monta la UI de Pagefind de forma perezosa
function SearchDialog({ lang = "es" }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [unavailable, setUnavailable] = useState(false);
	const triggerRef = useRef(null);
	const panelRef = useRef(null);

	// Traducciones de Pagefind derivadas del diccionario del sitio
	const translations = useMemo(() => {
		const t = useTranslations(lang);
		return {
			placeholder: t("search.placeholder"),
			clear_search: t("search.clear"),
			load_more: t("search.loadMore"),
			zero_results: t("search.zero"),
			one_result: t("search.one"),
			many_results: t("search.many"),
			searching: t("search.searching"),
			search_label: t("search.label"),
		};
	}, [lang]);

	const t = useTranslations(lang);

	// Atajos de teclado: Ctrl/Cmd+K abre, Esc cierra
	useEffect(() => {
		const onKeyDown = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((value) => !value);
			}

			if (event.key === "Escape") setOpen(false);
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	// Bloqueo de scroll, foco inicial y focus trap mientras el modal está abierto
	useEffect(() => {
		if (!open) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const panel = panelRef.current;
		panel?.querySelector("button")?.focus();

		const onTab = (event) => {
			if (event.key !== "Tab" || !panel) return;

			const focusables = Array.from(
				panel.querySelectorAll(
					'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
				),
			).filter((element) => element.offsetParent !== null);

			if (focusables.length === 0) return;

			const first = focusables[0];
			const last = focusables[focusables.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", onTab);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onTab);
			triggerRef.current?.focus();
		};
	}, [open]);

	// Carga Pagefind al abrir por primera vez y monta la UI en el contenedor
	useEffect(() => {
		if (!open) return;

		let cancelled = false;
		setUnavailable(false);
		setLoading(true);

		const ensureStyles = () => {
			const href = `${BUNDLE_PATH}pagefind-ui.css`;
			if (document.querySelector("link[data-pagefind-css]")) return;

			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = href;
			link.dataset.pagefindCss = "true";
			document.head.appendChild(link);
		};

		const loadScript = () =>
			new Promise((resolve, reject) => {
				if (window.PagefindUI) {
					resolve();
					return;
				}

				const src = `${BUNDLE_PATH}pagefind-ui.js`;
				const existing = document.querySelector(
					`script[data-pagefind-src="${src}"]`,
				);

				if (existing) {
					existing.addEventListener("load", () => resolve(), { once: true });
					existing.addEventListener(
						"error",
						() => reject(new Error("Pagefind")),
						{
							once: true,
						},
					);
					return;
				}

				const script = document.createElement("script");
				script.src = src;
				script.dataset.pagefindSrc = src;
				script.addEventListener("load", () => resolve(), { once: true });
				script.addEventListener("error", () => reject(new Error("Pagefind")), {
					once: true,
				});
				document.head.appendChild(script);
			});

		(async () => {
			try {
				ensureStyles();
				await loadScript();
				if (cancelled) return;

				if (!window.PagefindUI) throw new Error("Pagefind no disponible");

				const container = document.getElementById("search-modal");
				if (!container) return;

				container.innerHTML = "";
				new window.PagefindUI({
					element: "#search-modal",
					bundlePath: BUNDLE_PATH,
					showSubResults: true,
					showImages: false,
					translations,
				});

				requestAnimationFrame(() => {
					container.querySelector("input.pagefind-ui__search-input")?.focus();
				});
			} catch {
				if (!cancelled) setUnavailable(true);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [open, translations]);

	const close = () => setOpen(false);

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen(true)}
				aria-label={t("search.title")}
				aria-haspopup="dialog"
				aria-expanded={open}
				title={t("search.title")}
				className="text-text-secondary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded-lg text-sm p-2 inline-flex items-center transition-colors"
			>
				<span className="icon-[solar--magnifier-outline] w-5 h-5" />
			</button>

			{open &&
				createPortal(
					<div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-[2px] sm:items-center sm:pt-4">
						<button
							type="button"
							tabIndex={-1}
							aria-label={t("search.close")}
							onClick={close}
							className="absolute inset-0 h-full w-full cursor-default"
						/>

						<div
							ref={panelRef}
							role="dialog"
							aria-modal="true"
							aria-labelledby="search-dialog-title"
							className="relative z-10 flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-2xl"
						>
							<div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
								<h2
									id="search-dialog-title"
									className="text-sm font-bold text-text-primary"
								>
									{t("search.title")}
								</h2>

								<button
									type="button"
									onClick={close}
									aria-label={t("search.close")}
									className="text-text-secondary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-2 inline-flex items-center transition-colors"
								>
									<span className="icon-[solar--close-circle-outline] w-5 h-5" />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto px-5 py-4">
								<div id="search-modal" />

								{loading && (
									<p className="mt-4 text-sm text-text-muted">
										{t("search.loading")}
									</p>
								)}

								{unavailable && (
									<p className="mt-4 rounded-xl border border-border-subtle bg-bg-subtle p-4 text-sm text-text-muted">
										{t("search.unavailable")}
									</p>
								)}
							</div>

							<div className="flex items-center justify-between gap-4 border-t border-border-subtle px-5 py-3">
								<span className="text-xs text-text-muted">
									<kbd className="hidden rounded border border-border-subtle px-1.5 py-0.5 text-[10px] sm:inline-block">
										Esc
									</kbd>{" "}
									{t("search.close")}
								</span>

								<kbd className="hidden rounded border border-border-subtle px-1.5 py-0.5 text-[10px] text-text-muted sm:inline-block">
									Ctrl K
								</kbd>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}

export default SearchDialog;
