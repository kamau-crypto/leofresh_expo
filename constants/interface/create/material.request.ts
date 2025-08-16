export interface CreateMaterialRequest {
	material_request_type: string;
	company: string;
	schedule_date: Date;
	set_from_warehouse: string;
	set_warehouse: string;
	items: MaterialRequestItem[];
	purpose: string;
}

export interface MaterialRequestItem {
	item_name: string;
	item_code: string;
	qty: number;
	uom: string;
	from_warehouse: string;
	warehouse: string;
	schedule_date: string;
}

export interface CreatedMaterialRequest {
	data: CreatedMaterialRequestData;
}

export interface CreatedMaterialRequestData {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	naming_series: string;
	title: string;
	material_request_type: string;
	company: string;
	transaction_date: Date;
	schedule_date: Date;
	set_warehouse: string;
	status: string;
	per_ordered: number;
	transfer_status: string;
	per_received: number;
	doctype: string;
	items: CreatedMaterialRequestItem[];
}

export interface CreatedMaterialRequestItem {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	item_code: string;
	item_name: string;
	schedule_date: Date;
	description: string;
	item_group: string;
	image: string;
	qty: number;
	stock_uom: string;
	from_warehouse: string;
	warehouse: string;
	uom: string;
	conversion_factor: number;
	stock_qty: number;
	min_order_qty: number;
	projected_qty: number;
	actual_qty: number;
	ordered_qty: number;
	received_qty: number;
	rate: number;
	price_list_rate: number;
	amount: number;
	expense_account: string;
	cost_center: string;
	page_break: number;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
	__unsaved: number;
}
