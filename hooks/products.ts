import { ItemGroup, SalesItems } from "@/constants";
import {
	useProductsToPurchaseStore,
	useProductsToSellStore,
} from "@/store/products";
import { ItemPrice } from "@/use-cases/item.price";
import { useCallback, useEffect, useState } from "react";
// export function
export function useGetSalesProducts() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { setItems } = useProductsToSellStore();
	const products = new ItemPrice({ docType: "Item" });

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsLoading(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		const retrieveSellableItems = async () => {
			const response: SalesItems[] = await products.retrieveSellingItemPrices();
			const itemsToPurchase = response.filter(
				iT => iT.item_group === ItemGroup.Products
			);
			if (response) {
				setItems(itemsToPurchase);
				setIsLoading(false);
			}
		};
		retrieveSellableItems();
	}, [fetchTrigger]);
	return { refetch };
}
export function useGetPurchaseProducts() {
	const [isFetching, setIsFetching] = useState<boolean>(true);
	const { setItems } = useProductsToPurchaseStore();
	const products = new ItemPrice({ docType: "Item" });

	const [fetchTrigger, setFetchTrigger] = useState(0);

	const refetch = useCallback(() => {
		setIsFetching(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		setIsFetching(prev => !prev);
		const retrieveItemsToPurchase = async () => {
			const response = await products.retrieveBuyingItemPrices();
			const sellableItems = response.filter(
				iT => iT.item_group === ItemGroup.Products
			);
			if (response) {
				setItems(sellableItems);
				setIsFetching(false);
			}
		};
		retrieveItemsToPurchase();
	}, [fetchTrigger]);

	return { refetch };
}
