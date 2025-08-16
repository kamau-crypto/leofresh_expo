import {
	CreatedPurchaseReceipt,
	CreatePurchaseReceipt,
	FrappeCreateRequirement,
	SubmittedPurchaseReceiptMessage,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class PurchaseReceipt
	extends FrappeInstance
	implements FrappeCreateRequirement
{
	private docType: string;
	private receiptInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.receiptInstance = this.getFrappeClient();
	}

	async retrieveNamingSeries(): Promise<{ naming_series: string }> {
		try {
			const naming_series: AxiosResponse<{
				data: [{ naming_series: string }];
			}> = await this.receiptInstance.get(this.docType, {
				params: {
					fields: JSON.stringify(["naming_series"]),
					limit: 1,
				},
			});
			return { naming_series: naming_series.data.data[0].naming_series };
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Could not retrieve Purchase Receipt Naming series" + msg,
			});
		}
	}

	async createPurchaseReceipt({ data }: { data: CreatePurchaseReceipt }) {
		try {
			const res: AxiosResponse<{ data: CreatedPurchaseReceipt }> =
				await this.receiptInstance.post(this.docType, { data });
			return res.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to create Purchase Receipt " + msg,
			});
		}
	}

	async createAndSubmitPurchaseReceipt({
		data,
	}: {
		data: CreatePurchaseReceipt;
	}) {
		try {
			const createdPR = await this.createPurchaseReceipt({ data });
			const res: AxiosResponse<{ message: SubmittedPurchaseReceiptMessage }> =
				await this.frappeSubmit({ doc: createdPR });
			return res.data.message;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Submitting Purchase Receipt Failed. " + msg,
			});
		}
	}
}
