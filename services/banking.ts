//DocType to affect is Payment Entry. TO make a successfull banking, retrive the last

import {
	bankAccountFields,
	CreatePaymentEntry,
	ReadBankAccounts,
	ReadPaymentEntryData,
	ReadSubmittedPaymentEntry,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

interface FrappeErrorResponse {
	exception?: string;
	exc_type?: string;
	_exc_source?: string;
	exc?: string[];
	_server_messages?: string;
	message?: string;
	// Standard Axios error response properties
	response?: {
		data?: FrappeErrorResponse;
		status?: number;
		statusText?: string;
		headers?: any;
	};
}

//purchase Invoice that was was not paid alongside all its corresponding details..
export class Banking extends FrappeInstance {
	private bankingInstance: AxiosInstance;
	private docType: string;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.bankingInstance = this.getFrappeClient();
	}

	//
	//To make a payment, create, and submit a payment Entry. //Alternatively

	async createPaymentEntry({ data }: { data: CreatePaymentEntry }) {
		try {
			// const createdPayment: AxiosResponse<{ data: CreatedPaymentEntryDoc }> =
			const createdPayment = await this.bankingInstance.post(this.docType, {
				data,
			});
			return createdPayment.data.data;
		} catch (e: any) {
			const errorMessage = extractFrappeErrorMessage(e);

			throw new HillFreshError({
				message: "Payment not created " + errorMessage,
			});
		}
	}

	async makePaymentEntry({ data }: { data: CreatePaymentEntry }) {
		try {
			const payment = await this.createPaymentEntry({ data });
			const retrPayment = await this.retrievePaymentEntry({
				name: payment.name,
			});
			const createdPayment: AxiosResponse<ReadSubmittedPaymentEntry> =
				await this.frappeSubmit({ doc: retrPayment });

			return createdPayment.data.message;
		} catch (e: any) {
			const errorMessage = extractFrappeErrorMessage(e);

			throw new HillFreshError({
				message: "Payment not added successfully " + errorMessage,
			});
		}
	}

	async retrievePaymentEntry({ name }: { name: string }) {
		try {
			const res: AxiosResponse<{ data: ReadPaymentEntryData }> =
				await this.bankingInstance.get(`${this.docType}/${name}`);
			return res.data.data;
		} catch (error: any) {
			const errorMessage = extractFrappeErrorMessage(error);

			throw new HillFreshError({
				message: "Failed to retrieve the Payment Entry " + errorMessage,
			});
		}
	}

	// async retrieveNamingSeries() {
	// 	try {
	// 		const naming_series: AxiosResponse<{
	// 			data: { naming_series: string };
	// 		}> = await this.bankingInstance.get(this.docType, {
	// 			params: {
	// 				fields: JSON.stringify(["naming_series"]),
	// 				limit: 1,
	// 			},
	// 		});
	// 		console.log("Naming Series", naming_series);
	// 		return { naming_series: naming_series.data.data[0].naming_series };
	// 	} catch (e: any) {
	// 		throw new HillFreshError({
	// 			message: "Payment Entry Naming series not found",
	// 		});
	// 	}
	// }

	async retrieveCompanyBankAccounts({ company }: { company: string }) {
		try {
			const bankAccounts: AxiosResponse<ReadBankAccounts> =
				await this.bankingInstance.get(this.docType, {
					params: {
						fields: JSON.stringify(bankAccountFields),
						filters: JSON.stringify([["company", "=", `${company}`]]),
					},
				});
			return bankAccounts.data.data;
		} catch (e: any) {
			const errorMessage = extractFrappeErrorMessage(e);

			throw new HillFreshError({
				message: "Could not retrieve Bank Accounts " + errorMessage,
			});
		}
	}
}
