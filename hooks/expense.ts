import { queryKeys, ReadExpenseAccounts } from "@/constants";
import { Expense } from "@/services/expense";
import { useProfileStore } from "@/store/profile";
import { useResultStore } from "@/store/result";
import { useUserStore } from "@/store/user";
import { HillFreshError } from "@/utils/customError";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useRetrieveExpenseAccounts() {
	const [expenses, setExpenses] = useState<ReadExpenseAccounts[]>([]);
	const { profile } = useProfileStore();
	const { limit } = useResultStore();
	const { user } = useUserStore();
	// const [isLoading, setIsLoading] = useState<boolean>(true);
	// // const { limit } = useResultStore();

	// const [fetchTrigger, setFetchTrigger] = useState(0);
	// const refetch = useCallback(() => {
	// 	setIsLoading(true);
	// 	setFetchTrigger(prevTrigger => prevTrigger + 1);
	// }, []);

	// useEffect(() => {
	// 	const retrieveWarehouses = async () => {
	// 		const expaccnts = await exaccounts.retrieveExpenseAccounts({
	// 			page_length: limit * 2,
	// 		});
	// 		setIsLoading(false);
	// 		setExpenses(expaccnts);
	// 	};
	// 	retrieveWarehouses();
	// }, [profile, fetchTrigger]);

	const { isLoading, data, error, refetch } = useQuery({
		queryKey: [...queryKeys.expenses.all, user && user.email],
		queryFn: async () => {
			const exaccounts = new Expense({
				docType: "Account",
			});
			return await exaccounts.retrieveExpenseAccounts({
				page_length: limit * 2,
			});
		},
	});

	if (error) {
		throw new HillFreshError({
			message: "Error Getting Expenses",
			action: { label: "close" },
		});
	}

	return { refetch, expenses: data, isLoading };
}
