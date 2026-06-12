// React
import { useEffect, useRef } from "react";
// Store
import { useStore } from "../../store/store";
// Traducciones
import { useTranslations } from "../../i18n/ui";
// Utilidades
import { localizeHref } from "../../utils/path";

// Menú de navegación responsive para móviles
//  - lang: "es" | "en"
//  - isOpen: bool (control externo)
//  - onClose: callback al cerrar
function MobileMenu({ lang = "es", isOpen, onClose }) {
	const menuRef = useRef(null);
	const theme = useStore((s) => s.theme);
	const toggleTheme = useStore((s) => s.toggleTheme);
	const setLang = useStore((s) => s.setLang);
	const t = useTranslations(lang);
	const isEn = lang === "en";

	// Cierra al hacer clic fuera o en un enlace
	useEffect(() => {
		if (!isOpen) return;

		// 1. Cierra el menú al hacer clic fuera del contenedor
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				onClose?.();
			}
		};

		// 2. Cierra el menú al hacer clic en un enlace de navegación
		const handleLinkClick = () => {
			onClose?.();
		};

		document.addEventListener("mousedown", handleClickOutside);
		menuRef.current?.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", handleLinkClick);
		});

		// 3. Limpia los eventos al desmontar o cerrar
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			ref={menuRef}
			className="sm:hidden border-t border-border-subtle bg-bg-canvas"
		>
			<div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
				<a
					href={isEn ? "/en" : "/"}
					className="px-4 py-2 hover:bg-bg-subtle rounded-md transition-colors text-sm font-medium"
				>
					{t("nav.home")}
				</a>
				<a
					href={localizeHref("/about", isEn)}
					className="px-4 py-2 hover:bg-bg-subtle rounded-md transition-colors text-sm font-medium"
				>
					{t("nav.about")}
				</a>

				<div className="border-t border-border-subtle my-2" />

				<div className="px-4 py-2 flex flex-col gap-3">
					{/* Selector de tema */}
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

					{/* Selector de idioma */}
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
