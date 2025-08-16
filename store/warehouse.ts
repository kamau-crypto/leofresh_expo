import {
	IWarehouse,
	ReadWarehousesList,
	ReadWarehouseStockLevel,
} from "@/constants";
import { create } from "zustand";

type WarehouseStore = {
	warehouse: IWarehouse | undefined;
	updateWarehouse: (p: IWarehouse) => void;
};

type WarehousesStore = {
	warehouses: ReadWarehousesList[] | undefined;
	updateWarehouses: (p: ReadWarehousesList[]) => void;
};

type WarehouseItemStore = {
	items: ReadWarehouseStockLevel[] | undefined;
	updateItems: (p: ReadWarehouseStockLevel[]) => void;
};

export const useWarehouseStore = create<WarehouseStore>(set => ({
	warehouse: undefined,
	updateWarehouse: wh =>
		set(() => ({
			warehouse: wh,
		})),
}));
export const useWarehousesStore = create<WarehousesStore>(set => ({
	warehouses: undefined,
	updateWarehouses: whs =>
		set(() => ({
			warehouses: whs,
		})),
}));

export const useWarehouseItemStore = create<WarehouseItemStore>(set => ({
	items: undefined,
	updateItems: items =>
		set(() => ({
			items: items,
		})),
}));
