import {
	CreatedMaterialRequest,
	CreateMaterialRequest,
	materialRequestFields,
	ReadMultipleMaterialRequests,
	ReadSingleMaterialRequest,
	ReadSubmittedMaterialRequest,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class MaterialRequest extends FrappeInstance {
	private docType: string;
	private materialRequestInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.materialRequestInstance = this.getFrappeClient();
	}

	async retrieveMaterialRequests({
		warehouse,
		limit,
	}: {
		warehouse: string;
		limit: number;
	}) {
		try {
			const requests: AxiosResponse<ReadMultipleMaterialRequests> =
				await this.materialRequestInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(materialRequestFields),
						limit: limit,
						order_by: "transaction_date desc",
						filters: JSON.stringify([
							["set_warehouse", "=", `${warehouse}`],
							["material_request_type", "=", "Material Transfer"],
						]),
					},
				});
			return requests.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to Retrieve the Orders " + msg,
			});
		}
	}

	//
	//Develop a method to show the number of items associated with an order
	async retrieveMaterialRequest({ material_req }: { material_req: string }) {
		try {
			const res: AxiosResponse<ReadSingleMaterialRequest> =
				await this.materialRequestInstance.get(
					`${this.docType}/${material_req}`
				);
			return res.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);

			throw new HillFreshError({
				message: `Failed to retrieve Order named ${material_req}. ` + msg,
			});
		}
	}

	async resendRequest({ name }: { name: string }) {
		try {
			const res = await this.materialRequestInstance.get(
				`${this.docType}/${name}`
			);
			return res.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({ message: "Failed to resend Order. " + msg });
		}
	}

	async cancelRequest({ name }: { name: string }) {
		try {
			const res = await this.frappeCancel({ doctype: this.docType, name });
			return res;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({ message: msg });
		}
	}

	async deleteMaterialRequest({ name }: { name: string }) {
		try {
			const res: AxiosResponse<{ data: "ok" }> =
				await this.materialRequestInstance.delete(`${this.docType}/${name}`);
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to delete the Order. " + msg,
			});
		}
	}
	async createMaterialRequest({ data }: { data: CreateMaterialRequest }) {
		try {
			const materialRequest: AxiosResponse<CreatedMaterialRequest> =
				await this.materialRequestInstance.post(this.docType, {
					data,
				});
			return materialRequest.data.data;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: "Could not Complete Stock Refill Order" + msg,
			});
		}
	}

	async submitMaterialRequest({ name }: { name: string }) {
		try {
			const doc = await this.retrieveMaterialRequest({ material_req: name });
			const materialReq: AxiosResponse<ReadSubmittedMaterialRequest> =
				await this.frappeSubmit({ doc });

			return materialReq.data.message;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: "Could not submit Order " + msg,
			});
		}
	}
}
