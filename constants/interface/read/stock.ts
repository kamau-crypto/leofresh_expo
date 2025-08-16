export interface ReadWarehouseStockLevels {
	data: ReadWarehouseStockLevel[];
}

export interface ReadWarehouseStockLevel {
	item_code: string;
	warehouse: string;
	actual_qty: number;
	stock_uom: string;
}
