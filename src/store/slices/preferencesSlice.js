// Slice de preferencias: theme (light/dark) e idioma (es/en)
export const createPreferencesSlice = (set) => ({
	// Estado inicial
	theme: "light",
	lang: "es",

	// Cambia el tema al valor recibido
	setTheme: (theme) => set({ theme }),
	// Alterna entre light y dark
	toggleTheme: () =>
		set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
	// Cambia el idioma al valor recibido
	setLang: (lang) => set({ lang }),
});
