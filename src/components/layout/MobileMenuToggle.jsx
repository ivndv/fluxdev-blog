// React
import { useState } from "react";
// Componentes
import MobileMenu from "./MobileMenu";

// Wrapper que maneja el estado del menú móvil con botón hamburguesa
function MobileMenuToggle({ lang }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Botón hamburguesa */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="sm:hidden p-2 hover:bg-bg-subtle rounded-md transition-colors"
				aria-label="Alternar menú"
				aria-expanded={isOpen}
			>
				<span className="icon-[solar--hamburger-menu-outline] w-6 h-6" />
			</button>

			{/* Menú móvil */}
			<MobileMenu
				lang={lang}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
}

export default MobileMenuToggle;
