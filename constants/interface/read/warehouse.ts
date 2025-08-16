export interface ReadWarehouseList {
	name: string;
	company: string;
	account: null;
}

export interface ReadWarehousesList {
	name: string;
	is_group: number;
	parent_warehouse: null | string;
}
