//

import {
	CreatedStockReconciliations,
	CreateStockReconciliation,
	FrappeCreateRequirement,
	ReadStockReconiliation,
	RetrievedStockReconciliationRecord,
	SubmittedStockReconciliation,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

//Stock Updates occur through a stock reconciliation
export class StockReconciliation
	extends FrappeInstance
	implements FrappeCreateRequirement
{
	private docType: string;
	private stockReconciliationInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.stockReconciliationInstance = this.getFrappeClient();
	}

	async reconcile_stock({ data }: { data: CreateStockReconciliation }) {
		try {
			const stock: AxiosResponse<CreatedStockReconciliations> =
				await this.stockReconciliationInstance.post(this.docType, {
					data,
				});
			return stock.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({ message: "Failed to post stock. " + msg });
		}
	}

	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.stockReconciliationInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Stock Reconciliation Naming series not found. " + msg,
			});
		}
	}

	async submit_stock_reconciliation({
		data,
	}: {
		data: CreateStockReconciliation;
	}) {
		try {
			const stock = await this.reconcile_stock({ data });
			const submit: AxiosResponse<SubmittedStockReconciliation> =
				await this.frappeSubmit({
					doc: stock,
				});
			return submit.data.message;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({ message: "Failed to submit stock. " + msg });
		}
	}

	async retrive_last_stock() {
		try {
			const stock_name: AxiosResponse<{
				data: RetrievedStockReconciliationRecord[];
			}> = await this.stockReconciliationInstance.get(this.docType, {
				params: {
					fields: JSON.stringify(["name", "posting_date", "posting_time"]),
					filter: JSON.stringify([["cost_center", "=", "CC-SHOP1 - HF"]]),
					order_by: "name desc",
					limit: 1,
				},
			});
			const stock_items: AxiosResponse<{ data: ReadStockReconiliation }> =
				await this.stockReconciliationInstance.get(
					`${this.docType}/${stock_name.data.data[0].name}`
				);

			return stock_items.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to retrieve last stock. " + msg,
			});
		}
	}
}
