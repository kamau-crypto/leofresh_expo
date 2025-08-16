import { CreatePurchaseOrderItem } from "@/constants";
import { create } from "zustand";

interface SingleItem
	extends Pick<
		CreatePurchaseOrderItem,
		"amount" | "qty" | "rate" | "item_code"
	> {
	delivery_date: string;
}

interface SalesItemsStore {
	getTotal: (items: SingleItem[]) => void;
	items: SingleItem[];
	setItems: (items: SingleItem[]) => void;
	addItem: (item: SingleItem) => void;
	removeItem: (item: SingleItem) => void;
}

export const useSalesStore = create<SalesItemsStore>((set, get) => ({
	items: [],
	removeItem: item => {
		const { items } = get();
		const allItems = items.filter(
			curren_item => curren_item.item_code !== item.item_code
		);
		return set(() => ({ items: allItems }));
	},
	getTotal: () => {
		const { items } = get();
		return items.reduce((sum, curr) => sum + curr.amount, 0);
	},
	addItem: new_item => set(state => ({ items: [...state.items!, new_item] })),
	setItems: items =>
		set(() => ({
			//
			//Pick it up from here..,
			items: items,
		})),
}));
