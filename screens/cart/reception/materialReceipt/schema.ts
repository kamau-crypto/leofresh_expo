import { CreateStockMovementEntry } from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { ZodType, z } from "zod";

export const createStockMovementEntry: ZodType<CreateStockMovementEntry> =
	z.object({
		stock_entry_type: z.string(),
		delivery_note: z.string({
			required_error: "A delivery note is needed to complete this order",
		}),
		driver_name: z.string({
			required_error: "The name of the driver is required",
		}),
		material_request: z.string({
			required_error: "The name of the Material Request",
		}),
		reg_no: z.string({
			required_error: "The delivery vehicle Registration Number is needed",
		}),
		items: z
			.array(
				z.object({
					item_name: z.string(),
					item_code: z.string(),
					qty: z.coerce.number(),
					uom: z.string(),
					s_warehouse: z.string(),
					t_warehouse: z.string(),
					conversion_factor: z.number(),
					basic_rate: z.coerce.number(),
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
	});
