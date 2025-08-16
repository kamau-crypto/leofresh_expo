import { PurchaseItems } from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { z, ZodType } from "zod";

export interface AddPurchaseOrder {
	supplier: string;
	transaction_date: Date;
	schedule_date: Date;
	cost_center: string;
	buying_price_list: string;
	items: PurchaseOrderItem[];
	set_warehouse: string;
}

export interface PurchaseOrderItem
	extends Pick<
		PurchaseItems,
		| "item_name"
		| "image"
		| "standard_buying_uom"
		| "price_list_rate"
		| "item_code"
		| "conversion_factor"
	> {
	qty: number;
	rate: number;
	amount: number;
}

export const createPurchaseOrder: ZodType<AddPurchaseOrder> = z.object({
	supplier: z.string({
		description: "A supplier is needed to make an order",
		required_error: "A supplier needs to be chosen",
	}),
	transaction_date: z.date(),
	schedule_date: z.date({ required_error: "A date of delivery is needed" }),
	cost_center: z.string(),
	buying_price_list: z.string(),
	items: z
		.array(
			z.object({
				item_name: z.string(),
				item_code: z.string(),
				qty: z.number(),
				standard_buying_uom: z.string().nullable(),
				price_list_rate: z.number(),
				rate: z.number(),
				amount: z.number(),
				image: z.string().nullable(),
				conversion_factor: z.number(),
			})
		)
		.transform(items => {
			const hasValidQuantity = items.some(item => item.qty > 0);
			if (!hasValidQuantity) {
				throw new HillFreshError({
					message: "At least one item must have quantity greater than 1",
				});
			}
			return items;
		}),
	set_warehouse: z.string(),
});
