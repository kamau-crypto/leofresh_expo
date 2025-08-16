export interface CreateJournalEntry {
	naming_series: string;
	voucher_type: string;
	posting_date: string;
	company: string;
	accounts: JournalAccounts[];
	user_remark: string;
	multi_currency: number;
	receipt_no?: string;
}

export interface JournalAccounts {
	account: string;
	cost_center?: string;
	project?: string;
	debit_in_account_currency?: number;
	credit_in_account_currency?: number;
}

export interface CreatedJournalEntryRecord {
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
	company: string;
	posting_date: Date;
	apply_tds: number;
	user_remark: string;
	total_debit: number;
	total_credit: number;
	difference: number;
	multi_currency: number;
	total_amount: number;
	total_amount_in_words: string;
	remark: string;
	write_off_based_on: string;
	write_off_amount: number;
	is_opening: string;
	doctype: string;
	accounts: CreateJournalEntryAccount[];
}

export interface CreateJournalEntryAccount {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	account: string;
	account_type: string;
	cost_center: string;
	project: string;
	account_currency: string;
	exchange_rate: number;
	debit_in_account_currency: number;
	debit: number;
	credit_in_account_currency: number;
	credit: number;
	is_advance: string;
	against_account: string;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
	__unsaved: number;
}
