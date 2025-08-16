import {
	FrappeCreateRequirement,
	ReadExpenseAccounts,
	RetrievedJournalEntry,
} from "@/constants";
import { appConfig } from "@/utils/config";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class Expense extends FrappeInstance implements FrappeCreateRequirement {
	private docType: string;
	private expenseInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.expenseInstance = this.getFrappeClient();
	}

	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.expenseInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const errorMessage = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Journal Entry series not found " + errorMessage,
			});
		}
	}

	//Retrieve all the expense accounts associated with this order...
	async retrieveExpenseAccounts({ page_length }: { page_length: number }) {
		try {
			const accounts: AxiosResponse<{ data: ReadExpenseAccounts[] }> =
				await this.expenseInstance.get(this.docType, {
					params: {
						filters: JSON.stringify([
							["Account", "root_type", "=", "Expense"],
							["Account", "is_group", "=", 0],
							["Account", "name", "NOT LIKE", "%Cost of Goods Sold%"],
							["Account", "name", "NOT LIKE", "%COGS%"],
							["Account", "name", "NOT LIKE", "%Goods Sold%"],
						]),
						limit_page_length: page_length,
					},
				});
			return accounts.data.data;
		} catch (error: any) {
			const errorMessage = extractFrappeErrorMessage(error);

			throw new HillFreshError({
				message: "Expense accounts not found " + errorMessage,
			});
		}
	}

	async retrieveExpenses({
		limit,
		cost_center,
	}: {
		limit: number;
		cost_center: string;
	}) {
		try {
			//This is a custom end point, filtering here will not work instead affect the api
			const expenses: AxiosResponse<{ message: RetrievedJournalEntry }> =
				await axios.post(appConfig.EXPENSES_URL, {
					cost_center: cost_center,
					limit: limit,
				});
			// return expenses.data.data.filter(f => f.cost_center === cost_center);
			return expenses.data.message.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Could Not Retrieve Expenses " + msg,
			});
		}
	}
}
