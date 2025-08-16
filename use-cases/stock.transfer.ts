import {
	CreatedStockMovement,
	CreateStockMovementEntry,
	FrappeCreateRequirement,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

//Stock enty is a Stock Entry type of Material Transfer from the Stock Entry DocType
export class StockTransfer
	extends FrappeInstance
	implements FrappeCreateRequirement
{
	private docType: string;
	private stockTransferInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.stockTransferInstance = this.getFrappeClient();
	}

	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.stockTransferInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: `Stock Transfer Naming Series Not found. ` + msg,
			});
		}
	}

	async createStockTransfer({ data }: { data: CreateStockMovementEntry }) {
		try {
			const res: AxiosResponse<{ data: CreatedStockMovement }> =
				await this.stockTransferInstance.post(this.docType, { data });
			return res.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to Create Stock Transfer" + msg,
			});
		}
	}

	async submitStockTransfer({ data }: { data: CreatedStockMovement }) {
		try {
			const submitStock: AxiosResponse<{ message: CreatedStockMovement }> =
				await this.frappeSubmit({ doc: data });
			return submitStock.data.message;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Stock Movement Not Successful. " + msg,
			});
		}
	}
	async transferStock({ data }: { data: CreateStockMovementEntry }) {
		const transferStock = await this.createStockTransfer({ data });
		return await this.submitStockTransfer({ data: transferStock });
	}
}
