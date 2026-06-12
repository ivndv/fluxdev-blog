// React
import { useEffect } from "react";
// Store
import { useStore } from "../../store/store";

// Botón que alterna entre tema claro y oscuro
function ThemeToggle() {
	const theme = useStore((s) => s.theme);
	const toggleTheme = useStore((s) => s.toggleTheme);

	// Sincroniza el tema con el DOM al cambiar
	useEffect(() => {
		// 1. Agrega o quita la clase dark según el estado
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="text-text-secondary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent rounded-lg text-sm p-2 inline-flex items-center transition-colors"
			aria-label="Toggle Dark Mode"
		>
			<span
				className={`icon-[solar--moon-stars-outline] w-5 h-5 ${theme === "dark" ? "hidden" : ""}`}
			/>
			<span
				className={`icon-[solar--sun-2-outline] w-5 h-5 ${theme === "light" ? "hidden" : ""}`}
			/>
		</button>
	);
}

export default ThemeToggle;
