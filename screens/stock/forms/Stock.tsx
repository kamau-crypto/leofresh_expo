import { HillFreshFieldForm } from "@/components";
import {
	appColors,
	CreateStockReconciliation,
	StockReconciliationItem,
} from "@/constants";
import { useNamingSeries } from "@/hooks/naming_series";
import { StockReconciliation } from "@/services/stock.reconciliation";
import { useProductsToSellStore } from "@/store/products";
import { useProfileStore } from "@/store/profile";
import { useUserStore } from "@/store/user";
import { HillFreshError } from "@/utils/customError";
import { hideKeyboard } from "@/utils/keyboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	ToastAndroid,
	View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { z, ZodType } from "zod";

enum StockReconciliationPurpose {
	"Opening Stock" = "Opening Stock",
	"Stock Reconciliation" = "Stock Reconciliation",
}

//
// Define the schema and the default values...
const stock_items_schema: ZodType<CreateStockReconciliation> = z.object({
	naming_series: z.string(),
	purpose: z.string(),
	set_warehouse: z.string(),
	cost_center: z.string(),
	company: z.string(),
	posting_date: z.date(),
	posting_time: z.string(),
	items: z
		.array(
			z.object({
				item_code: z.string(),
				item_name: z.string(),
				warehouse: z.string(),
				qty: z.coerce.number({ required_error: "Quantity is required" }).min(0),
				valuation_rate: z.number(),
			})
		)
		.transform(items => {
			const hasValidQuantity = items.some(item => item.qty > 0);
			if (!hasValidQuantity) {
				throw new HillFreshError({
					message: "Atleast one Stock Item must have a quantity greater than 1",
				});
			}
			return items;
		}),
});

export function Stock() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);
	const [date, setDate] = useState<Date>(new Date());

	const { profile } = useProfileStore();
	const { user } = useUserStore();

	const bottom = useBottomTabBarHeight();

	const stockReconciliation = new StockReconciliation({
		docType: "Stock Reconciliation",
	});
	const { items } = useProductsToSellStore();

	const stockItems = useMemo(() => {
		let structItems: StockReconciliationItem[] = [];
		if (items) {
			structItems = items.map(i => ({
				item_name: i.item_name,
				item_code: i.item_code,
				qty: 0,
				valuation_rate: i.price_list_rate ?? 0,
				warehouse: profile!.warehouse_name,
			}));
		}
		if (user!.roles) {
			const canEdit = user!.roles.some(user => user.role === "Stock Manager");
			setIsDisabled(!canEdit);
		}
		return structItems;
	}, [items]);

	const naming_series = useNamingSeries({ classObject: stockReconciliation });

	const defaultValues: CreateStockReconciliation = {
		purpose: StockReconciliationPurpose["Stock Reconciliation"],
		company: profile!.company,
		cost_center: profile!.cost_center,
		naming_series,
		posting_date: new Date(),
		posting_time: format(new Date(), "HH:mm:ss"),
		set_warehouse: profile!.warehouse_name,
		items: stockItems,
	};
	const {
		control,
		formState: { errors },
		reset,
		handleSubmit,
		setValue,
	} = useForm<CreateStockReconciliation>({
		resolver: zodResolver(stock_items_schema),
		defaultValues,
	});

	const updateDate = (date: Date | undefined) => {
		const dates = date ?? new Date();
		setDate(dates);
		setValue("posting_date", dates);
	};
	const handleSubmitStockItems = async (data: CreateStockReconciliation) => {
		setIsLoading(true);
		hideKeyboard();

		const stockItems = data.items.filter(item => item.qty > 1);
		const stockData = { ...data, items: stockItems };
		const submit = await stockReconciliation.submit_stock_reconciliation({
			data: stockData,
		});
		if (submit.name) {
			reset();
			ToastAndroid.show("Stock Updated Successfully", 100);
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	};
	return (
		<ScrollView style={styles.container}>
			<View style={styles.inputSeparated}>
				<SafeAreaProvider>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							flex: 1,
							backgroundColor: appColors.colors.onPrimary,
						}}>
						<Text variant='titleMedium'>Stock Take Date</Text>
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
							<Text style={{ color: "red" }}>
								{errors.posting_date.message}
							</Text>
						)}
					</View>
				</SafeAreaProvider>
			</View>
			<>
				{stockItems.map((stkItem, i) => (
					<KeyboardAvoidingView
						style={styles.inputSeparated}
						key={stkItem.item_code + i}>
						<Text>{stkItem.item_name}</Text>
						<HillFreshFieldForm
							control={control}
							dense={true}
							error={errors.items && errors.items[i]?.qty}
							name={`items.${i}.qty`}
						/>
					</KeyboardAvoidingView>
				))}
			</>

			<View style={{ paddingBottom: bottom / 2 }}>
				<Button
					loading={isLoading}
					disabled={isDisabled}
					onPress={handleSubmit(handleSubmitStockItems)}
					mode='contained'>
					Submit
				</Button>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		padding: 4,
		rowGap: 4,
	},
	inputSeparated: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 2,
		paddingHorizontal: 15,
		alignItems: "center",
		borderRadius: 15,
	},
});
