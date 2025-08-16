export interface ReadBankAccounts {
	data: ReadBankAccount[];
}

export interface ReadBankAccount {
	account: string;
	account_name: string;
	bank: string;
	account_type: null;
	account_subtype: null;
}
