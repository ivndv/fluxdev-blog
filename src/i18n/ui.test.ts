// Pruebas unitarias para useTranslations

import { describe, expect, it } from "vitest";
import { defaultLang, ui, useTranslations } from "./ui";

describe("useTranslations", () => {
	// Verifica traduccion correcta para el idioma por defecto
	it("debe devolver la traduccion correcta para el idioma por defecto", () => {
		// 1. Inicializar hook con idioma por defecto
		const t = useTranslations(defaultLang);
		// 2. Verificar que la clave se resuelve al valor esperado
		expect(t("nav.home")).toBe(ui[defaultLang]["nav.home"]);
	});

	// Verifica traduccion correcta para ingles
	it("debe devolver la traduccion correcta para ingles", () => {
		// 1. Inicializar hook con idioma 'en'
		const t = useTranslations("en");
		// 2. Verificar que la clave se resuelve al valor esperado
		expect(t("nav.home")).toBe(ui.en["nav.home"]);
	});

	// Verifica fallback al idioma por defecto si falta la clave en el destino
	it("debe recurrir al idioma por defecto si la llave falta en el idioma destino", () => {
		// 1. Inicializar hook con idioma 'en'
		const t = useTranslations("en");
		// 2. Solicitar clave que existe en defaultLang
		// 3. Verificar que retorna el fallback
		expect(t("nav.about")).toBe("About");
	});

	// Verifica retorno undefined para claves que no existen en ningun idioma
	it("debe manejar llaves desconocidas de forma segura", () => {
		// 1. Inicializar hook con idioma por defecto
		const t = useTranslations("es");
		// 2. Solicitar clave inexistente
		// 3. Verificar que retorna undefined sin lanzar error
		// @ts-expect-error: probando comportamiento con clave no tipada
		expect(t("unknown.key")).toBeUndefined();
	});
});
