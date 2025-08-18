import { ReadPOSProfile } from "@/constants";
import { MMKVStorage } from "@/utils/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProfileStore = {
	profile: ReadPOSProfile | undefined;
	updateProfile: (p: ReadPOSProfile) => void;
};

export const useProfileStore = create<ProfileStore>()(
	persist(
		(set, _get) => ({
			profile: undefined,
			updateProfile: prof =>
				set(() => ({
					profile: prof,
				})),
		}),
		{
			name: "profile",
			storage: {
				getItem: (
					name: string
				): import("zustand/middleware").StorageValue<ProfileStore> | null => {
					const value = MMKVStorage.getItem(name);
					if (!value) return null;
					if (typeof value === "string") {
						return JSON.parse(
							value
						) as import("zustand/middleware").StorageValue<ProfileStore>;
					}
					console.log(
						"MMKVStorage.getItem returned a Promise, which is unexpected for sync storage."
					);
					return null;
				},
				setItem: (
					name: string,
					value: import("zustand/middleware").StorageValue<ProfileStore>
				): void => {
					MMKVStorage.setItem(name, JSON.stringify(value));
				},
				removeItem: (name: string): void => {
					MMKVStorage.removeItem(name);
				},
			},
		}
	)
);
