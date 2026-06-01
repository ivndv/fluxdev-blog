// @ts-check

import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { toString as toString_ } from "mdast-util-to-string";
import getReadingTime from "reading-time";
import { defineConfig } from "astro/config";

function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = toString_(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.minutes;
	};
}

export default defineConfig({
	site: "https://fluxdev-nebula.mgdc.site/",
	output: "static",
	integrations: [sitemap(), react()],
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
