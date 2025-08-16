import { CreateMaterialRequest, GetPurchaseOrderItem, PurchaseOrderDetails } from "@/constants";
import { z, ZodType } from "zod";

export interface CreatePurchaseInvoice {
	delivery_note: string;
	supplier: string;
	driver_name: string;
	reg_no: string;
	delivery_date: Date;
	items: CreatePurchaseInvoiceItem[];
}

interface CreatePurchaseInvoiceItem
	extends Pick<
		GetPurchaseOrderItem,
		"qty" | "uom" | "rate" | "item_name" | "item_code" | "name"
	> {}
// For Purchase Invoice
// export const createPurchaseInvoiceSchema: ZodType<CreatePurchaseInvoice> =
// 	z.object({
// 		delivery_note: z.string({
// 			description: "The Delivery Note number is required",
// 		}),
// 		supplier: z.string({ description: "A supplier is needed" }),
// 		driver_name: z.string({
// 			description: "Delivery Driver required",
// 			required_error: "Delivery Driver is required",
// 		}),
// 		reg_no: z.string({
// 			required_error: "Vehicle registration Number is required",
// 		}),
// 		delivery_date: z.date(),
// 		items: z
// 			.array(
// 				z.object({
// 					qty: z.coerce.number(),
// 					uom: z.string(),
// 					rate: z.coerce.number(),
// 					item_name: z.string(),
// 					item_code: z.string(),
// 					name: z.string(),
// 				})
// 			)
// 			.transform(items => {
// 				const hasValidQuantity = items.some(item => item.qty > 0);
// 				if (!hasValidQuantity) {
// 					throw new HillFreshError({
// 						message: "At least one item must have quantity greater than 1",
// 					});
// 				}
// 				return items;
// 			}),
// 	});

export const createMaterialRequestSchema: ZodType<CreateMaterialRequest> =
	z.object({
		material_request_type: z.string(),
		company: z.string(),
		schedule_date: z.date(),
		set_from_warehouse: z.string(),
		set_warehouse: z.string(),
		purpose: z.string(),
		items: z.array(
			z.object({
				item_name: z.string(),
				item_code: z.string(),
				qty: z.number(),
				uom: z.string(),
				from_warehouse: z.string(),
				warehouse: z.string(),
				schedule_date: z.string(),
			})
		),
	});
// For Purchase Purposes
export const createPurchaseOrderDetails: ZodType<PurchaseOrderDetails> =
	z.object({
		supplier: z.string({}),
		transaction_date: z.string(),
		project: z.string(),
		naming_series: z.string(),
		schedule_date: z.string(),
		company: z.string(),
		cost_center: z.string(),
		currency: z.string(),
		buying_price_list: z.string(),
		items: z.array(
			z.object({
				item_name: z.string(),
				item_code: z.string(),
				qty: z.number(),
				uom: z.string(),
				rate: z.number(),
				amount: z.number(),
				conversion_factor: z.number(),
			})
		),
		set_warehouse: z.string(),
	});
