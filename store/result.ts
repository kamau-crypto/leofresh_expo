//
//Limit the number of results you can get from the server at a time

import { create } from "zustand";

interface ViewResults {
	limit: number;
	increaseLimit: () => void;
	decreaseLimit: () => void;
}

export const useResultStore = create<ViewResults>(set => ({
	limit: 20,
	increaseLimit: () =>
		set(state => ({
			limit: state.limit + 5,
		})),
	decreaseLimit: () =>
		set(state => ({
			limit: state.limit - 5,
		})),
}));
