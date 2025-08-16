import { HillFreshFieldForm, useSnackbar } from "@/components";
import {
	appColors,
	commonStyles,
	CreateMeterReading,
	CreatePaymentEntry,
	CreateSalesInvItem,
	CreateSalesInvoiceRecord,
	ItemGroup,
	ReadMeterReading,
	Weather,
} from "@/constants";
import { useNamingSeries } from "@/hooks/naming_series";
import { SalesInvoice } from "@/services";
import { Banking } from "@/services/banking";
import { Meter } from "@/services/meter";
import { useMeterReadingStore } from "@/store/meter";
import { useProductsToSellStore } from "@/store/products";
import { useProfileStore } from "@/store/profile";
import { useCustomerTankStore } from "@/store/tank";
import { useUserStore } from "@/store/user";
import { appConfig } from "@/utils/config";
import { formatToLocalCurrency } from "@/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { add, format } from "date-fns";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottledWater } from "./BottledWater";
import { useCalculateGrandTotal, useSalesVAT } from "./hooks";
import {
	BottledWaterWithImage,
	CreateSalesInvoice,
	createSalesInvoiceSchema,
} from "./schema";
import { WaterReadingForm } from "./WaterReadingForm";

//  In this sales invoice, I will add two modes of payments, cash and Mpesa as custom fields, When I submit my sales Invoice, the amount in Mpesa is added against a payment entry, and the amount in Cash is saved to paid as well.

export function CreateSales() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { show } = useSnackbar();
	const router = useRouter();
	const { mreading } = useMeterReadingStore();
	const { profile } = useProfileStore();
	const { items: allItems } = useProductsToSellStore();
	const salesInvoice = new SalesInvoice({ docType: "Sales Invoice" });
	const { salesInvoiceVAT, vatInclusivePriceList, removeVATFromPriceList } =
		useSalesVAT();
	const user = useUserStore();
	const waterReading = new Meter({ docType: "Meter Reading" });
	const naming_series = useNamingSeries({ classObject: salesInvoice });
	const waterReadingNamingSeries = useNamingSeries({
		classObject: waterReading,
	});
	const paymentEntry = new Banking({ docType: "Payment Entry" });
	const paymentNamingSeries = useNamingSeries({ classObject: paymentEntry });

	// const { tankReading } = useCustomerTankReadingStore();
	const { tank } = useCustomerTankStore();

	//
	//CREATE THE WATER METER READING Based on the previous water tank

	const { validItems: sellableItems, meterReading } = useMemo(() => {
		let validItems: BottledWaterWithImage[] = [];
		let meterReading: ReadMeterReading = {
			created_by: "",
			current_reading: "",
			date: new Date(),
			name: "",
			previous_reading: "0",
			quantity: "0",
			tank: "",
			variation: "0",
		};
		// let bulkWaterDetails:
		if (allItems && allItems.length > 1) {
			const itemToSell = allItems.filter(
				f => f.item_group === ItemGroup.Products
			);
			const all = itemToSell.filter(
				m =>
					!m.item_name.toLowerCase().includes("purified") &&
					!m.item_name.toLowerCase().includes("bulk")
			);
			const vatItems = vatInclusivePriceList({ items: all });

			validItems = vatItems.map(
				({
					item_name,
					image,
					price_list_rate,
					standard_selling_uom,
					item_code,
					item_tax_template,
					tax_rate,
					tax_type,
				}) => ({
					image: `${appConfig.PUBLIC_URL}${image}`,
					item_name,
					item_code,
					qty: 0,
					rate: price_list_rate ?? 0,
					amount: 0,
					income_account: profile!.income_account,
					expense_account: profile!.expense_account,
					uom: standard_selling_uom ?? "Nos",
					warehouse: profile!.warehouse_name,
					item_tax_template,
					tax_rate,
					tax_type,
				})
			);
		}
		if (mreading) {
			meterReading = mreading;
		}
		return { validItems, meterReading };
	}, [allItems, mreading]);

	const defaults: CreateSalesInvoice = {
		company: profile!.company,
		cost_center: profile!.cost_center,
		total_bottled: 0,
		naming_series,
		grand_total: 0,
		update_stock: 1,
		party_account_currency: profile!.currency,
		debit_to: profile!.debtor_account,
		selling_price_list: profile!.selling_price_list,
		currency: profile!.currency,
		customer: profile!.customer,
		due_date: format(add(new Date(), { days: 1 }), "yyyy-MM-dd"),
		posting_date: format(new Date(), "yyyy-MM-dd"),
		project: profile!.project,
		weather: Weather.HOT,
		bulk_water: {
			billable_water: 0,
			rate: 5,
			total_bulk: 0,
			water_used: 0,
			current_water_reading: 0,
			previous_water_reading: +meterReading.current_reading,
			waste: profile!.waste_water,
		},
		items: sellableItems,
		mpesa: 0,
		cash: 0,
	};
	const methods = useForm<CreateSalesInvoice>({
		resolver: zodResolver(createSalesInvoiceSchema),
		defaultValues: defaults,
		mode: "onChange",
	});

	const {
		handleSubmit,
		formState: { errors },
		clearErrors,
		control,
		getValues,
		setValue,
		watch,
		setError,
	} = methods;
	useCalculateGrandTotal({ watch, getValues, setValue, setError, clearErrors });

	const handleCreateSalesInvoice = async (data: CreateSalesInvoice) => {
		setIsLoading(true);
		const validData = {
			...data,
			update_stock: true,
			set_warehouse: profile!.warehouse_name,
			items: data.items.filter(a => a.qty > 0),
		};

		const bulkWaterItem: CreateSalesInvItem = {
			amount: validData.bulk_water.total_bulk,
			income_account: profile!.income_account,
			expense_account: profile!.expense_account,
			warehouse: profile!.warehouse_name,
			item_code: allItems!.find(
				t =>
					t.item_code.toLowerCase().includes("bulk") ||
					t.item_code.toLowerCase().includes("purified")
			)!.item_code,
			item_name: allItems!.find(
				t =>
					t.item_name.toLowerCase().includes("bulk") ||
					t.item_name.toLowerCase().includes("purified")
			)!.item_name,
			qty: Math.round(validData.bulk_water.billable_water),
			rate: validData.bulk_water.rate,
			cost_center: profile!.cost_center,
			project: profile!.project,
			uom: allItems!.find(
				t =>
					t.item_name.toLowerCase().includes("bulk") ||
					t.item_name.toLowerCase().includes("purified")
			)!.standard_selling_uom!,
			item_tax_template: null,
			tax_rate: null,
			tax_type: null,
		};
		const incomeExpAccnts: CreateSalesInvItem[] = validData.items.map(e => ({
			item_code: e.item_code,
			item_name: e.item_name,
			qty: e.qty,
			rate: e.rate,
			uom: e.uom,
			amount: e.amount,
			income_account: profile!.income_account,
			expense_account: profile!.expense_account,
			warehouse: profile!.warehouse_name,
			cost_center: profile!.cost_center,
			project: profile!.project,
			item_tax_template: e.item_tax_template,
			tax_rate: e.tax_rate,
			tax_type: e.tax_type,
		}));
		const allSoldItems: CreateSalesInvItem[] = [
			...incomeExpAccnts,
			bulkWaterItem,
		].filter(item => item.qty > 0);
		const datatoCreateInvoice = { ...validData, items: allSoldItems };
		//
		//Add the water reading for this wmeter
		const waterReadingData: CreateMeterReading = {
			cash: 0,
			mpesa: 0,
			created_by: user!.user!.email.includes("admin")
				? user!.user!.full_name
				: user!.user!.email,
			current_reading: validData.bulk_water.current_water_reading,
			naming_series: waterReadingNamingSeries,
			previous_reading: validData.bulk_water.previous_water_reading,
			quantity: validData.bulk_water.water_used,
			status: "Enabled",
			tank: tank![0].tank,
			variation: 0,
			waste: validData.bulk_water.waste,
		};
		//
		if (waterReadingData.quantity > 0) {
			await waterReading.addMeterReadings({
				data: waterReadingData,
			});
		}
		const taxItems = salesInvoiceVAT({ items: allSoldItems });

		const itemsWithVATInPriceList: CreateSalesInvoiceRecord = {
			...datatoCreateInvoice,
			posting_date: data.posting_date,
			set_posting_time: 1,
			due_date: data.posting_date,
			unrealized_profit_loss_account: profile!.unrealized_profit,
			mpesa_amount: validData.mpesa,
			cash_amount: validData.cash,
			taxes: taxItems,
		};
		const itemsLessVATInPriceList = removeVATFromPriceList({
			data: itemsWithVATInPriceList,
		});
		console.log("Data To Create Sales Inv", itemsLessVATInPriceList);

		const sales = await salesInvoice.createSalesInvoice({
			inv: itemsLessVATInPriceList,
		});
		const submittedInv = await salesInvoice.submitSalesInvoice({
			order: sales,
		});
		const { message } = submittedInv;

		//Hold the Mpesa || Cash Payment names
		let paidViaMpesa: string = "";
		let paidViaCash: string = "";
		//Add a payment entry for MPESA sales
		if (validData.mpesa > 1) {
			const mpesaPaymentEntry: CreatePaymentEntry = {
				reference_date: format(new Date(), "yyyy-MM-dd"),
				reference_no: message.name,
				company: validData.company,
				cost_center: validData.cost_center,
				currency: profile!.currency,
				mode_of_payment: "Mpesa",
				naming_series: paymentNamingSeries,
				paid_amount: validData.mpesa,
				paid_to: profile!.lnmo!,
				paid_from: profile!.debtor_account,
				party_name: validData.customer,
				party: validData.customer,
				party_type: "Customer",
				payment_type: "Receive",
				posting_date: data.posting_date,
				project: validData.project,
				received_amount: validData.mpesa,
				target_exchange_rate: 1.0,
				remarks: `Sales Invoice ${sales.name} Mpesa Sales.`,
				references: [
					{
						allocated_amount: validData.mpesa,
						outstanding_amount: 0,
						reference_doctype: "Sales Invoice",
						reference_name: message.name,
						total_amount: validData.grand_total,
					},
				],
			};

			const { name: mpesaPayment } = await paymentEntry.makePaymentEntry({
				data: mpesaPaymentEntry,
			});
			paidViaMpesa = mpesaPayment;
		}
		//Add a payment entry for CASH Sales if there is some amount set to have been paid via bank
		if (validData.cash) {
			const cashPaymentEntry: CreatePaymentEntry = {
				reference_date: format(new Date(), "yyyy-MM-dd"),
				reference_no: message.name,
				company: validData.company,
				cost_center: validData.cost_center,
				currency: profile!.currency,
				mode_of_payment: "Cash",
				naming_series: paymentNamingSeries,
				paid_amount: validData.cash,
				paid_to: profile!.bank_account!,
				paid_from: profile!.debtor_account,
				party_name: validData.customer,
				party: validData.customer,
				party_type: "Customer",
				payment_type: "Receive",
				posting_date: data.posting_date,
				project: validData.project,
				received_amount: validData.cash,
				target_exchange_rate: 1.0,
				remarks: `Sales Invoice ${sales.name} Cash Sales.`,
				references: [
					{
						allocated_amount: validData.cash,
						outstanding_amount: 0,
						reference_doctype: "Sales Invoice",
						reference_name: message.name,
						total_amount: validData.grand_total,
					},
				],
			};
			const { name: cashPayment } = await paymentEntry.makePaymentEntry({
				data: cashPaymentEntry,
			});
			paidViaCash = cashPayment;
		}

		if (paidViaMpesa.length > 1 || paidViaCash.length > 1) {
			setIsLoading(false);
			show({
				message: "Sales Invoice Created",
			});
			router.replace("/(tabs)/sales");
		} else {
			setIsLoading(false);
		}
	};

	return (
		<ScrollView
			contentContainerStyle={{ ...commonStyles.scrollContainer, padding: 8 }}>
			<FormProvider {...methods}>
				<PostingDatePicker />
				<BottledWater sellableItems={sellableItems} />
				<View
					style={{
						...styles.total,
						...commonStyles.border,
					}}>
					<Text variant='titleMedium'> Bulk Water</Text>
				</View>
				<WaterReadingForm />
				<HillFreshFieldForm
					keyBoardType='number-pad'
					dense
					labelText='Mpesa'
					control={control}
					name='mpesa'
					valueAsNumber
					error={errors.mpesa}
				/>
				<HillFreshFieldForm
					dense
					labelText='Cash'
					control={control}
					name='cash'
					valueAsNumber
					error={errors.cash}
					keyBoardType='number-pad'
				/>
				<Text
					style={{
						...styles.total,
						borderWidth: 2,
						borderColor: appColors.colors.primary,
					}}
					variant='titleLarge'>
					Total Sales :{" "}
					{formatToLocalCurrency(Math.round(getValues("grand_total")))}
				</Text>
			</FormProvider>
			<View style={commonStyles.submitButtonContainer}>
				<Button
					style={{ padding: 4, marginTop: 10 }}
					disabled={isLoading}
					loading={isLoading}
					mode='contained'
					onPress={handleSubmit(handleCreateSalesInvoice)}>
					Submit Sales
				</Button>
			</View>
		</ScrollView>
	);
}

function PostingDatePicker() {
	const {
		setValue,
		getValues,
		control,
		formState: { errors },
	} = useFormContext<CreatePaymentEntry>();
	const [date, setDate] = useState<Date>(new Date(getValues("posting_date")));
	const updateDate = (date: Date | undefined) => {
		const dates = date ?? new Date();
		setDate(dates);
		setValue("posting_date", format(dates, "yyyy-MM-dd"));
	};

	return (
		<SafeAreaProvider>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
					backgroundColor: appColors.colors.onPrimary,
				}}>
				<Text variant='titleMedium'>Sales Invoice Date</Text>
				<DatePickerInput
					withDateFormatInLabel={true}
					clearButtonMode='unless-editing'
					disableFullscreenUI={true}
					textAlign='center'
					locale='en'
					label='Sales Invoice Date'
					value={date}
					onChange={updateDate}
					inputMode='start'
					style={{ maxWidth: "100%" }}
					mode='outlined'
				/>
				{errors.posting_date && (
					<Text style={{ color: "red" }}>{errors.posting_date.message}</Text>
				)}
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	figures: {
		flex: 1,
		width: "100%",
		height: "40%",
		display: "flex",
		flexDirection: "column",
		rowGap: 5,
		elevation: 10,
	},
	total: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: appColors.colors.onPrimary,
		padding: 10,
		borderRadius: 10,
		textAlign: "center",
		fontWeight: "bold",
	},
});
