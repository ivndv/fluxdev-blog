// @ts-check

// Integraciones
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
// Helpers
import { toString as toString_ } from "mdast-util-to-string";
import getReadingTime from "reading-time";
import { defineConfig } from "astro/config";

// Plugin de remark que calcula el tiempo de lectura del contenido markdown
function remarkReadingTime() {
	return (tree, { data }) => {
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
