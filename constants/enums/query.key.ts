export const queryKeys = {
	tank: {
		all: ["tanks"] as const,
		tankReading: ["tank-reading"] as const,
		tankDetails: ["tank-details"] as const,
	},
	expenses: {
		all: ["expenses"] as const,
		expense: ["expense"] as const,
		createExpense: ["create-expense"] as const,
		retrieveExpenseAccounts: ["retrieve-expense-accounts"] as const,
	},
};
