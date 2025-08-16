import {
	CreatedMeterReading,
	CreateMeterReading,
	FrappeCreateRequirement,
	ReadMeterReadings,
	tankMeterReadings,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class Meter extends FrappeInstance implements FrappeCreateRequirement {
	private docType: string;
	private meterInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.meterInstance = this.getFrappeClient();
	}

	async retrive_meter_readings({ tank_name }: { tank_name: string }) {
		try {
			const readings: AxiosResponse<ReadMeterReadings> =
				await this.meterInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(tankMeterReadings),
						order_by: "date desc",
						filters: JSON.stringify([["tank", "=", `${tank_name}`]]),
						limit: 1,
					},
				});
			return readings.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({ message: msg });
		}
	}
	async retrieveNamingSeries() {
		try {
			const naming_series: AxiosResponse<{ data: { naming_series: string } }> =
				await this.meterInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(["naming_series"]),
						limit: 1,
					},
				});
			return naming_series.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: "Meter series not found. " + msg,
			});
		}
	}
	async addMeterReadings({ data }: { data: CreateMeterReading }) {
		try {
			const reading: AxiosResponse<CreatedMeterReading> =
				await this.meterInstance.post(this.docType, {
					data,
				});
			return reading.data;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: "Could not Add Meter Readings " + msg,
			});
		}
	}
}
