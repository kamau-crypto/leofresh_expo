import { useHillFreshTheme, useSession } from "@/components";
import { NotFound } from "@/components/illustrations";
import { appColors, RetrievedJournalEntryData } from "@/constants";
import { Expense } from "@/services/expense";
import { useProfileStore } from "@/store/profile";
import { useResultStore } from "@/store/result";
import { formatToLocalCurrency } from "@/utils/format";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	FlatList,
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Card, FAB, Text } from "react-native-paper";

export function ExpensesPage() {
	return (
		<View style={styles.container}>
			<ExpensesFlatList />
			<CreateExpenseFab />
		</View>
	);
}

function CreateExpenseFab() {
	const router = useRouter();

	return (
		<TouchableOpacity>
			<FAB
				onPress={() => router.push("/add-expense")}
				icon={"plus"}
				variant='primary'
				color={appColors.colors.onPrimary}
				style={{
					...styles.fab,
					backgroundColor: appColors.colors.primary,
				}}
			/>
		</TouchableOpacity>
	);
}

function ExpensesFlatList() {
	const [allExpense, setAllExpenses] = useState<RetrievedJournalEntryData[]>(
		[]
	);

	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsRefreshing(true);
		setFetchTrigger(prevTriggeer => prevTriggeer + 1);
	}, []);
	const { profile } = useProfileStore();
	const { session } = useSession();
	const { limit } = useResultStore();

	const expenses = new Expense({ docType: "Journal Entry" });

	useEffect(() => {
		if (profile) {
			const fetchExpenses = async () => {
				const exp = await expenses.retrieveExpenses({
					cost_center: profile!.cost_center,
					limit: limit!,
				});
				setIsRefreshing(false);
				setAllExpenses(exp);
			};
			fetchExpenses();
		}
	}, [fetchTrigger, profile]);

	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [])
	);

	const DATA = useMemo(() => {
		if (allExpense.length > 1) {
			const filteredExpenses = allExpense.filter(
				expense => expense.cost_center === profile!.cost_center
			);
			return Array.from(new Set(filteredExpenses));
		}
		return Array.from(new Set(allExpense));
	}, [allExpense]);

	return (
		<FlatList
			style={{ height: "100%", width: "100%" }}
			refreshControl={
				<RefreshControl
					refreshing={isRefreshing}
					onRefresh={() => setFetchTrigger(prevTrigger => prevTrigger + 1)}
				/>
			}
			ListHeaderComponent={() => (
				<Text
					style={{
						textAlign: "center",
						padding: 10,
					}}
					variant='titleMedium'>
					Expenses for {profile!.customer}
				</Text>
			)}
			ListEmptyComponent={() => (
				<View style={{ flex: 1, height: "100%" }}>
					<View
						style={{
							...styles.container,
							justifyContent: "center",
							alignItems: "center",
							paddingTop: "50%",
						}}>
						<NotFound />
						<Text
							variant='titleMedium'
							style={{
								padding: 8,
							}}>
							No Expenses found for {profile!.customer}
						</Text>
						<Text>Click the + below to create on</Text>
					</View>
				</View>
			)}
			data={DATA}
			renderItem={({ item }) => <ExpenseItem item={item} />}
		/>
	);
}

function ExpenseItem({ item }: { item: RetrievedJournalEntryData }) {
	const { theme } = useHillFreshTheme();

	return (
		<View
			style={{
				width: "100%",
				padding: 10,
			}}>
			<Card style={{ backgroundColor: theme.colors.tertiaryContainer }}>
				<Card.Title title={!item.remark ? `Expense` : `${item.remark}`} />
				<Card.Content>
					<Text style={{ fontWeight: "bold" }}>
						{!item.account.match(/,\s*(.+)/)
							? item.account
								? item.account
								: ""
							: item.account.match(/,\s*(.+)/)![1]}
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							flexWrap: "wrap",
						}}>
						<Text style={{ fontWeight: "bold" }}>{item.posting_date}</Text>
						<Text style={{ fontWeight: "bold" }}>{item.name}</Text>
						<Text style={{ fontWeight: "bold" }}>
							{formatToLocalCurrency(item.total_debit)}
						</Text>
					</View>
				</Card.Content>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
	},
	fab: {
		position: "absolute",
		borderRadius: 50,
		margin: 20,
		right: 0,
		bottom: 0,
	},
});
