import {
	HillFreshFieldForm,
	HillFreshPickerFormField,
	useSnackbar,
} from "@/components";
import { appColors, commonStyles, JournalAccounts } from "@/constants";
import { useRetrieveExpenseAccounts } from "@/hooks/expense";
import { useNamingSeries } from "@/hooks/naming_series";
import { JournalEntry } from "@/services";
import { useProfileStore } from "@/store/profile";
import { hideKeyboard } from "@/utils/keyboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { create_journal_entry, CreateJournalEntryRecord } from "./schema";

export function ExpensesForm() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [date, setDate] = useState<Date>(new Date());
	const { profile } = useProfileStore();
	const router = useRouter();
	const {
		expenses,
		refetch,
		isLoading: fetchExpenses,
	} = useRetrieveExpenseAccounts();
	const expense = new JournalEntry({ docType: "Journal Entry" });
	const naming_series = useNamingSeries({ classObject: expense });
	const { show } = useSnackbar();

	const { allAccounts, allExpenseAccnts } = useMemo(() => {
		let allAccounts: JournalAccounts[] = [];
		if (profile && expenses && expenses.length > 1)
			allAccounts = [
				{
					account: profile!.bank_account!,
					cost_center: profile!.cost_center,
					project: profile!.project,
					debit_in_account_currency: 0,
					credit_in_account_currency: 0,
				},
				{
					account: expenses[0].name,
					cost_center: profile!.cost_center,
					project: profile!.project,
					credit_in_account_currency: 0,
					debit_in_account_currency: 0,
				},
			];

		const allExpenseAccnts = expenses!.map(e => ({
			label: e.name,
			value: e.name,
		}));
		return { allAccounts, allExpenseAccnts };
	}, [profile, expenses]);

	const defaultValues: CreateJournalEntryRecord = {
		naming_series: naming_series,
		voucher_type: "Journal Entry",
		posting_date: format(new Date(), "yyyy-MM-dd"),
		company: profile!.company,
		accounts: allAccounts,
		user_remark: "",
		multi_currency: 0,
		receipt_no: "",
		amount: 0,
	};

	const {
		control,
		formState: { errors },
		setValue,
		handleSubmit,
		reset,
		getValues,
		watch,
	} = useForm<CreateJournalEntryRecord>({
		resolver: zodResolver(create_journal_entry),
		defaultValues,
	});
	const watchAmount = watch("amount");

	useEffect(() => {
		const watchValueChanges = () => {
			const value = getValues("amount");
			setValue(`accounts.${0}.debit_in_account_currency`, +value);
			setValue(`accounts.${1}.credit_in_account_currency`, +value);
		};

		watchValueChanges();
	}, [watchAmount]);

	const handleAddExpense = async (data: CreateJournalEntryRecord) => {
		hideKeyboard();
		const dataAccounts = data.accounts;
		const accountToDebit = {
			account: dataAccounts[1].account,
			cost_center: profile!.cost_center,
			project: profile!.project,
			debit_in_account_currency: dataAccounts[0].debit_in_account_currency,
		};
		const accountToCredit = {
			account: dataAccounts[0].account,
			cost_center: profile!.cost_center,
			project: profile!.project,
			credit_in_account_currency: dataAccounts[1].credit_in_account_currency,
		};

		const transformedData = {
			...data,
			accounts: [accountToDebit, accountToCredit],
		};

		setIsLoading(true);
		const createdExp = await expense.createAndSubmitJournalEntry({
			data: transformedData,
			failureEv: "Creating an Expense Failed ",
		});

		if (createdExp.name) {
			show({ message: "Sucessfully added the expense" });
			reset();
			router.replace("/(protected)/(tabs)/expenses");
			setIsLoading(false);
		} else {
			show({
				message: "Could not create the expense",
				action: { label: "Error" },
			});
			setIsLoading(false);
		}
	};

	const updateDate = (date: Date | undefined) => {
		const dates = date ?? new Date();
		setDate(dates);
		setValue("posting_date", format(dates, "yyyy-MM-dd"));
	};

	if (fetchExpenses) {
		return (
			<ActivityIndicator
				size={"large"}
				animating={true}
			/>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={commonStyles.scrollContainer}
			keyboardShouldPersistTaps='handled'>
			<View>
				<Text style={styles.headerText}>
					Declaring Expenses for {profile!.customer}
				</Text>
			</View>
			<View style={styles.selectorStyling}>
				<Text>Pay From</Text>
				<HillFreshFieldForm
					name={`accounts.${0}.account`}
					disabled={true}
					control={control}
					defaultValue={allAccounts[0].account}
					error={errors.accounts && errors.accounts[0]?.account}
				/>
				{/* <TextInput
					disabled={true}
					value={allAccounts[0].account}
				/> */}
			</View>
			<View style={styles.selectorStyling}>
				<SafeAreaProvider>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							flex: 1,
							backgroundColor: appColors.colors.onPrimary,
						}}>
						<Text variant='titleMedium'>Expense Date</Text>
						<DatePickerInput
							withDateFormatInLabel={true}
							clearButtonMode='unless-editing'
							disableFullscreenUI={true}
							textAlign='center'
							locale='en'
							label='Expense Date'
							value={date}
							onChange={updateDate}
							inputMode='start'
							style={{ maxWidth: "100%" }}
							mode='outlined'
						/>
						{errors.posting_date && (
							<Text style={{ color: "red" }}>
								{errors.posting_date.message}
							</Text>
						)}
					</View>
				</SafeAreaProvider>
			</View>
			<View style={styles.selectorStyling}>
				<Text>Select the Expense Account</Text>
				<HillFreshPickerFormField
					control={control}
					items={allExpenseAccnts}
					name={`accounts.${1}.account`}
					error={errors.accounts && errors.accounts[1]?.account}
				/>
			</View>
			<View style={styles.selectorStyling}>
				<Text>Description</Text>
				<HillFreshFieldForm
					name='user_remark'
					multiline
					control={control}
					error={errors.user_remark}
				/>
			</View>
			<View style={styles.selectorStyling}>
				<Text>Receipt No</Text>
				<HillFreshFieldForm
					name='receipt_no'
					control={control}
					error={errors.receipt_no}
				/>
			</View>
			<View style={styles.selectorStyling}>
				<HillFreshFieldForm
					name={`amount`}
					control={control}
					error={errors.amount}
					labelText='Amount to pay'
					left='cash'
				/>
			</View>
			<View style={commonStyles.submitButtonContainer}>
				<Button
					loading={isLoading}
					disabled={isLoading}
					onPress={handleSubmit(handleAddExpense)}
					mode='contained'>
					Submit Expense
				</Button>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		height: "100%",
		flexDirection: "column",
		rowGap: 10,
	},
	selectorStyling: {
		padding: 8,
		display: "flex",
		flexDirection: "column",
		rowGap: "4",
		borderRadius: 15,
	},
	headerText: {
		padding: 6,
		textAlign: "center",
	},
	errorText: {
		color: "red",
	},

	amountText: {
		padding: 10,
		textAlign: "center",
		fontWeight: "bold",
		backgroundColor: appColors.colors.onPrimary,
	},
});
