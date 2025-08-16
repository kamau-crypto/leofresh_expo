export interface PurchaseItem {
	item_name: string;
	item_code: string;
	item_group: string;
	price_list_rate: number | null;
	standard_buying_uom: string | null;
	standard_selling_uom: string | null;
	qty: number;
	image: null | string;
	item_tax_template: string | null;
	price_list: string | null;
	tax_rate: string | null;
}
