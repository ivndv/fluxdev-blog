import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/store";
import { languages } from "../i18n/ui";

function LanguagePicker({ currentPath: propPath }) {
	const lang = useStore((s) => s.lang);
	const setLang = useStore((s) => s.setLang);
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);
	const btnRef = useRef(null);
	const [clientPath, setClientPath] = useState(propPath || "");

	useEffect(() => {
		setClientPath(window.location.pathname);
	}, []);

	useEffect(() => {
		const handleClick = (e) => {
			if (
				isOpen &&
				!btnRef.current?.contains(e.target) &&
				!menuRef.current?.contains(e.target)
			) {
				setIsOpen(false);
			}
		};
		const handleKey = (e) => {
			if (e.key === "Escape" && isOpen) {
				e.preventDefault();
				setIsOpen(false);
				btnRef.current?.focus();
			}
		};
		document.addEventListener("click", handleClick);
		document.addEventListener("keydown", handleKey);
		return () => {
			document.removeEventListener("click", handleClick);
			document.removeEventListener("keydown", handleKey);
		};
	}, [isOpen]);

	const getLangPath = (targetLang) => {
		const currentPath = clientPath || propPath || "/";
		if (targetLang === "es") {
			return currentPath.startsWith("/en") ? currentPath.replace(/^\/en/, "") || "/" : currentPath;
		}
		if (currentPath.startsWith("/en")) return currentPath;
		return `/en${currentPath === "/" ? "" : currentPath}`;
	};

	return (
		<div className="relative inline-block" ref={menuRef}>
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
							href={getLangPath(labelLang)}
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
