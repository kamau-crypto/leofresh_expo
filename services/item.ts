import { ItemFieldsEnum, PurchaseItem } from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class ItemsForSale extends FrappeInstance {
	private docType: string;
	private purchaseItemInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.purchaseItemInstance = this.getFrappeClient();
	}

	async getFinishedProductsToSellOrBuy() {
		try {
			const items: AxiosResponse<{ data: PurchaseItem[] }> =
				await this.purchaseItemInstance(this.docType, {
					params: {
						fields: JSON.stringify(Object.values(ItemFieldsEnum)),
						filters: JSON.stringify([["item_group", "=", "Products"]]),
					},
				});
			return items.data.data;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({ message: msg });
		}
	}
	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.purchaseItemInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Items For Sales Naming series not found " + msg,
			});
		}
	}
}

export interface PurchaseItemsWithRate extends PurchaseItem {
	rate: number;
}

export enum ItemGroup {
	Products = "Products",
	RawMaterial = "Raw Material",
	SubAssemblies = "Sub Assemblies",
}

export enum StockUom {
	DecigramLitre = "Decigram/Litre",
	Litre = "Litre",
	NOS = "Nos",
}
