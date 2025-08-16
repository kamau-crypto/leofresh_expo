import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type KeyStore = {
	key: string | undefined;
	deleteKey: () => void;
	updateKey: (k: string) => void;
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
	},
};

export const useKeyStore = create<KeyStore>()(
	persist(
		(set, get) => ({
			key: undefined,
			updateKey: key =>
				set(() => ({
					key: key,
				})),
			deleteKey: () =>
				set(() => ({
					key: undefined,
				})),
		}),
		{
			name: "auth_token",
			storage: createJSONStorage(() => secureStorage),
		}
	)
);
