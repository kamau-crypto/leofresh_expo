import { ReadBankAccount } from "@/constants";
import { Banking } from "@/services/banking";
import { useProfileStore } from "@/store/profile";
import { useEffect, useMemo, useState } from "react";

//Retrieve the last payment invoice and make it as a reference when banking a payment
// export function useRetrieveSalesInvoice() {
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [resultInvoice, setResultInvoice] = useState<ResultInvoice[]>([]);
// 	const { limit } = useResultStore();
// 	const { profile } = useProfileStore();
// 	const salesInvoice = new SalesInvoice({
// 		docType: "Sales Invoice",
// 	});

// 	const [fetchTrigger, setFetchTrigger] = useState(0);

// 	const refetch = useCallback(() => {
// 		setIsLoading(true);
// 		setFetchTrigger(prevTrigger => prevTrigger + 1);
// 	}, [fetchTrigger]);

// 	useEffect(() => {
// 		if (profile && limit) {
// 			setIsLoading(true);
// 			const retrieveSalesInvoice = async () => {
// 				const salesInv = await salesInvoice.retrieveSalesInvoices({
// 					project: profile.project,
// 					page_length: limit,
// 				});
// 				setIsLoading(false);
// 				setResultInvoice(salesInv);
// 			};
// 			retrieveSalesInvoice();
// 		}
// 	}, [profile, limit]);

// 	const invoice = useMemo(() => {
// 		if (resultInvoice.length > 0) {
// 			return resultInvoice[0];
// 		} else {
// 			return null;
// 		}
// 	}, [resultInvoice]);

// 	return { invoice, isLoading, refetch };
// }

export function useRetrieveBankAccounts() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [bankAccount, setBankAccount] = useState<ReadBankAccount[]>([]);
	const { profile } = useProfileStore();
	const banking = new Banking({ docType: "Bank Account" });
	useEffect(() => {
		if (profile) {
			setIsLoading(true);
			const retrieveCompanyBankAccnts = async () => {
				const accnts = await banking.retrieveCompanyBankAccounts({
					company: profile.company,
				});
				setBankAccount(accnts);
				setIsLoading(false);
			};
			retrieveCompanyBankAccnts();
		}
	}, [profile]);

	const bankAccounts = useMemo(() => {
		let accounts: { label: string; value: string }[] = [];
		if (bankAccount.length > 0) {
			const listAccounts = bankAccount.map(bk => ({
				label: bk.account_name,
				value: bk.account,
			}));
			accounts = listAccounts;
		}
		return accounts;
	}, [bankAccount]);

	return { bankAccounts, isLoading };
}
