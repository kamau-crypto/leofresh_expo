import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

const storage = new MMKV({
	id: "leofresh.com.storage",
	encryptionKey: "package.leofresh.expo",
});

export const MMKVStorage: StateStorage = {
	setItem: (name: string, value: string) => {
		return storage.set(name, value);
	},
	getItem: (name: string): string | null => {
		return storage.getString(name) ?? null;
	},
	removeItem: (name: string) => {
		return storage.delete(name);
	},
};
