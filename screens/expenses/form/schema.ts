import { CreateJournalEntry } from "@/constants";
import { z, ZodType } from "zod";

export interface CreateJournalEntryRecord extends CreateJournalEntry {
	amount: number;
}

export const create_journal_entry: ZodType<CreateJournalEntryRecord> = z.object(
	{
		naming_series: z.string(),
		voucher_type: z.string(),
		posting_date: z.string(),
		company: z.string(),
		accounts: z.array(
			z.object({
				account: z.string(),
				cost_center: z.string().optional(),
				project: z.string().optional(),
				debit_in_account_currency: z.coerce
					.number({ required_error: "Invalid value found" })
					.min(0)
					.optional(),
				credit_in_account_currency: z.coerce
					.number({ required_error: "Invalid value found" })
					.min(0)
					.optional(),
			})
		),
		user_remark: z.string(),
		multi_currency: z.number(),
		receipt_no: z.string({ required_error: "Add the receipt number here" }),
		amount: z.coerce
			.number({
				required_error: "The amount is required to proceed",
			})
			.min(1),
	}
);
