import { ReadPOSProfile } from "@/constants";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProfileStore = {
	profile: ReadPOSProfile | undefined;
	updateProfile: (p: ReadPOSProfile) => void;
};

const secureStorage = {
	getItem: async (name: string): Promise<string | null> => {
		return await SecureStore.getItemAsync(name);
	},
	setItem: async (name: string, value: string): Promise<void> => {
		await SecureStore.setItemAsync(name, value);
	},
	removeItem: async (name: string): Promise<void> => {
		await SecureStore.deleteItemAsync(name);
		await SecureStore.deleteItemAsync("hillFreshUser");
	},
};

export const useProfileStore = create<ProfileStore>()(
	persist(
		(set, get) => ({
			profile: undefined,
			updateProfile: prof =>
				set(() => ({
					profile: prof,
				})),
		}),
		{
			name: "profile",
			storage: createJSONStorage(() => secureStorage), // Use Secure storage to store tokens but for complex stores, use React Native Async Storage.
		}
	)
);
