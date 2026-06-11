// Astro
import type { APIRoute } from "astro";

export const prerender = true;

// Endpoint GET que genera el archivo robots.txt del sitio
export const GET: APIRoute = ({ site }) => {
	// 1. Obtener URL base del sitio eliminando slash final
	const baseUrl = site?.href.replace(/\/$/, "") ?? "";
	// 2. Construir ruta completa al sitemap-index
	const sitemap = `${baseUrl}/sitemap-index.xml`;
	// 3. Generar contenido del robots.txt con directivas estándar
	const content = ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemap}`].join(
		"\n",
	);

	return new Response(content, {
		headers: { "Content-Type": "text/plain" },
	});
};
