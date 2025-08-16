import { ProjectFields } from "@/constants";
import { ProjectKeysFields } from "@/store/project";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { Platform } from "react-native";
import { FrappeInstance } from "./frappe";

export class Project extends FrappeInstance {
	private docType: string;
	private projectInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.projectInstance = this.getFrappeClient();
	}

	async getProjects() {
		try {
			const response: AxiosResponse<{ data: ProjectKeysFields[] }> =
				await this.projectInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(Object.values(ProjectFields)),
						limit_page_legth: 20,
					},
				});
			return response.data.data;
		} catch (error: any) {
			const errorMessage = extractFrappeErrorMessage(error);

			if (Platform.OS !== "web") {
				throw new HillFreshError({ message: errorMessage });
			}
		}
	}
}
