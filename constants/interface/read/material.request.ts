export interface ReadSubmittedMaterialRequest {
	message: ReadSubmittedMaterialRequestMessage;
}

export interface ReadSubmittedMaterialRequestMessage {
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
	customer: null;
	company: string;
	transaction_date: Date;
	schedule_date: Date;
	amended_from: null;
	scan_barcode: null;
	set_from_warehouse: null;
	set_warehouse: string;
	tc_name: null;
	terms: null;
	status: string;
	per_ordered: number;
	transfer_status: string;
	per_received: number;
	letter_head: null;
	select_print_heading: null;
	job_card: null;
	work_order: null;
	doctype: string;
	items: SubmittedMaterialRequestItem[];
}

export interface SubmittedMaterialRequestItem {
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
	brand: null;
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
	wip_composite_asset: null;
	manufacturer: null;
	manufacturer_part_no: null;
	bom_no: null;
	project: null;
	cost_center: string;
	lead_time_date: null;
	sales_order: null;
	sales_order_item: null;
	production_plan: null;
	material_request_plan_item: null;
	job_card_item: null;
	page_break: number;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
	__unsaved: number;
}

export interface ReadSingleMaterialRequest {
	data: ReadSingleMaterialRequestData;
}

export interface ReadSingleMaterialRequestData {
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
	set_from_warehouse: string;
	set_warehouse: string;
	status: string;
	per_ordered: number;
	transfer_status: string;
	per_received: number;
	doctype: string;
	items: ReadSingleMaterialRequestItem[];
}

export interface ReadSingleMaterialRequestItem {
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
}

export interface ReadMultipleMaterialRequests {
	data: ReadMultipleMaterialRequestsData[];
}

export interface ReadMultipleMaterialRequestsData {
	name: string;
	from_warehouse: string;
	material_request_type: string;
	set_warehouse: string;
	status: string;
	per_ordered: number;
	transaction_date: string;
	creation: string;
}
