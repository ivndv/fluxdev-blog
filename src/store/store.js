import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPreferencesSlice } from "./slices/preferencesSlice";
import { createCommentsSlice } from "./slices/commentsSlice";

export const useStore = create(
	persist(
		(...a) => ({
			...createPreferencesSlice(...a),
			...createCommentsSlice(...a),
		}),
		{
			name: "fluxdev-store",
			partialize: (state) => ({
				theme: state.theme,
				lang: state.lang,
			}),
		},
	),
);
