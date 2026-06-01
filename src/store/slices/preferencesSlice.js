export const createPreferencesSlice = (set) => ({
	theme: "light",
	lang: "es",
	setTheme: (theme) => set({ theme }),
	toggleTheme: () =>
		set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
	setLang: (lang) => set({ lang }),
});
