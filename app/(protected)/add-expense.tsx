import { HillFreshKeyBoardView } from "@/components";
import { appColors } from "@/constants";
import { ExpensesForm } from "@/screens/expenses/form/ExpensesForm";

import React from "react";

export default function AddExpense() {
	return (
		<HillFreshKeyBoardView
			style={{ backgroundColor: appColors.colors.background }}>
			<ExpensesForm />
		</HillFreshKeyBoardView>
	);
}
