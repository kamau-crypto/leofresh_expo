import { CreateAgentSalesOrderData } from "@/constants";
import { ZodType, z } from "zod";

export const createAgentSalesInvoice: ZodType<CreateAgentSalesOrderData> =
	z.object({
		quotation: z.string().optional(),
		customer: z.string(),
		items: z.array(
			z.object({
				item_code: z.string(),
				item_name: z.string(),
				qty: z.number(),
				rate: z.number(),
				price_list: z.string(),
				uom: z.string(),
			})
		),
		company: z.string(),
		transaction_date: z.string(),
		delivery_date: z.string(),
	});
