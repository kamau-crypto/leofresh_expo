import { FrappeCreateRequirement, SalesOrderEnum } from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

type TypedSalesOrder = keyof typeof SalesOrderEnum;
export type TypedSalesOrders = { [key in TypedSalesOrder]: string };

export class SalesOrder
	extends FrappeInstance
	implements FrappeCreateRequirement
{
	private salesOrderInstance: AxiosInstance;
	private docType: string;
	constructor({ docType }: { docType: string }) {
		super();
		this.salesOrderInstance = this.getFrappeClient();
		this.docType = docType;
	}

	createSalesOrder() {
		const salesConstants = {
			naming_series: "SAL-ORD-.YYYY.-",
			order_type: "Sales",
			currency: "KES",
			selling_price_list: "Standard Selling",
		};
		throw new Error("This method is not implemented yet");
	}

	submitSalesOrder() {
		throw new Error("This method is not implemented yet");
	}

	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.salesOrderInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Sales Order Naming series not found. " + msg,
			});
		}
	}

	async retrieveSalesOrders({ page_length }: { page_length: number }) {
		try {
			const orders: AxiosResponse<{ data: TypedSalesOrders[] }> =
				await this.salesOrderInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(Object.values(SalesOrderEnum)),
						limit_page_length: page_length,
					},
				});
			return orders.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Could not retrieve Sales Orders. " + msg,
			});
		}
	}

	async retrieveSalesOrder({ name }: { name: string }) {
		try {
			const order = await this.salesOrderInstance.get(
				`${this.docType}/${name}`
			);
			return order.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new Error(msg);
		}
	}
}
