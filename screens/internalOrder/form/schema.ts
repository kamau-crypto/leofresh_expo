import { CreateMaterialRequest, MaterialRequestItem } from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { z, ZodType } from "zod";

export interface MaterialRequestItemWithImage extends MaterialRequestItem {
	image: string;
	rate: number;
	amount: number;
}
export interface CustomCreateMaterialRequest
	extends Omit<CreateMaterialRequest, "items"> {
	items: MaterialRequestItemWithImage[];
}

export const createMaterialRequest: ZodType<CustomCreateMaterialRequest> =
	z.object({
		company: z.string(),
		material_request_type: z.string(),
		schedule_date: z.date({ required_error: "A date of delivery is needed" }),
		set_from_warehouse: z.string({
			required_error: "The Warehouse of Origin is Needed to move the goods",
		}),
		set_warehouse: z.string({
			required_error: "The Warehouse where to move the items to is required",
		}),
		purpose: z.string({}),
		items: z
			.array(
				z.object({
					item_name: z.string(),
					item_code: z.string(),
					image: z.string(),
					qty: z.number(),
					uom: z.string(),
					amount: z.number(),
					rate: z.number(),
					warehouse: z.string(),
					from_warehouse: z.string(),
					schedule_date: z.string(),
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
