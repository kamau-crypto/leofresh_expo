import { CreateJournalEntry } from "@/constants";
import { z, ZodType } from "zod";

export interface CreateBankingRecord extends CreateJournalEntry {
	amount: number;
	cheque_no: string;
	cheque_date: string;
}

export const create_banking_entry: ZodType<CreateBankingRecord> = z.object({
	naming_series: z.string(),
	voucher_type: z.string(),
	posting_date: z.string(),
	company: z.string(),
	cheque_no: z.string(),
	cheque_date: z.string(),
	accounts: z.array(
		z.object({
			account: z.string(),
			cost_center: z.string().optional(),
			project: z.string().optional(),
			debit_in_account_currency: z.coerce
				.number({ error: "Invalid value found" })
				.min(0)
				.optional(),
			credit_in_account_currency: z.coerce
				.number({ error: "Invalid value found" })
				.min(0)
				.optional(),
		})
	),
	user_remark: z.string(),
	multi_currency: z.number(),
	receipt_no: z.string({ error: "Add the receipt number here" }),
	amount: z.coerce
		.number({
			error: "The amount is required to proceed",
		})
		.min(1),
});
