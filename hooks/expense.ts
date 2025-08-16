import { ReadExpenseAccounts } from "@/constants";
import { useProfileStore } from "@/store/profile";
import { useResultStore } from "@/store/result";
import { Expense } from "@/use-cases/expense";
import { useCallback, useEffect, useState } from "react";

export function useRetrieveExpenseAccounts() {
	const [expenses, setExpenses] = useState<ReadExpenseAccounts[]>([]);
	const { profile } = useProfileStore();
	const { limit } = useResultStore();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	// const { limit } = useResultStore();
	const exaccounts = new Expense({
		docType: "Account",
	});

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsLoading(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		const retrieveWarehouses = async () => {
			const expaccnts = await exaccounts.retrieveExpenseAccounts({
				page_length: limit * 2,
			});
			setIsLoading(false);
			setExpenses(expaccnts);
		};
		retrieveWarehouses();
	}, [profile, fetchTrigger]);

	return { refetch, expenses, isLoading };
}
