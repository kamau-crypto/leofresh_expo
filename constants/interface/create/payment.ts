export interface CreatePaymentEntry {
	naming_series: string;
	party_name: string;
	payment_type: string;
	posting_date: string;
	company: string;
	mode_of_payment: string;
	party_type: string;
	party: string;
	paid_to: string;
	paid_from: string;
	paid_amount: number;
	received_amount: number;
	reference_no: string;
	reference_date: string;
	references?: CreatePaymentEntryReference[]; //A payment can be created without a reference
	remarks: string;
	currency: string;
	cost_center: string;
	target_exchange_rate: number;
	project: string;
	unallocated_amount?: number;
	deductions?: [{ account: string; cost_center: string; amount: number }];
}

export interface CreatePaymentEntryReference {
	reference_doctype: string;
	reference_name: string;
	total_amount: number;
	outstanding_amount?: number;
	discount_amount?: number;
	allocated_amount?: number;
}

export interface CreatedPaymentEntry {
	doc: CreatedPaymentEntryDoc;
}

export interface CreatedPaymentEntryDoc {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	naming_series: string;
	payment_type: string;
	payment_order_status: string;
	posting_date: Date;
	company: string;
	mode_of_payment: string;
	party_type: string;
	party: string;
	party_name: string;
	book_advance_payments_in_separate_party_account: number;
	reconcile_on_advance_payment_date: number;
	advance_reconciliation_takes_effect_on: string;
	paid_from: string;
	paid_from_account_type: string;
	paid_from_account_currency: string;
	paid_to: string;
	paid_to_account_type: string;
	paid_to_account_currency: string;
	paid_amount: number;
	paid_amount_after_tax: number;
	source_exchange_rate: number;
	base_paid_amount: number;
	base_paid_amount_after_tax: number;
	received_amount: number;
	received_amount_after_tax: number;
	target_exchange_rate: number;
	base_received_amount: number;
	base_received_amount_after_tax: number;
	total_allocated_amount: number;
	base_total_allocated_amount: number;
	unallocated_amount: number;
	difference_amount: number;
	apply_tax_withholding_amount: number;
	base_total_taxes_and_charges: number;
	total_taxes_and_charges: number;
	project: string;
	cost_center: string;
	status: string;
	custom_remarks: number;
	remarks: string;
	base_in_words: string;
	is_opening: string;
	in_words: string;
	title: string;
	doctype: string;
	references: CreatedPaymentEntryReference[];
	taxes: any[];
	deductions: any[];
}

export interface CreatedPaymentEntryReference {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	reference_doctype: string;
	reference_name: string;
	due_date: Date;
	payment_term_outstanding: number;
	total_amount: number;
	outstanding_amount: number;
	allocated_amount: number;
	exchange_rate: number;
	exchange_gain_loss: number;
	account: string;
	payment_request_outstanding: number;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
	__unsaved: number;
}
