import {
	CreateMaterialRequest,
	CreatePurchaseOrderItem,
	MaterialRequestItem,
	PurchaseOrderDetails,
} from "@/constants";
import { create } from "zustand";

type CartStore = {
	cartItems: CreateMaterialRequest | undefined;
	setCart: (p: CreateMaterialRequest) => void;
	removeItems: () => void;
	updateItem: (p: MaterialRequestItem) => void;
	removeItem: (p: MaterialRequestItem) => void;
};

type PurchaseOrderCartStore = {
	cartItems: PurchaseOrderDetails | undefined;
	setCart: (p: PurchaseOrderDetails) => void;
	removeItems: () => void;
	updateItem: (p: CreatePurchaseOrderItem) => void;
	removeItem: (p: CreatePurchaseOrderItem) => void;
};

export const useMaterialReqCartStore = create<CartStore>((set, get) => ({
	cartItems: undefined,
	setCart: items =>
		set(() => ({
			cartItems: items,
		})),
	updateItem: item => {
		const { cartItems } = get();
		const { items } = cartItems!;
		//
		const foundIndex = items!.indexOf(item);
		//
		if (foundIndex !== -1) {
			const foundItem = items[foundIndex];
			items[foundIndex] = item;
			set(() => ({ cartItems: { ...cartItems!, items: items } }));
		} else {
			set(() => ({ cartItems: cartItems }));
		}
	},
	removeItem: item => {
		const { cartItems } = get();
		const newCartItems = cartItems!.items.filter(curItem => curItem !== item);

		set(() => ({ cartItems: { ...cartItems!, items: newCartItems } }));
	},
	removeItems: () => set(() => ({ cartItems: undefined })),
}));

export const usePurchaseCartStore = create<PurchaseOrderCartStore>(
	(set, get) => ({
		cartItems: undefined,
		setCart: items =>
			set(() => ({
				cartItems: items,
			})),
		updateItem: item => {
			const { cartItems } = get();
			const { items } = cartItems!;
			//
			const foundIndex = items!.indexOf(item);
			//
			if (foundIndex !== -1) {
				const foundItem = items[foundIndex];
				items[foundIndex] = item;
				set(() => ({ cartItems: { ...cartItems!, items: items } }));
			} else {
				set(() => ({ cartItems: cartItems }));
			}
		},
		removeItem: item => {
			const { cartItems } = get();
			const newCartItems = cartItems!.items.filter(curItem => curItem !== item);

			set(() => ({ cartItems: { ...cartItems!, items: newCartItems } }));
		},
		removeItems: () => set(() => ({ cartItems: undefined })),
	})
);
