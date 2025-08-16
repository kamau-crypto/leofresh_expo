//

import { UserDetails } from "@/constants";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

//Store the user Details in a central location and they can be reused through out the app
type UserStore = {
	user: UserDetails | undefined;
	updateUser: (p: UserDetails) => void;
};

// Custom storage object for SecureStore
const secureStorage = {
	getItem: async (name: string): Promise<string | null> => {
		return await SecureStore.getItemAsync(name);
	},
	setItem: async (name: string, value: string): Promise<void> => {
		await SecureStore.setItemAsync(name, value);
	},
	removeItem: async (name: string): Promise<void> => {
		await SecureStore.deleteItemAsync(name);
	},
};
export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			user: undefined,
			updateUser: user =>
				set(() => ({
					user: user,
				})),
		}),
		{
			name: "hillfresh_user",
			storage: createJSONStorage(() => secureStorage),
		}
	)
);
