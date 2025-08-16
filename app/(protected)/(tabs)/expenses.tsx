import { HillFreshKeyBoardView } from "@/components";
import { ExpensesPage } from "@/screens/expenses/list/ExpensesPage";
import React from "react";

export default function Expenses() {
	return (
		<HillFreshKeyBoardView>
			<ExpensesPage />
		</HillFreshKeyBoardView>
	);
}