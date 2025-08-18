import { HillFreshError } from "@/utils/customError";
import { ZodType, z } from "zod";

export interface BulkWaterSalesInvoice {
	transaction_date: Date;
	grand_total: number;
	customer: string;
	cost_center: string;
	project: string;
	weather: string;
}

export interface BulkWaterSales {
	previous_water_reading: number;
	current_water_reading: number;
	water_used: number;
	waste: number;
	rate: number;
	billable_water: number;
	total_bulk: number;
}

export interface CreateSalesInvoice {
	posting_date: string;
	selling_price_list: string;
	party_account_currency: string;
	debit_to: string;
	company: string;
	grand_total: number;
	total_bottled: number;
	naming_series: string;
	currency: string;
	due_date: string;
	weather: string;
	customer: string;
	update_stock: number;
	cost_center: string;
	project: string;
	items: SalesItem[];
	bulk_water: BulkWaterSales;
	mpesa: number;
	cash: number;
}

export interface SalesItem {
	item_code: string;
	item_name: string;
	qty: number;
	rate: number;
	amount: number;
	uom: string;
	warehouse: string;
	income_account: string;
	item_tax_template: string | null;
	tax_rate: number | null;
	tax_type: string | null;
}

export interface BottledWaterWithImage extends SalesItem {
	image: string;
}
export const SalesInvoiceSchema: ZodType<BulkWaterSalesInvoice> = z.object({
	transaction_date: z.date(),
	weather: z.string().describe("Weather is required"),
	customer: z.string(),
	grand_total: z.number({ error: "A Total is required" }),
	cost_center: z.string(),
	project: z.string(),
});

export const createSalesInvoiceSchema: ZodType<CreateSalesInvoice> = z.object({
	posting_date: z.string({ error: "Posting date is required" }),
	company: z.string({ error: "Company is required" }),
	selling_price_list: z.string({
		error: "Selling price list is required",
	}),
	debit_to: z.string({ error: "Debit to is required" }),
	party_account_currency: z.string({
		error: "Party account currency is required",
	}),
	naming_series: z.string({ error: "Naming series is required" }),
	currency: z.string({ error: "Currency is required" }),
	update_stock: z.number({ error: "Update stock is required" }),
	due_date: z.string({ error: "Due date required" }),
	weather: z.string({ error: "Weather is required" }),
	customer: z.string({ error: "Customer Needed" }),
	grand_total: z
		.number({ error: "A Total is required" })
		.describe("grand total"),
	cost_center: z.string({ error: "Cost center is required" }).describe("cst"),
	mpesa: z.coerce.number().min(0),
	cash: z.coerce.number().min(0),
	project: z.string({ error: "Project is required" }).describe("project"),
	total_bottled: z.coerce.number(),
	items: z
		.array(
			z.object({
				warehouse: z
					.string({ error: "Warehouse is required" })
					.describe("warehouse"),
				income_account: z
					.string({ error: "Income account is required" })
					.describe("income acc"),
				item_name: z.string({ error: "Item name is required" }),
				item_code: z.string({ error: "Item code is required" }),
				qty: z.coerce.number({ error: "Item quantity is required" }),
				rate: z.number({ error: "Item Rate is required" }),
				amount: z.number({ error: "Item Total is required" }),
				uom: z.string({ error: "UOM is required" }).describe("uom"),
				tax_rate: z.number().nullable().describe("Tax Rate is optional"),
				item_tax_template: z
					.string()
					.nullable()
					.describe("Item Tax Template is Optional"),
				tax_type: z
					.string()
					.nullable()
					.describe("Product Tax Account not yet setup"),
			})
		)
		.transform(items => {
			const hasValidQuantity = items.some(item => item.qty >= 0);
			if (!hasValidQuantity) {
				throw new HillFreshError({
					message: "At least one item must have quantity greater than 1",
				});
			}
			return items;
		}),
	bulk_water: z.object({
		previous_water_reading: z
			.number()
			.max(10000000, { message: "Reading is excessively high" }),
		current_water_reading: z.coerce
			.number({ error: "The current water reading is required" })
			.max(10000000, { message: "The maximum limit is 9,999,999.9" })
			.min(0, { message: "Your water reading cannot be less than 0" }),
		water_used: z.number({
			error: "The amount of water sold in litres",
		}),
		waste: z.number(),
		billable_water: z.number(),
		total_bulk: z.coerce.number(),
		rate: z.coerce.number({ error: "Rate must be greater than 5" }).min(5),
	}),
});
