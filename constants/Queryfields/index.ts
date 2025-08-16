export const profileKeys: string[] = [
	"customer",
	"company",
	"source_warehouse",
	"warehouse.name as warehouse_name",
	"cost_center",
	"currency",
	"selling_price_list",
	"applicable_for_users.user as user_email",
	"project",
	"lnmo",
	"write_off_account",
	"bank_account",
	"expense_account",
	"income_account",
	"debtor_account",
	"unrealized_profit",
	"waste_water",
];

export const tankReadings: string[] = [
	"opening_reading",
	"meter_reading",
	"reading_type",
	"tank.tank_num",
	"height",
	"volume",
	"date",
	"tank",
	"tank.height as tank_height",
];

export const tankMeterReadings: string[] = [
	"name",
	"quantity",
	"variation",
	"current_reading",
	"created_by",
	"date",
	"tank",
];

export const customerTanks: string[] = ["tank"];

export const customerTankDetals: string[] = [
	"name",
	"height",
	"diameter",
	"high",
	"low",
	"low_low",
	"dead",
	"calibration",
	"correction_factor",
	"tank_num",
];

export const bankAccountFields: string[] = [
	"account",
	"account_name",
	"bank",
	"account_type",
	"account_subtype",
	"company",
];

export const purchaseOrderFields = [
	"name",
	"company",
	"supplier",
	"transaction_date",
	"schedule_date",
	"status",
	"project",
	"buying_price_list",
	"per_received",
	"total",
	"grand_total",
	"advance_paid",
	"cost_center",
	"currency",
	"items",
	"creation",
];

export const materialRequestFields: string[] = [
	"name",
	"set_from_warehouse as from_warehouse",
	"material_request_type",
	"set_warehouse",
	"status",
	"per_ordered",
	"transaction_date",
	"items",
	"creation",
];
