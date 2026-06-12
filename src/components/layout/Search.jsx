import { useEffect, useId } from "react";

// Componente de búsqueda integrado con Pagefind para indexación estática
function Search() {
	const id = useId();

	useEffect(() => {
		// 1. Espera a que PagefindUI esté disponible en el window
		const init = () => {
			if (!window.PagefindUI) {
				setTimeout(init, 100);
				return;
			}
			// 2. Inicializa la UI de búsqueda en el contenedor
			new window.PagefindUI({
				element: `#search-${id}`,
				showSubResults: true,
			});
		};
		init();
	}, [id]);

	return (
		<div id={`search-${id}`} className="ml-auto relative" />
	);
}

export default Search;
