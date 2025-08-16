import {
	CreatedPurchaseInvoice,
	CreatedPurchaseInvoiceData,
	CreatePurchaseInvoices,
	ReadCreatedPurchaseInvoice,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class PurchaseInvoice extends FrappeInstance {
	private docType: string;
	private purchaseInvoiceInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.purchaseInvoiceInstance = this.getFrappeClient();
	}

	async createPurchaseInvoice({ data }: { data: CreatePurchaseInvoices }) {
		try {
			const res: AxiosResponse<CreatedPurchaseInvoice> =
				await this.purchaseInvoiceInstance.post(this.docType, data);
			return res.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Could not create the purchase Invoice. " + msg,
			});
		}
	}

	async getPurchcaseInvoiceData({ purchaseOrder }: { purchaseOrder: string }) {
		return await this.frappeConstructInvoiceData({ purchaseOrder });
	}

	async submitPurchaseInvoice({
		purchaseInv,
	}: {
		purchaseInv: CreatedPurchaseInvoiceData;
	}) {
		try {
			const res: AxiosResponse<{ message: ReadCreatedPurchaseInvoice }> =
				await this.frappeSubmit({ doc: purchaseInv });
			return res.data.message;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: "Could not submit Purchase Invoice. " + msg,
			});
		}
	}

	//Create the purchase invoice from a purchase order. this only occurs when the purchase order is successfully submitted,
	async purchasesInvoiceCycle({ purchaseOrder }: { purchaseOrder: string }) {
		const poI = await this.getPurchcaseInvoiceData({ purchaseOrder });
		const createPI = await this.createPurchaseInvoice({ data: poI });
		const submitPI = await this.submitPurchaseInvoice({
			purchaseInv: createPI,
		});
		return submitPI;
	}
}
