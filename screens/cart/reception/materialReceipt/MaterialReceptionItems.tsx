import { HillFreshFieldForm, useSnackbar } from "@/components";
import {
	appColors,
	CreateStockMovementEntry,
	CreateStockMovementEntryItem,
	ReadSingleMaterialRequestData,
} from "@/constants";
import { StockTransfer } from "@/services/stock.transfer";
import { useProfileStore } from "@/store/profile";
import { useMaterialReceptionStore } from "@/store/receptionstore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addDays } from "date-fns";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CreatePurchaseInvoice } from "../schema";
import { createStockMovementEntry } from "./schema";

export function MaterialReceptionItems({
	items,
}: {
	items: ReadSingleMaterialRequestData;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [stockTransferItems, setStockTransferItems] =
		useState<ReadSingleMaterialRequestData>(items);
	const { profile } = useProfileStore();
	const stockTransfer = new StockTransfer({ docType: "Stock Entry" });
	const bottom = useBottomTabBarHeight();

	const { itemsToView } = useMemo(() => {
		const itemsToView: CreateStockMovementEntryItem[] =
			stockTransferItems.items.map(
				({
					qty,
					uom,
					name,
					item_code,
					received_qty,
					from_warehouse,
					conversion_factor,
					rate,
					warehouse,
				}) => ({
					qty: qty - received_qty,
					uom,
					item_name: name,
					item_code,
					s_warehouse: from_warehouse,
					t_warehouse: warehouse,
					basic_rate: rate,
					conversion_factor,
				})
			);

		return { itemsToView };
	}, [items]);

	const defaultValues: CreateStockMovementEntry = {
		delivery_note: "",
		driver_name: "",
		material_request: items.name,
		items: itemsToView,
		reg_no: "",
		stock_entry_type: "Material Transfer",
	};

	const methods = useForm<CreateStockMovementEntry>({
		defaultValues,
		resolver: zodResolver(createStockMovementEntry),
	});
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = methods;
	const { show } = useSnackbar();
	const router = useRouter();
	const { clearReceptionCart } = useMaterialReceptionStore();

	const handleCreatePurchaseInvoice = async (
		data: CreateStockMovementEntry
	) => {
		setIsLoading(true);
		const deliveredItems = data.items.filter(d => d.qty > 0);

		const stockItems = deliveredItems.map(item => ({
			...item,
			material_request: items.name,
			from_warehouse: item.s_warehouse,
			to_warehouse: item.t_warehouse,
			material_request_item: item.item_name,
		}));

		const receivedStockItems = {
			...data,
			items: stockItems,
			from_warehouse: profile!.source_warehouse,
			to_warehouse: profile!.warehouse_name,
		};
		//Create a Purchase Receipt
		const stockTranfer = await stockTransfer.transferStock({
			data: receivedStockItems,
		});

		if (stockTranfer.name || items.per_received === 100) {
			setIsLoading(false);
			clearReceptionCart();
			router.replace("/(tabs)/purchases");
			show({ message: "Stock Updated Successfully" });
		} else {
			clearReceptionCart();
			setIsLoading(false);
			show({ message: "Stock Updated Successfully" });
			router.replace("/(tabs)/purchases");
		}
		return;
	};

	return (
		<ScrollView style={styles.container}>
			<FormProvider {...methods}>
				<KeyboardAvoidingView>
					<DeliveryDatePicker />
					<View style={styles.list}>
						<HillFreshFieldForm<CreateStockMovementEntry>
							labelText='Delivery Note'
							style={styles.input}
							name='delivery_note'
							control={control}
							error={errors.delivery_note}
							defaultValue={defaultValues.delivery_note}
							dense={true}
						/>
						<HillFreshFieldForm<CreateStockMovementEntry>
							style={styles.input}
							labelText='Driver Name'
							name='driver_name'
							control={control}
							error={errors.driver_name}
							dense={true}
						/>
						<HillFreshFieldForm<CreateStockMovementEntry>
							labelText='Vehicle Number Plate'
							style={styles.input}
							name='reg_no'
							control={control}
							error={errors.reg_no}
							dense={true}
						/>
					</View>
					<View style={styles.listItems}>
						{items.items.map(({ image, item_name, qty, rate, uom }, i) => (
							<View
								key={item_name}
								style={styles.item}>
								<View style={{ display: "flex", flexDirection: "column" }}>
									<Text variant='titleLarge'>{item_name}</Text>
									<Text variant='bodyMedium'>{uom}</Text>
								</View>
								<HillFreshFieldForm<CreateStockMovementEntry>
									labelText='Quantity'
									name={`items.${i}.qty`}
									disabled={qty === 0 ? true : false}
									control={control}
									error={errors.items && errors.items[i]?.qty}
									keyBoardType='numeric'
									dense={true}
									defaultValue={qty}
								/>
							</View>
						))}
					</View>
					<Button
						loading={isLoading}
						disabled={isLoading}
						style={{ padding: 4, marginTop: 10, marginBottom: bottom }}
						mode='contained'
						onPress={handleSubmit(handleCreatePurchaseInvoice)}>
						Submit
					</Button>
				</KeyboardAvoidingView>
			</FormProvider>
		</ScrollView>
	);
}

function DeliveryDatePicker() {
	const {
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<CreatePurchaseInvoice>();
	const updateDate = (date: Date | undefined) => {
		//update the formik value with the proper values...
		setValue("delivery_date", date ?? new Date());
	};
	return (
		<SafeAreaProvider>
			<View
				style={{
					padding: 4,
					backgroundColor: appColors.colors.onPrimary,
					gap: 8,
				}}>
				<Text variant='titleMedium'>Delivery Date</Text>
				<DatePickerInput
					locale='en'
					label={"Delivery Date"}
					value={new Date()}
					onChange={d => updateDate(d)}
					inputMode='start'
					style={{ width: 200 }}
					validRange={{
						startDate: new Date(),
						endDate: addDays(new Date(), 5),
					}}
					mode='outlined'
				/>
				{errors.delivery_date && (
					<Text style={{ color: "red" }}>{errors.delivery_date.message}</Text>
				)}
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 4,
		display: "flex",
		flexDirection: "column",
		width: "100%",
		height: "auto",
		gap: 5,
		paddingHorizontal: 10,
	},
	list: {
		display: "flex",
		flexDirection: "column",
		width: "auto",
		minWidth: 200,
		gap: 3,
		alignItems: "stretch",
	},
	item: {
		display: "flex",
		flexDirection: "row",
		paddingHorizontal: 10,
		justifyContent: "space-between",
		alignItems: "center",
	},
	input: {
		width: "auto",
	},
	text: {
		fontWeight: "bold",
	},
	listItems: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
		gap: 5,
		borderRadius: 5,
		backgroundColor: appColors.colors.onPrimary,
	},
});
