import {
	CreateSalesInvoiceRecord,
	PurchaseInvoiceFieldsEnum,
	PurchaseInvoiceResult,
	ResultInvoice,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { AxiosInstance, AxiosResponse } from "axios";
import { SalesOrder } from "./sales.order";

export class SalesInvoice extends SalesOrder {
	private salesInvoiceInstance: AxiosInstance;
	private salesDocType: string;
	constructor({ docType }: { docType: string }) {
		super({ docType: "Sales Order" });
		this.salesInvoiceInstance = this.getFrappeClient();
		this.salesDocType = docType;
	}

	async createSalesInvoice({ inv }: { inv: CreateSalesInvoiceRecord }) {
		//
		//Refine the data about the sales order to proceed with the data migration
		try {
			// const createdInvoice: AxiosResponse<PurchaseInvoiceResult> =
			const createdInvoice = await this.salesInvoiceInstance.post(
				this.salesDocType,
				{
					...inv,
				}
			);
			return createdInvoice.data.data;
		} catch (e: any) {
			JSON.parse(
				e.response.data._server_messages,
				function (this: any, _key: string, _value: any) {
					throw new HillFreshError({
						message:
							"Sales Invoice not created " +
							JSON.parse(this[0])
								.message.replace(/<[^>]*>/g, "")
								.trim(),
					});
				}
			);
		}
	}

	async retrieveSalesInvoice({ name }: { name: string }) {
		try {
			const order: AxiosResponse<PurchaseInvoiceResult> =
				await this.salesInvoiceInstance.get(`${this.salesDocType}/${name}`);
			return order.data.data;
		} catch (e: any) {
			JSON.parse(
				e.response.data._server_messages,
				function (this: any, _key: string, _value: any) {
					throw new HillFreshError({
						message:
							"Sales Invoice not retrieved " +
							JSON.parse(this[0])
								.message.replace(/<[^>]*>/g, "")
								.trim(),
					});
				}
			);
		}
	}

	async submitSalesInvoice({ order }: { order: any }) {
		try {
			// const response: AxiosResponse<SubmitSalesInvoice> =
			const response = await this.frappeSubmit({ doc: order });
			return response.data;
		} catch (e: any) {
			JSON.parse(
				e.response.data._server_messages,
				function (this: any, _key: string, _value: any) {
					throw new HillFreshError({
						message:
							"Sales Invoice not submitted " +
							JSON.parse(this[0])
								.message.replace(/<[^>]*>/g, "")
								.trim(),
					});
				}
			);
		}
	}

	async cancelSalesInvoice({ name }: { name: string }) {
		try {
			const res = await this.frappeCancel({ doctype: this.salesDocType, name });
			return res;
		} catch (e: any) {
			JSON.parse(
				e.response.data._server_messages,
				function (this: any, _key: string, _value: any) {
					throw new HillFreshError({
						message:
							"Sales Invoice not cancelled " +
							JSON.parse(this[0])
								.message.replace(/<[^>]*>/g, "")
								.trim(),
					});
				}
			);
		}
	}
	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.salesInvoiceInstance.get(this.salesDocType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const msg = JSON.parse(
				e.response.data._server_messages,
				function (this: any, _key: string, _value: any) {
					return JSON.parse(this[0])
						.message.replace(/<[^>]*>/g, "")
						.trim();
				}
			);
			throw new HillFreshError({
				message: "Sales Invoice Naming series not found" + msg,
			});
		}
	}

	async deleteSalesInvoice({ name }: { name: string }) {
		try {
			const res: AxiosResponse<{ data: "ok" }> =
				await this.salesInvoiceInstance.delete(`${this.salesDocType}/${name}`);
			return res.data.data;
		} catch (e: any) {
			const msg = JSON.parse(
				e.response.data._server_messages,
				function (this: any, _key: string, _value: any) {
					return JSON.parse(this[0])
						.message.replace(/<[^>]*>/g, "")
						.trim();
				}
			);

			throw new HillFreshError({
				message: "Failed to delete Sales Invoice " + msg,
			});
		}
	}

	//order the purchase invoices in descending order per project
	async retrieveSalesInvoices({
		page_length,
		project,
	}: {
		page_length: number;
		project: string;
	}) {
		const fields = ["mpesa_amount", "cash_amount"].concat(
			Object.values(PurchaseInvoiceFieldsEnum)
		);

		try {
			const orders: AxiosResponse<{ data: ResultInvoice[] }> =
				await this.salesInvoiceInstance.get(this.salesDocType, {
					params: {
						fields: JSON.stringify(fields),
						limit_page_length: page_length,
						filters: JSON.stringify([["project", "=", project]]),
						order_by: "name desc",
					},
				});
			return orders.data.data;
		} catch (e: any) {
			// const { show } = useSnackbar();
			// show({ message: e.message, action: { label: "Close" } });
			const msg = JSON.parse(
				e.response.data._server_messages,
				function (this: any, _key: string, _value: any) {
					return JSON.parse(this[0]).message;
				}
			);
			throw new HillFreshError({
				message: "Sales Invoices Not created" + msg,
			});
		}
	}
}
