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
	weather: z.string({ description: "Weather is required" }),
	customer: z.string(),
	grand_total: z.number({ required_error: "A Total is required" }),
	cost_center: z.string(),
	project: z.string(),
});

export const createSalesInvoiceSchema: ZodType<CreateSalesInvoice> = z.object({
	posting_date: z.string({}),
	company: z.string({}),
	selling_price_list: z.string({}),
	debit_to: z.string({}),
	party_account_currency: z.string({}),
	naming_series: z.string({}),
	currency: z.string({}),
	update_stock: z.number(),
	due_date: z.string({
		description: "due_date",
		required_error: "due date required",
	}),
	weather: z.string({
		description: "weather",
		required_error: "weather is required",
	}),
	customer: z.string({ description: "customer", required_error: "customer" }),
	grand_total: z.number({
		required_error: "A Total is required",
		description: "grand total",
	}),
	cost_center: z.string({ description: "cst", required_error: "cost center" }),
	mpesa: z.coerce.number().min(0),
	cash: z.coerce.number().min(0),
	project: z.string({ description: "project", required_error: "Project" }),
	total_bottled: z.coerce.number({}),
	items: z
		.array(
			z.object({
				warehouse: z.string({ description: "warehouse" }),
				income_account: z.string({ description: "icome acc" }),
				item_name: z.string({ required_error: "Item name is required" }),
				item_code: z.string({ required_error: "Item name is required" }),
				qty: z.coerce.number({ required_error: "Item quantity is required" }),
				rate: z.number({ required_error: "Item Rate is required" }),
				amount: z.number({ required_error: "Item Total is required" }),
				uom: z.string({ description: "uom" }),
				tax_rate: z.number({ description: "Tax Rate is optional" }).nullable(),
				item_tax_template: z
					.string({
						description: "Item Tax Template is Optional",
					})
					.nullable(),
				tax_type: z
					.string({
						description: "Product Tax Account not yet setup",
					})
					.nullable(),
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
	bulk_water: z
		.object({
			previous_water_reading: z
				.number()
				.max(10000000, { message: "Reading is excessively high" }),
			current_water_reading: z.coerce
				.number({
					required_error: "The current water reading is required",
					description: "The current water reading",
				})
				.max(10000000, { message: "The maximum limit is 9,999,999.9" })
				.min(0, { message: "Your water reading cannot be less than 0" }),
			water_used: z.number({
				required_error: "The amount of water sold in litres",
			}),
			waste: z.number(),
			billable_water: z.number(),
			total_bulk: z.coerce.number(),
			rate: z.coerce
				.number({ description: "Rate must be greater than 5" })
				.min(5),
		})
		.required(),
});
