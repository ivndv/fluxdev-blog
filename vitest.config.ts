/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

// Configuracion de Vitest para pruebas unitarias del proyecto
export default defineConfig({
	plugins: [
		// Plugin que mockea archivos .md/.mdx en tests para evitar errores de importacion
		{
			name: "mock-markdown",
			transform(_code, id) {
				// Interceptar imports de archivos Markdown y retornar mock seguro
				if (id.endsWith(".md") || id.endsWith(".mdx")) {
					return {
						code: "export default {}",
						map: null,
					};
				}
			},
		},
	],
	test: {
		// Entorno jsdom para pruebas que interactuan con DOM
		environment: "jsdom",

		// Variables globales (describe, it, expect) sin necesidad de importarlas
		globals: true,

		// Archivo de inicializacion antes de cada suite de pruebas
		setupFiles: ["./src/test/setup.ts"],
	},
});
