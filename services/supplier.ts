import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export interface AllSuppliers {
	data: TypedSupplier[];
}

export interface TypedSupplier {
	supplier_name: string;
	supplier_type: string;
}

export enum SupplierEnum {
	supplier_name = "supplier_name",
	supplier_type = "supplier_type",
}

export class Supplier extends FrappeInstance {
	private supplierInstance: AxiosInstance;
	private docType: string;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.supplierInstance = this.getFrappeClient();
	}

	async getAllSuppliers({ limit }: { limit: number }) {
		try {
			const response: AxiosResponse<AllSuppliers> =
				await this.supplierInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(Object.values(SupplierEnum)),
						// filters: JSON.stringify([
						// 	["supplier_group", "=", "Leofresh Supplier"],
						// ]), // Only show the suppliers who are in a company
						limit_page_length: limit,
					},
				});
			return response.data.data;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: "Failed to get all suppliers. " + msg,
			});
		}
	}
}
