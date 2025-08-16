export interface ReadCreatedJournalEntry {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	is_system_generated: number;
	title: string;
	voucher_type: string;
	naming_series: string;
	finance_book: null;
	process_deferred_accounting: null;
	reversal_of: null;
	tax_withholding_category: null;
	from_template: null;
	company: string;
	posting_date: Date;
	apply_tds: number;
	cheque_no: null;
	cheque_date: null;
	user_remark: string;
	total_debit: number;
	total_credit: number;
	difference: number;
	multi_currency: number;
	total_amount_currency: null;
	total_amount: number;
	total_amount_in_words: string;
	clearance_date: null;
	remark: string;
	paid_loan: null;
	inter_company_journal_entry_reference: null;
	bill_no: null;
	bill_date: null;
	due_date: null;
	write_off_based_on: string;
	write_off_amount: number;
	pay_to_recd_from: null;
	letter_head: null;
	select_print_heading: null;
	mode_of_payment: null;
	payment_order: null;
	is_opening: string;
	stock_entry: null;
	auto_repeat: null;
	amended_from: null;
	doctype: string;
	accounts: ReadCreatedJournalAccount[];
}

export interface ReadCreatedJournalAccount {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	account: string;
	account_type: string;
	bank_account: null;
	party_type: null;
	party: null;
	cost_center: string;
	project: string;
	account_currency: string;
	exchange_rate: number;
	debit_in_account_currency: number;
	debit: number;
	credit_in_account_currency: number;
	credit: number;
	reference_type: null;
	reference_name: null;
	reference_due_date: null;
	reference_detail_no: null;
	is_advance: string;
	user_remark: null;
	against_account: string;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
}

export interface ReadExpenseAccounts {
	name: string;
}

export interface RetrievedJournalEntry {
	data: RetrievedJournalEntryData[];
}

export interface RetrievedJournalEntryData {
	name: string;
	total_debit: number;
	posting_date: string;
	account: string;
	remark: string;
	cost_center: string;
}
