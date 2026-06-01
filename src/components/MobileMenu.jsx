import { useEffect, useRef } from "react";
import { useStore } from "../store/store";
import { useTranslations } from "../i18n/ui";

function MobileMenu({ lang = "es" }) {
	const menuRef = useRef(null);
	const theme = useStore((s) => s.theme);
	const toggleTheme = useStore((s) => s.toggleTheme);
	const setLang = useStore((s) => s.setLang);
	const t = useTranslations(lang);
	const isEn = lang === "en";

	useEffect(() => {
		const menuButton = document.getElementById("mobile-menu-button");
		const mobileMenu = document.getElementById("mobile-menu");

		const toggle = () => {
			mobileMenu?.classList.toggle("hidden");
		};

		const closeOnOutside = (e) => {
			if (
				!mobileMenu?.classList.contains("hidden") &&
				!menuButton?.contains(e.target) &&
				!mobileMenu?.contains(e.target)
			) {
				mobileMenu?.classList.add("hidden");
			}
		};

		const closeOnNav = () => {
			mobileMenu?.querySelectorAll("a").forEach((link) => {
				link.addEventListener("click", () => {
					mobileMenu?.classList.add("hidden");
				});
			});
		};

		menuButton?.addEventListener("click", toggle);
		document.addEventListener("click", closeOnOutside);
		closeOnNav();

		return () => {
			menuButton?.removeEventListener("click", toggle);
			document.removeEventListener("click", closeOnOutside);
		};
	}, []);

	const getHref = (path) => {
		if (isEn) return `/en${path === "/" ? "" : path}`;
		return path;
	};

	return (
		<div
			id="mobile-menu"
			ref={menuRef}
			className="hidden sm:hidden border-t border-border-subtle bg-bg-canvas"
		>
			<div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
				<a
					href={isEn ? "/en" : "/"}
					className="px-4 py-2 hover:bg-bg-subtle rounded-md transition-colors text-sm font-medium"
				>
					{t("nav.home")}
				</a>
				<a
					href={getHref("/about")}
					className="px-4 py-2 hover:bg-bg-subtle rounded-md transition-colors text-sm font-medium"
				>
					{t("nav.about")}
				</a>

				<div className="border-t border-border-subtle my-2" />

				<div className="px-4 py-2 flex flex-col gap-3">
					<div className="flex flex-col gap-2">
						<span className="text-xs font-bold text-text-muted uppercase tracking-wider">
							Tema / Theme
						</span>
						<button
							type="button"
							onClick={toggleTheme}
							className="px-3 py-2 rounded-lg text-sm font-medium bg-bg-subtle hover:bg-bg-subtle/70 transition-all flex items-center justify-center gap-2"
							aria-label="Cambiar tema"
						>
							<span
								className={`icon-[solar--moon-stars-outline] w-5 h-5 ${theme === "dark" ? "hidden" : ""}`}
							/>
							<span
								className={`icon-[solar--sun-2-outline] w-5 h-5 ${theme === "light" ? "hidden" : ""}`}
							/>
							<span>{theme === "dark" ? "Modo Claro / Light Mode" : "Modo Oscuro / Dark Mode"}</span>
						</button>
					</div>

					<div className="flex flex-col gap-2">
						<span className="text-xs font-bold text-text-muted uppercase tracking-wider">
							Idioma / Language
						</span>
						<div className="flex gap-2">
							<a
								href={!isEn ? "#" : "/"}
								onClick={() => {
									setLang("es");
									localStorage.setItem("lang-preference", "es");
								}}
								className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center transition-all ${
									!isEn
										? "bg-accent text-white dark:text-stone-950"
										: "bg-bg-subtle text-text-secondary hover:bg-bg-subtle/70"
								}`}
								aria-current={!isEn ? "true" : undefined}
							>
								Español
							</a>
							<a
								href={isEn ? "#" : "/en"}
								onClick={() => {
									setLang("en");
									localStorage.setItem("lang-preference", "en");
								}}
								className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center transition-all ${
									isEn
										? "bg-accent text-white dark:text-stone-950"
										: "bg-bg-subtle text-text-secondary hover:bg-bg-subtle/70"
								}`}
								aria-current={isEn ? "true" : undefined}
							>
								English
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MobileMenu;
