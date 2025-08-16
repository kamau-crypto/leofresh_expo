export interface ReadPOSProfile {
	customer: string;
	company: string;
	warehouse_name: string;
	source_warehouse: string;
	cost_center: string;
	currency: string;
	selling_price_list: string;
	user_email: string;
	project: string;
	lnmo: string | null;
	bank_no: string | null;
	bank_account: string;
	expense_account: string;
	income_account: string;
	debtor_account: string;
	unrealized_profit: string;
	waste_water: number;
	write_off_account: string;
}
