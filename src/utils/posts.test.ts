// Pruebas unitarias para getTranslatedPath: resolución de rutas traducidas

import { describe, expect, it } from "vitest";
import { getTranslatedPath } from "./posts";

// Suite de pruebas para getTranslatedPath: valida resolución de rutas entre idiomas
describe("getTranslatedPath", () => {
	// Mock de posts: simula resultado de import.meta.glob con frontmatter.ref_id
	const mockPosts = {
		"../pages/blog/post-es.md": {
			frontmatter: { ref_id: "post-1" },
		},
		"../pages/en/blog/post-en.md": {
			frontmatter: { ref_id: "post-1" },
		},
		"../pages/index.astro": {},
		"../pages/en/index.astro": {},
	};

	// Valida ruta ES → EN con ref_id compartido
	it("should translate Spanish path to English path", () => {
		// 1. Ejecutar función con ruta ES y destino EN
		const result = getTranslatedPath("/blog/post-es", "en", mockPosts);
		// 2. Verificar que retorna la ruta EN
		expect(result).toBe("/en/blog/post-en");
	});

	// Valida ruta EN → ES con ref_id compartido
	it("should translate English path to Spanish path", () => {
		// 1. Ejecutar función con ruta EN y destino ES
		const result = getTranslatedPath("/en/blog/post-en", "es", mockPosts);
		// 2. Verificar que retorna la ruta ES
		expect(result).toBe("/blog/post-es");
	});

	// Retorna null si el post no tiene ref_id
	it("should return null if no ref_id is found", () => {
		// 1. Mock sin ref_id
		const emptyPosts = {
			"../pages/blog/no-ref.md": { frontmatter: {} },
		};
		// 2. Ejecutar y verificar null
		const result = getTranslatedPath("/blog/no-ref", "en", emptyPosts);
		expect(result).toBeNull();
	});

	// Maneja páginas índice correctamente
	it("should handle index pages correctly", () => {
		// 1. Mock de páginas índice con ref_id compartido
		const indexPosts = {
			"../pages/index.md": { frontmatter: { ref_id: "home" } },
			"../pages/en/index.md": { frontmatter: { ref_id: "home" } },
		};

		// 2. Probar traducción ES → EN
		const esToEn = getTranslatedPath("/", "en", indexPosts);
		expect(esToEn).toBe("/en");

		// 3. Probar traducción EN → ES
		const enToEs = getTranslatedPath("/en", "es", indexPosts);
		expect(enToEs).toBe("/");
	});
});
