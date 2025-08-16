import { PurchaseItems, SalesItems } from "@/constants";
import { create } from "zustand";

interface ProductsToSell {
	items: SalesItems[] | undefined;
	setItems: (allItems: SalesItems[]) => void;
}

interface ProductsToPurchase {
	items: PurchaseItems[] | undefined;
	setItems: (allItems: PurchaseItems[]) => void;
}

export const useProductsToSellStore = create<ProductsToSell>(set => ({
	items: undefined,
	setItems: allItems => set(() => ({ items: allItems })),
}));

export const useProductsToPurchaseStore = create<ProductsToPurchase>(set => ({
	items: undefined,
	setItems: allItems => set(() => ({ items: allItems })),
}));
