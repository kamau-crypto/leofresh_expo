import { GetPurchaseOrder, ReadSingleMaterialRequestData } from "@/constants";
import { create } from "zustand";

type ReceptionStore = {
	receptionItems: GetPurchaseOrder | undefined;
	setReceptionItems: (r: GetPurchaseOrder | undefined) => void;
	clearReceptionCart: () => void;
};

export const useReceptionStore = create<ReceptionStore>(set => ({
	receptionItems: undefined,
	setReceptionItems: PO => {
		set(() => ({
			receptionItems: PO,
		}));
	},
	clearReceptionCart: () =>
		set(() => ({
			receptionItems: undefined,
		})),
}));

type MaterialReceptionStore = {
	receptionItems: ReadSingleMaterialRequestData | undefined;
	setReceptionItems: (items: ReadSingleMaterialRequestData | undefined) => void;
	clearReceptionCart: () => void;
};

export const useMaterialReceptionStore = create<MaterialReceptionStore>(
	set => ({
		receptionItems: undefined,
		setReceptionItems: items => {
			set(() => ({
				receptionItems: items,
			}));
		},
		clearReceptionCart: () => set(() => ({ receptionItems: undefined })),
	})
);
