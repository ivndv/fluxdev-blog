// Utilidades para resolución de rutas y gestión de posts del blog

type PostModule = {
	frontmatter: { ref_id?: string; [key: string]: unknown };
	url?: string;
};
type PostMap = Record<string, PostModule>;

// Obtiene todos los archivos .md/.mdx de pages usando import.meta.glob
export function getPosts(): PostMap {
	return import.meta.glob("../pages/**/*.{md,mdx}", { eager: true }) as PostMap;
}

// Resuelve la ruta equivalente de un post en otro idioma mediante ref_id compartido
export function getTranslatedPath(
	currentPath: string,
	targetLang: string,
	postsOverride?: PostMap,
) {
	// Usar mapa de posts proporcionado o importar dinámicamente desde filesystem
	const posts = postsOverride || getPosts();

	// FASE 1: Identificar el post actual y extraer su ref_id
	let refId: string | undefined;

	for (const path in posts) {
		const post = posts[path];

		// 1.1. Normalizar ruta de archivo a formato URL
		let generatedPath = path
			.replace("../pages", "")
			.replace(/\.mdx?$/, "")
			.replace(/\/index$/, "");

		if (generatedPath === "") generatedPath = "/";

		// 1.2. Normalizar rutas para comparación (ignorar trailing slash)
		const normalizedCurrent = currentPath.replace(/\/$/, "") || "/";
		const normalizedGenerated = generatedPath.replace(/\/$/, "") || "/";

		// 1.3. Si hay match, extraer ref_id y salir del bucle
		if (normalizedCurrent === normalizedGenerated) {
			refId = post.frontmatter?.ref_id;
			break;
		}
	}

	// 1.4. Si no hay ref_id, no es posible resolver traducción
	if (!refId) return null;

	// FASE 2: Buscar contraparte con mismo ref_id en idioma destino
	for (const path in posts) {
		const post = posts[path];

		// 2.1. Filtrar posts que compartan el mismo ref_id
		if (post.frontmatter?.ref_id === refId) {
			// 2.2. Normalizar ruta del candidato
			let generatedPath = path
				.replace("../pages", "")
				.replace(/\.mdx?$/, "")
				.replace(/\/index$/, "");

			if (generatedPath === "") generatedPath = "/";

			// 2.3. Determinar si el candidato está en inglés
			const isEn = generatedPath.startsWith("/en");

			// 2.4. Retornar ruta si coincide con idioma destino solicitado
			if (targetLang === "en" && isEn) return generatedPath;
			if (targetLang === "es" && !isEn) return generatedPath;
		}
	}

	// 2.5. Si no se encontró contraparte, retornar null
	return null;
}
