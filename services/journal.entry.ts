import {
	CreatedJournalEntryRecord,
	CreateJournalEntry,
	ReadCreatedJournalEntry,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class JournalEntry extends FrappeInstance {
	private docType: string;
	private journalEntryInstance: AxiosInstance;
	constructor({ docType }: { docType: string }) {
		super();
		this.docType = docType;
		this.journalEntryInstance = this.getFrappeClient();
	}
	// Intended for use when posting an expense and when banking.

	async createJournalEntry({
		failureEv,
		data,
	}: {
		failureEv: string;
		data: CreateJournalEntry;
	}) {
		try {
			const res: AxiosResponse<{ data: CreatedJournalEntryRecord }> =
				await this.journalEntryInstance.post(this.docType, {
					data,
				});
			return res.data.data;
		} catch (error) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: `${failureEv}` + msg,
			});
		}
	}

	async createAndSubmitJournalEntry({
		data,
		failureEv,
	}: {
		data: CreateJournalEntry;
		failureEv: string;
	}) {
		try {
			const doc = await this.createJournalEntry({ data, failureEv });
			const res: AxiosResponse<{ message: ReadCreatedJournalEntry }> =
				await this.frappeSubmit({ doc });
			return res.data.message;
		} catch (error) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: `${failureEv}` + msg,
			});
		}
	}
}
