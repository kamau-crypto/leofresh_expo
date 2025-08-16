import { CreateMaterialRequest } from "@/constants";
import { ZodType, z } from "zod";

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

// export const createStockMovementEntry: ZodType<CreateStockMovementEntry> =
// 	z.object({
// 		stock_entry_type: z.string(),
// 		delivery_note: z.string({
// 			required_error: "A delivery note is needed to complete this order",
// 		}),
// 		driver_name: z.string({
// 			required_error: "The name of the driver is required",
// 		}),
// 		reg_no: z.string({
// 			required_error: "The delivery vehicle Registration Number is needed",
// 		}),
// 		items: z
// 			.array(
// 				z.object({
// 					item_name: z.string(),
// 					item_code: z.string(),
// 					qty: z.coerce.number(),
// 					uom: z.string(),
// 					s_warehouse: z.string(),
// 					t_warehouse: z.string(),
// 					conversion_factor: z.number(),
// 					basic_rate: z.coerce.number(),
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
