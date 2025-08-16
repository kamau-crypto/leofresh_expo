import { Warehouse } from "@/services";
import { useProfileStore } from "@/store/profile";
import { useProjectStore } from "@/store/project";
import { useResultStore } from "@/store/result";
import {
	useWarehouseItemStore,
	useWarehousesStore,
	useWarehouseStore,
} from "@/store/warehouse";
import { useCallback, useEffect, useState } from "react";

export function useGetWarehouse() {
	const { updateWarehouse } = useWarehouseStore();
	const { project } = useProjectStore();
	const { limit } = useResultStore();
	const wh = new Warehouse({ docType: "Warehouse" });

	useEffect(() => {
		const retrieveWarehouse = async () => {
			const warehouseResult = await wh.retrive_customer_warehouse({
				page_length: limit,
				customer: project!.customer,
			});
			updateWarehouse({ ...warehouseResult });
		};
		retrieveWarehouse();
	}, [project]);
}

export function useGetWarehouses() {
	const { updateWarehouses } = useWarehousesStore();
	const { profile } = useProfileStore();
	const { limit } = useResultStore();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	// const { limit } = useResultStore();
	const wh = new Warehouse({
		docType: "Warehouse",
	});

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsLoading(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		const retrieveWarehouses = async () => {
			const allWarehouses = await wh.retrieveWarehouses({
				page_length: limit,
			});
			setIsLoading(false);
			updateWarehouses(allWarehouses);
		};
		retrieveWarehouses();
	}, [profile, fetchTrigger]);

	return { refetch };
}

export function useGetStockLevels() {
	const { updateItems } = useWarehouseItemStore();
	const { profile } = useProfileStore();
	const { limit } = useResultStore();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	// const { limit } = useResultStore();
	const wh = new Warehouse({
		docType: "Bin",
	});

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsLoading(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		if (profile) {
			const retrieveWarehouses = async () => {
				const allItems = await wh.retrieveStockQuantities({
					warehouse: profile.warehouse_name,
				});
				updateItems(allItems);
				setIsLoading(false);
			};
			retrieveWarehouses();
		}
	}, [profile, fetchTrigger]);

	return { refetch, isLoading };
}
