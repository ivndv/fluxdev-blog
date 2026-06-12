// React
import { useState, useRef, useEffect } from "react";
// Store
import { useStore } from "../../store/store";
// Traducciones
import { languages } from "../../i18n/ui";
// Utilidades
import { getLangPath } from "../../utils/path";

// Selector de idioma con menú desplegable
function LanguagePicker({ currentPath: propPath }) {
	const lang = useStore((s) => s.lang);
	const setLang = useStore((s) => s.setLang);
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);
	const btnRef = useRef(null);
	const [clientPath, setClientPath] = useState(propPath || "");

	// Obtiene la ruta actual del cliente (solo en el navegador)
	useEffect(() => {
		setClientPath(window.location.pathname);
	}, []);

	// Cierra el menú al hacer clic fuera o presionar Escape
	useEffect(() => {
		// 1. Cierra al hacer clic fuera del menú
		const handleClick = (e) => {
			if (
				isOpen &&
				!btnRef.current?.contains(e.target) &&
				!menuRef.current?.contains(e.target)
			) {
				setIsOpen(false);
			}
		};
		// 2. Cierra al presionar Escape y devuelve el foco al botón
		const handleKey = (e) => {
			if (e.key === "Escape" && isOpen) {
				e.preventDefault();
				setIsOpen(false);
				btnRef.current?.focus();
			}
		};
		document.addEventListener("click", handleClick);
		document.addEventListener("keydown", handleKey);
		// 3. Limpia los eventos al desmontar o cerrar
		return () => {
			document.removeEventListener("click", handleClick);
			document.removeEventListener("keydown", handleKey);
		};
	}, [isOpen]);

	return (
		<div className="relative inline-block" ref={menuRef}>
			{/* Botón del selector */}
			<button
				type="button"
				ref={btnRef}
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-1 px-2 py-2 hover:text-accent transition-colors text-text-muted group"
				aria-label="Cambiar idioma"
				aria-expanded={isOpen}
				aria-controls="lang-menu-dropdown"
			>
				<span className="icon-[solar--global-outline] w-[18px] h-[18px] group-hover:text-accent transition-colors" />
				<span className="text-sm font-medium">
					{lang === "es" ? "ES" : "EN"}
				</span>
				<span className="icon-[solar--alt-arrow-down-outline] w-[12px] h-[12px] opacity-50 group-hover:opacity-100 transition-opacity" />
			</button>

			{/* Menú desplegable */}
			<div
				id="lang-menu-dropdown"
				role="menu"
				className={`absolute right-0 top-full mt-2 w-32 bg-bg-card/95 backdrop-blur-sm border border-border-subtle rounded-xl shadow-lg p-1 z-50 transform origin-top-right transition-all duration-200 ${
					isOpen
						? "opacity-100 visible translate-y-0"
						: "opacity-0 invisible translate-y-2"
				}`}
			>
				{Object.entries(languages).map(([labelLang, label]) => {
					const isActive =
						lang === labelLang ||
						(labelLang === "es" && !lang && lang !== "en");
					return (
						<a
							key={labelLang}
							href={getLangPath(labelLang, clientPath || propPath || "/")}
							role="menuitem"
							onClick={() => {
								setLang(labelLang);
								localStorage.setItem("lang-preference", labelLang);
							}}
							className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
								isActive
									? "bg-accent/10 text-accent"
									: "text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
							}`}
							aria-current={isActive ? "true" : undefined}
						>
							<span
								className={`w-1.5 h-1.5 rounded-full bg-accent transition-opacity ${
									isActive ? "opacity-100" : "opacity-0"
								}`}
							/>
							{label === "Español" ? "Español" : "English"}
						</a>
					);
				})}
			</div>
		</div>
	);
}

export default LanguagePicker;
