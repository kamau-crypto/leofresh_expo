export interface CreateStockMovementEntry {
	naming_series?: string;
	stock_entry_type: string;
	material_request?: string;
	delivery_note?: string;
	driver_name?: string;
	reg_no?: string;
	items: CreateStockMovementEntryItem[];
}

export interface CreateStockMovementEntryItem {
	item_name: string;
	item_code: string;
	s_warehouse: string;
	t_warehouse: string;
	qty: number;
	uom: string;
	conversion_factor: number;
	basic_rate: number;
}

export interface CreatedStockMovement {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	naming_series: string;
	stock_entry_type: string;
	purpose: string;
	add_to_transit: number;
	company: string;
	posting_date: Date;
	posting_time: string;
	set_posting_time: number;
	inspection_required: number;
	apply_putaway_rule: number;
	from_bom: number;
	use_multi_level_bom: number;
	fg_completed_qty: number;
	process_loss_percentage: number;
	process_loss_qty: number;
	total_outgoing_value: number;
	total_incoming_value: number;
	value_difference: number;
	total_additional_costs: number;
	is_opening: string;
	per_transferred: number;
	total_amount: number;
	is_return: number;
	doctype: string;
	items: StockMovementItem[];
	additional_costs: any[];
}

export interface StockMovementItem {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	has_item_scanned: number;
	s_warehouse: string;
	t_warehouse: string;
	item_code: string;
	item_name: string;
	is_finished_item: number;
	is_scrap_item: number;
	description: string;
	item_group: string;
	qty: number;
	transfer_qty: number;
	retain_sample: number;
	uom: string;
	stock_uom: string;
	conversion_factor: number;
	sample_quantity: number;
	basic_rate: number;
	additional_cost: number;
	valuation_rate: number;
	allow_zero_valuation_rate: number;
	set_basic_rate_manually: number;
	basic_amount: number;
	amount: number;
	use_serial_batch_fields: number;
	expense_account: string;
	cost_center: string;
	actual_qty: number;
	transferred_qty: number;
	allow_alternative_item: number;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
	__unsaved: number;
}
