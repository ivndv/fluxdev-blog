// @ts-check

import { unified } from "@astrojs/markdown-remark";
// Integraciones
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
// Helpers
import { toString as toString_ } from "mdast-util-to-string";
import getReadingTime from "reading-time";

// Plugin de remark que calcula el tiempo de lectura del contenido markdown
function remarkReadingTime() {
	return (/** @type {any} */ tree, /** @type {any} */ { data }) => {
		const textOnPage = toString_(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.minutes;
	};
}

// Configuracion general del sitio Astro
export default defineConfig({
	site: "https://fluxdev-nebula.mgdc.site/",
	output: "static",
	integrations: [sitemap(), react()],
	// Internacionalizacion con espanol como idioma por defecto
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	markdown: {
		processor: unified({ remarkPlugins: [remarkReadingTime] }),
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
