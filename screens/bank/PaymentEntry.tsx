import {
	HillFreshFieldForm,
	HillFreshPickerFormField,
	useSession,
	useSnackbar,
} from "@/components";
import { appColors, JournalAccounts, ReadPOSProfile } from "@/constants";
import { useNamingSeries } from "@/hooks/naming_series";
import { JournalEntry } from "@/services";
import { Banking } from "@/services/banking";
import { useProfileStore } from "@/store/profile";
import { hideKeyboard } from "@/utils/keyboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useRetrieveBankAccounts } from "./hooks";
import { create_banking_entry, CreateBankingRecord } from "./schema";

export function PaymentEntry() {
	const bank = new Banking({ docType: "Journal Entry" });
	const naming_series = useNamingSeries({ classObject: bank });
	const { profile } = useProfileStore();
	const { bankAccounts, isLoading: retrieving } = useRetrieveBankAccounts();
	const { session } = useSession();

	if (retrieving) {
		return (
			<View
				style={{ padding: 4, backgroundColor: appColors.colors.onSecondary }}>
				<ActivityIndicator
					animating={true}
					size={"small"}
				/>
			</View>
		);
	}

	if (bankAccounts.length < 1) {
		return (
			<View>
				<Text
					style={styles.headerText}
					variant='titleMedium'>
					No Registered Banks were found
				</Text>
			</View>
		);
	}

	return (
		<PaymentEntryForm
			naming_series={naming_series}
			bankAccounts={bankAccounts}
			profile={profile!}
			bank={bank}
		/>
	);
}

function PaymentEntryForm({
	profile,
	bankAccounts,
	bank,
	naming_series,
}: {
	naming_series: string;
	profile: ReadPOSProfile;
	bankAccounts: {
		label: string;
		value: string;
	}[];
	bank: Banking;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const journalEntry = new JournalEntry({ docType: "Journal Entry" });

	const router = useRouter();
	const { show } = useSnackbar();
	const { allAccounts } = useMemo(() => {
		let allAccounts: JournalAccounts[] = [];
		if (profile && bankAccounts.length > 0)
			allAccounts = [
				{
					account: profile!.bank_account!, //Bank Account is similar to a Cash Account.
					cost_center: profile!.cost_center,
					project: profile!.project,
					debit_in_account_currency: 0,
					credit_in_account_currency: 0,
				},
				{
					account: bankAccounts[0].value,
					cost_center: profile!.cost_center,
					project: profile!.project,
					credit_in_account_currency: 0,
					debit_in_account_currency: 0,
				},
			];

		return { allAccounts };
	}, [profile]);

	const defaultValues: CreateBankingRecord = {
		naming_series: naming_series,
		cheque_date: format(new Date(), "yyyy-MM-dd"),
		cheque_no: "",
		voucher_type: "Bank Entry",
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
		reset,
		getValues,
		setValue,
		watch,
		handleSubmit,
	} = useForm<CreateBankingRecord>({
		resolver: zodResolver(create_banking_entry),
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

	const handleBankTransfer = async (data: CreateBankingRecord) => {
		//
		hideKeyboard();
		const accounts = data.accounts;
		const accountToDebit = {
			account: accounts[1].account,
			cost_center: profile!.cost_center,
			project: profile!.project,
			debit_in_account_currency: accounts[0].debit_in_account_currency,
		};
		const accountToCredit = {
			account: accounts[0].account,
			cost_center: profile!.cost_center,
			project: profile!.project,
			credit_in_account_currency: accounts[1].credit_in_account_currency,
		};
		const transformedData = {
			...data,
			accounts: [accountToDebit, accountToCredit],
		};

		//
		setIsLoading(true);
		const payment = await journalEntry.createAndSubmitJournalEntry({
			data: transformedData,
			failureEv: "Banking Failed :- ",
		});
		if (payment!.name) {
			show({ message: "Payment Banked Successfully" });
			reset();
			router.replace("/(protected)/(tabs)");
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	};

	return (
		<>
			<View>
				<Text
					style={styles.headerText}
					variant='titleMedium'>
					Banking Cash Payments for {profile ? profile.customer : "unknown"}
				</Text>
			</View>
			<>
				<View style={styles.selectorStyling}>
					<Text variant='labelLarge'>Pick the bank to deposit cash to</Text>
					<HillFreshPickerFormField
						control={control}
						error={errors.accounts && errors.accounts[1]?.account}
						items={bankAccounts}
						name={`accounts.${1}.account`}
					/>
				</View>
				<View>
					<HillFreshFieldForm
						control={control}
						error={errors.cheque_no}
						name={`cheque_no`}
						dense
						labelText='Bank Slip Number'
					/>
				</View>
				<View>
					<HillFreshFieldForm
						control={control}
						error={errors.amount}
						name={`amount`}
						dense
						labelText='Amount to bank'
					/>
				</View>
				<Button
					loading={isLoading}
					disabled={isLoading}
					onPress={handleSubmit(handleBankTransfer)}
					mode='contained'>
					Submit
				</Button>
			</>
		</>
	);
}

const styles = StyleSheet.create({
	selectorStyling: {
		padding: 8,
		display: "flex",
		flexDirection: "column",
		rowGap: "4",
		backgroundColor: appColors.colors.surfaceVariant,
	},
	chip: {
		width: "auto",
		position: "absolute",
		right: 10,
		bottom: 10,
		borderRadius: 30,
		fontWeight: "bold",
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
