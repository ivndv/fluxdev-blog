// Construye la ruta para el idioma seleccionado
export function getLangPath(targetLang, currentPath) {
	if (targetLang === "es") {
		return currentPath.startsWith("/en") ? currentPath.replace(/^\/en/, "") || "/" : currentPath;
	}
	if (currentPath.startsWith("/en")) return currentPath;
	return `/en${currentPath === "/" ? "" : currentPath}`;
}

// Prefija una ruta con /en si el idioma es inglés
export function localizeHref(path, isEn) {
	if (isEn) return `/en${path === "/" ? "" : path}`;
	return path;
}
