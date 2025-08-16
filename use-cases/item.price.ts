//

import {
	FrappeCreateRequirement,
	PurchaseProducts,
	SalesProducts,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

enum ItemPriceEnum {
	item_code = "item_code",
	price_list_rate = "price_list_rate",
}

//retrieve the item price
export class ItemPrice
	extends FrappeInstance
	implements FrappeCreateRequirement
{
	private docType: string;
	private ItemBuyingPriceInstance: AxiosInstance;
	private ItemSellingPriceInstance: AxiosInstance;
	private ItemPriceInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.ItemPriceInstance = this.getFrappeClient();
		this.ItemBuyingPriceInstance = this.getBuyingClient();
		this.ItemSellingPriceInstance = this.getSellingClient();
	}

	async retrieveSellingItemPrices() {
		try {
			const response: AxiosResponse<SalesProducts, any> =
				await this.ItemSellingPriceInstance.post(
					"",
					{
						price_list: "Standard Selling",
					},
					{
						params: {
							filters: JSON.stringify([["item_group", "=", "Products"]]),
						},
					}
				);
			return response.data.message.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({ message: msg });
		}
	}

	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.ItemPriceInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "ItemPrice Naming series not found " + msg,
			});
		}
	}
	async retrieveBuyingItemPrices() {
		try {
			const response: AxiosResponse<PurchaseProducts, any> =
				await this.ItemBuyingPriceInstance.post(
					"",
					{
						price_list: "Standard Buying",
					},
					{
						params: {
							filters: JSON.stringify([["item_group", "=", "Products"]]),
						},
					}
				);
			return response.data.message.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);

			throw new HillFreshError({ message: msg });
		}
	}
}
