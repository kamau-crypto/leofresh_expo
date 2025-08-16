//

import { profileKeys, ReadPOSProfile } from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

//Define a POS profile for the app

export class POSProfile extends FrappeInstance {
	private docType: string;
	private profileInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.profileInstance = this.getFrappeClient();
	}

	async retrievePOSProfile({ email }: { email?: string }) {
		try {
			const data: AxiosResponse<{ data: ReadPOSProfile[] }> =
				await this.profileInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(profileKeys),
						limit_page_length: 200,
						order_by: "customer asc",
					},
				});
			return data.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);

			throw new HillFreshError({ message: msg });
		}
	}
}
