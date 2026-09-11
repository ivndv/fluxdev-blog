// Store
import { create } from "zustand";
// Middleware
import { persist } from "zustand/middleware";
import { createCommentsSlice } from "./slices/commentsSlice";
// Slices
import { createPreferencesSlice } from "./slices/preferencesSlice";

// Crea el store global combinando slices de preferencias y comentarios
export const useStore = create(
	persist(
		(...a) => ({
			...createPreferencesSlice(...a),
			...createCommentsSlice(...a),
		}),
		{
			// Nombre clave en localStorage
			name: "fluxdev-store",
			// Persiste solo theme y lang, omite comentarios
			partialize: (state) => ({
				theme: state.theme,
				lang: state.lang,
			}),
		},
	),
);
