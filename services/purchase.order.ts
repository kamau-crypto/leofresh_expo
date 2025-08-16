import {
	FrappeCreateRequirement,
	GetPurchaseOrder,
	PurchaseOrderDetails,
	purchaseOrderFields,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export interface RetrievedPurchaseOrders {
	data: ReturnedPurchaseOrder[];
}

export interface ReturnedPurchaseOrder {
	name: string;
	company: string;
	supplier: string;
	transaction_date: string;
	schedule_date: Date;
	status: string;
	project: null;
	buying_price_list: string;
	total: number;
	grand_total: number;
	advance_paid: number;
	cost_center: null | string;
	currency: string;
	per_received: number;
	creation: string;
}

export class PurchaseOrder
	extends FrappeInstance
	implements FrappeCreateRequirement
{
	private purchaseOrderInstance: AxiosInstance;
	private docType: string;
	constructor({ docType }: { docType: string }) {
		super();
		this.purchaseOrderInstance = this.getFrappeClient();
		this.docType = docType;
	}

	async createPurchaseOrder({
		order,
	}: {
		order: PurchaseOrderDetails;
	}): Promise<{ data: GetPurchaseOrder }> {
		try {
			const response = await this.purchaseOrderInstance.post(
				this.docType,
				JSON.stringify(order)
			);
			return response.data;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: "Failed to create Purchase Order. " + msg,
			});
		}
	}

	async retrievePurchaseOrders({
		limit,
		cost_center,
	}: {
		limit: number;
		cost_center: string;
	}) {
		try {
			const response: AxiosResponse<RetrievedPurchaseOrders> =
				await this.purchaseOrderInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(purchaseOrderFields),
						limit,
						filters: JSON.stringify([["cost_center", "=", `${cost_center}`]]),
						order_by: "name desc",
					},
				});
			return response.data.data;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: "Failed to Retrieve Purchase Order. " + msg,
			});
		}
	}
	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.purchaseOrderInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Purchase Order Naming series not found. " + msg,
			});
		}
	}

	async retrievePurchaseOrder({ name }: { name: string }) {
		try {
			const response: AxiosResponse<{ data: GetPurchaseOrder }> =
				await this.purchaseOrderInstance.get(`${this.docType}/${name}`);
			return response.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to retrieve Purchase Orders. " + msg,
			});
		}
	}

	async submitPurchaseOrder({ name }: { name: string }) {
		const order = await this.retrievePurchaseOrder({
			name,
		});
		try {
			const response = await this.frappeSubmit({ doc: order });
			return response.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to submit purchase Order. " + msg,
			});
		}
	}

	receiveAndBillPurchaseOrder() {
		throw new HillFreshError({ message: "Method Not implemented" });
	}

	async cancelPurchaseOrder({ name }: { name: string }) {
		try {
			const res = await this.frappeCancel({ doctype: this.docType, name });
			return res;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Cannot Cancel Purchase Order. " + msg,
			});
		}
	}

	async deletePurchaseOrder({ name }: { name: string }) {
		try {
			const res: AxiosResponse<{ data: "ok" }> =
				await this.purchaseOrderInstance.delete(`${this.docType}/${name}`);
			return res.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to Delete Purchase order. " + msg,
			});
		}
	}

	async resendPurchaseOrder({ name }: { name: string }) {
		try {
			const order = await this.retrievePurchaseOrder({ name });

			return order;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to resend Purchase Order" + msg,
			});
		}
	}

	async updatePurchaseOrder({
		name,
		data,
	}: {
		name: string;
		data: { status: string; per_received: number };
	}) {
		try {
			const updatedOrder: AxiosResponse<any> =
				await this.purchaseOrderInstance.put(`${this.docType}/${name}`, data);
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to Update Purcahse Order" + msg,
			});
		}
	}
}

// const response = await frappeInstance.get('/resource/Task', {
// 	params: {
// 		fields: JSON.stringify(['name', 'subject', 'status', 'priority']), // Specify fields to retrieve
// 		filters: JSON.stringify([['status', '=', 'Open']]), // Apply filters if needed
// 		limit_page_length: 20, // Limit the number of records
// 	},
// });

// interface PurchaseOrderProps {
// 	name: string;
// 	supplier: string;
// 	transaction_date: string;
// 	schedule_date: string;
// 	project: string;
// 	buying_price_list: string;
// 	total: number;
// 	grand_total: number;
// 	advance_paid: number;
// 	cost_center: string | null;
// 	status: "Draft" | "To Receive and Bill" | "Completed";
// 	currency: string;
// }
