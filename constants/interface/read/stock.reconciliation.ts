export interface ReadStockReconiliation {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	naming_series: string;
	company: string;
	purpose: string;
	posting_date: Date;
	posting_time: string;
	set_posting_time: number;
	set_warehouse: string;
	scan_mode: number;
	expense_account: string;
	difference_amount: number;
	cost_center: string;
	doctype: string;
	items: ReadStockReconiliationItem[];
}

export interface ReadStockReconiliationItem {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	item_code: string;
	item_name: string;
	item_group: string;
	warehouse: string;
	qty: number;
	valuation_rate: number;
	amount: number;
	allow_zero_valuation_rate: number;
	use_serial_batch_fields: number;
	reconcile_all_serial_batch: number;
	current_qty: number;
	current_amount: number;
	current_valuation_rate: number;
	quantity_difference: string;
	amount_difference: number;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
}

export interface RetrievedStockReconciliationRecord {
	name: string;
	posting_date: Date;
	posting_time: string;
}
