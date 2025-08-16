import {
	CreatedTankReading,
	CreateTankReading,
	customerTankDetals,
	customerTanks,
	ReadCustomerTank,
	ReadTankDetails,
	ReadTankReading,
	tankReadings,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class Tanks extends FrappeInstance {
	private docType: string;
	private tankInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.tankInstance = this.getFrappeClient();
	}
	//Retrieve the water tanks needed within the app, they can be more than one water tank
	//available within a shop
	async getTank({ tank_name }: { tank_name: string }) {
		try {
			const tank: AxiosResponse<{ data: ReadCustomerTank[] }> =
				await this.tankInstance.get("Customer", {
					params: {
						fields: JSON.stringify(customerTanks),
						filters: JSON.stringify([["name", "=", `${tank_name}`]]),
					},
				});
			return tank.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({ message: "Failed to get tank. " + msg });
		}
	}
	//available within a shop
	async getTankDetails({ tank_name }: { tank_name: string }) {
		try {
			const tank: AxiosResponse<{ data: ReadTankDetails[] }> =
				await this.tankInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(customerTankDetals),
						filters: JSON.stringify([["name", "=", `${tank_name}`]]),
					},
				});
			return tank.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to get Tank Details. " + msg,
			});
		}
	}
	async getLatestTankReading({ tank }: { tank: string }) {
		try {
			const res: AxiosResponse<{ data: ReadTankReading[] }> =
				await this.tankInstance.get(this.docType, {
					params: {
						filters: JSON.stringify([["tank", "=", tank]]),
						fields: JSON.stringify(tankReadings),
						order_by: "date desc",
						limit: 1,
					},
				});
			return res.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to get the Latest Tank Readings. " + msg,
			});
		}
	}
	async createTankReading({ data }: { data: CreateTankReading }) {
		try {
			const res: AxiosResponse<{ data: CreatedTankReading }> =
				await this.tankInstance.post(this.docType, { data });
			return res.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to create Tank Reading. " + msg,
			});
		}
	}
	async getTankReadingType({ tank }: { tank: string }) {
		try {
			const res: AxiosResponse<{ data: ReadTankReading }> =
				await this.tankInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["reading_type"]),
					},
				});
			return res.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Failed to fetch Tank Reading Type. " + msg,
			});
		}
	}
}
