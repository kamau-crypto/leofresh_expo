import { HillFreshPickerFormField, useSnackbar } from "@/components";
import { appColors, ItemGroup, PurchaseOrderDetails } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNamingSeries } from "@/hooks/naming_series";
import { useGetSuppliers } from "@/hooks/supplier";
import { usePurchaseCartStore } from "@/store/cart";
import { useProductsToPurchaseStore } from "@/store/products";
import { useProfileStore } from "@/store/profile";
import { PurchaseOrder } from "@/use-cases";
import { appConfig } from "@/utils/config";
import { formatToLocalCurrency } from "@/utils/format";
import { addDays, format, subDays } from "date-fns";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	AddPurchaseOrder,
	createPurchaseOrder,
	PurchaseOrderItem,
} from "./schema";

export const CreatePurchaseOrder = () => {
	const { items: allItems } = useProductsToPurchaseStore();
	const { profile } = useProfileStore();
	const { show } = useSnackbar();
	const { setCart, removeItems } = usePurchaseCartStore();
	const router = useRouter();
	const purchaseOrder = new PurchaseOrder({ docType: "Purchase Order" });
	const naming_series = useNamingSeries({ classObject: purchaseOrder });

	const itemToBuy = useMemo(() => {
		let validItems: PurchaseOrderItem[] = [];
		if (allItems && allItems.length > 0) {
			const itemToBuy = allItems.filter(
				f => f.item_group === ItemGroup.Products
			);
			// const all = itemToBuy.filter(m => m.item_name !"Bulk Water");
			validItems = itemToBuy.map(
				({
					item_name,
					image,
					price_list_rate,
					standard_buying_uom,
					item_code,
					uom,
					conversion_factor,
				}) => ({
					image: `${appConfig.PUBLIC_URL}${image}`,
					item_name,
					item_code,
					qty: 0,
					price_list_rate,
					standard_buying_uom: standard_buying_uom ?? "",
					rate: +(price_list_rate! * conversion_factor).toPrecision(3),
					amount: 0,
					conversion_factor,
					uom: uom,
				})
			);
		}
		const itemsForPurchase = [...new Set(validItems)];
		return itemsForPurchase;
	}, [allItems]);

	const defaultItems: PurchaseOrderItem[] = itemToBuy!.map(
		({
			item_name,
			qty,
			amount,
			image,
			price_list_rate,
			standard_buying_uom,
			item_code,
			conversion_factor,
		}) => ({
			image,
			item_name,
			price_list_rate: 0,
			qty: qty,
			uom: "Nos",
			standard_buying_uom,
			rate: price_list_rate ?? 0,
			amount,
			item_code,
			conversion_factor,
		})
	);

	const defaultValues: AddPurchaseOrder = {
		cost_center: profile!.cost_center ?? "",
		supplier: "",
		items: defaultItems,
		schedule_date: new Date(),
		buying_price_list: "Standard Buying",
		set_warehouse: profile!.warehouse_name ?? "",
		transaction_date: new Date(),
	};

	const methods = useForm<AddPurchaseOrder>({
		defaultValues,
		resolver: zodResolver(createPurchaseOrder),
		mode: "onTouched",
		reValidateMode: "onChange",
	});

	const handlePurchaseOrder = async ({
		buying_price_list,
		cost_center,
		schedule_date,
		supplier,
		items,
		set_warehouse,
	}: AddPurchaseOrder) => {
		if (supplier.length < 1) {
			methods.setFocus("supplier");
			const msg = {
				message: "The supplier is not Supplier Not selected",
			};
			show({ ...msg });
			return methods.setError("supplier", msg);
		}
		if (Object.is(methods.formState.errors, {})) {
			show({ message: `Errors found while adding to cart` });
		}
		const itemToSave = items.map(i => ({
			...i,
			item_code: i.item_code,
			item_name: i.item_name,
			uom: i.standard_buying_uom ?? "Nos",
			conversion_factor: i.conversion_factor,
		}));
		const addToCart: PurchaseOrderDetails = {
			buying_price_list,
			company: profile!.company,
			project: profile!.project,
			cost_center,
			naming_series: naming_series,
			currency: profile!.currency,
			schedule_date: format(schedule_date, "yyyy-MM-dd"),
			supplier,
			items: itemToSave.filter(i => i.qty >= 1),
			transaction_date: format(new Date(), "yyyy-MM-dd"),
			set_warehouse,
		};
		removeItems();
		setCart({ ...addToCart });
		show({
			message: "Items added to cart successfully",
			action: {
				label: "Go to Cart",
				onPress: () => router.push("/(tabs)/cart"),
			},
		});
	};

	return (
		<ScrollView
			contentContainerStyle={{
				justifyContent: "center",
				height: "auto",
				rowGap: 5,
				padding: 8,
			}}>
			<FormProvider {...methods}>
				<HillFreshSupplierPicker />
				<DeliveryDatePicker />
				<ItemsForSale itemToBuy={itemToBuy} />
				<View style={{ paddingBottom: 20 }}>
					<Button
						style={{ padding: 4, marginTop: 10 }}
						mode='contained'
						onPress={methods.handleSubmit(handlePurchaseOrder)}>
						Submit
					</Button>
				</View>
			</FormProvider>
		</ScrollView>
	);
};

//
//Add a date picker at this step...
function DeliveryDatePicker() {
	const {
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<AddPurchaseOrder>();

	const [deliveryDate, setDeliveryDate] = useState<Date>(() =>
		getValues("schedule_date")
	);
	const updateDate = (date: Date | undefined) => {
		//update the react form value with the selected schedule date...
		const newDate = date ? date : new Date();
		setDeliveryDate(newDate);
		setValue("schedule_date", newDate);
	};
	return (
		<SafeAreaProvider>
			<View
				style={{
					justifyContent: "center",
					flex: 1,
					padding: 4,
					backgroundColor: appColors.colors.onPrimary,
					gap: 4,
				}}>
				<Text variant='titleMedium'>Delivery Date</Text>
				<DatePickerInput
					locale='en'
					label='Delivery Date'
					value={deliveryDate}
					onChange={d => updateDate(d)}
					inputMode='start'
					style={{ width: 200 }}
					validRange={{
						startDate: subDays(new Date(), 1),
						endDate: addDays(new Date(), 5),
					}}
					mode='outlined'
				/>
				{errors.schedule_date && (
					<Text style={{ color: "red" }}>{errors.schedule_date.message}</Text>
				)}
			</View>
		</SafeAreaProvider>
	);
}

function HillFreshSupplierPicker() {
	const {
		control,
		formState: { errors },
	} = useFormContext<AddPurchaseOrder>();
	const { suppliers } = useGetSuppliers();

	const DATA = useMemo(() => {
		if (suppliers.length > 1) {
			const supData = suppliers.map(supplier => ({
				label: `${supplier.supplier_name}-${supplier.supplier_type}`,
				value: supplier.supplier_name,
			}));
			return supData;
		}
		return [{ label: "No Supplier Found", value: "none" }];
	}, [suppliers]);

	return (
		<View
			style={{
				display: "flex",
				flexDirection: "column",
				padding: 4,
				backgroundColor: appColors.colors.onPrimary,
			}}>
			<Text variant='titleMedium'>Pick the Supplier</Text>
			<HillFreshPickerFormField
				items={DATA}
				control={control}
				error={errors.supplier}
				name='supplier'
			/>
		</View>
	);
}

function ItemsForSale({ itemToBuy }: { itemToBuy: PurchaseOrderItem[] }) {
	const { show } = useSnackbar();
	const {
		watch,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<AddPurchaseOrder>();

	//Watch for item changes
	const watchItems = watch("items");

	// Handle increasing an item's quantity
	const handleItemIncrease = (item: PurchaseOrderItem) => {
		const currentItems = getValues("items") || [];
		let updatedItems = [...currentItems];

		const existingItemIndex = currentItems.findIndex(
			i => i.item_name === item.item_name
		);

		if (existingItemIndex >= 0) {
			const newQty = updatedItems[existingItemIndex].qty + 1;
			const rate = updatedItems[existingItemIndex].rate;
			const oldTotal = updatedItems[existingItemIndex].amount;
			const newTotal = newQty * rate;

			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				qty: newQty,
				amount: newTotal,
			};
		} else {
			const itemRate = item.rate || 0;
			const newTotal = itemRate * 1;

			// newGrandTotal += newTotal;

			updatedItems = [
				...updatedItems,
				{
					...item,
					rate: itemRate,
					qty: 1,
					amount: newTotal,
				},
			];
		}

		setValue("items", updatedItems);
		// setValue("grand_total", newGrandTotal);

		// const mpesaAmnt = getValues("mpesa");
		// const cashAmnt = getValues("cash");
		// if (mpesaAmnt > 0 || cashAmnt > 0) {
		// 	if (mpesaAmnt + cashAmnt !== newGrandTotal) {
		// 		show({ message: "Your have Errors in your MPESA and CASH" });
		// 	}
		// }
	};

	const handleItemQtyChange = (item: PurchaseOrderItem, e: string) => {
		//Get all items
		const currentItems = getValues("items") || [];
		// retrieve the quantity passed as a parameter
		const newQty = Number(e) || 0;
		//
		//Initialize the grand total since we will change this
		// let newGrandTotal = getValues("grand_total");
		//check if the item exists within the array.
		const existingItemIndex = currentItems.findIndex(
			i => i.item_name === item.item_name
		);
		//
		//if the item is not found, show the error
		if (existingItemIndex === -1) {
			show({
				message: `Item ${item.item_name} not found in your order`,
				action: {},
			});
			return;
		}
		//get the current quantity
		const currentQty = currentItems[existingItemIndex].qty;
		//get the current rate
		const rate = currentItems[existingItemIndex].rate;
		//get the current total which I will need to update later/
		const oldTotal = currentItems[existingItemIndex].amount;
		// it the current quantity is less than the texted quantity, update the quantity with the incoming quantity.
		if (currentQty <= newQty) {
			const newTotal = newQty * rate;
			const updatedItems = [...currentItems];
			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				amount: newTotal,
				qty: newQty,
			};
			// newGrandTotal = newGrandTotal - oldTotal + newTotal;
			setValue("items", updatedItems);
		}
		//
		//If the current quantity is less than the texted quantity, update the quantity with the incoming qty.
		else {
			const updatedItems = [...currentItems];
			// const newQty = inQty;
			//Update the total by multiplying the incomig quantity with the incoming rate
			const newTotal = newQty * rate;
			//calculate the new total by reducing the previous total, and updating the new total with the new total.
			//
			// newGrandTotal = newGrandTotal - oldTotal + newTotal;
			//updated the items with the new index.
			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				qty: newQty,
				amount: newTotal,
			};
			//set the values
			setValue("items", updatedItems);
		}
		//Also update the grand total
		// setValue("grand_total", newGrandTotal);
	};
	const handleItemDecrease = (item: PurchaseOrderItem) => {
		const currentItems = getValues("items") || [];

		const existingItemIndex = currentItems.findIndex(
			i => i.item_name === item.item_name
		);

		if (existingItemIndex === -1) {
			show({
				message: `Item ${item.item_name} not found in your order`,
				action: {},
			});
			return;
		}

		const currentQty = currentItems[existingItemIndex].qty;
		const rate = currentItems[existingItemIndex].rate;

		if (currentQty <= 1) {
			const updatedItems = currentItems.filter(
				i => i.item_name !== item.item_name
			);

			setValue("items", updatedItems);
		} else {
			const updatedItems = [...currentItems];
			const newQty = currentQty - 1;
			const newTotal = newQty * rate;

			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				qty: newQty,
				amount: newTotal,
			};

			setValue("items", updatedItems);
		}
	};

	const getItemQuantity = (itemCode: string) => {
		const currentItems = getValues("items") || [];
		const existingItem = currentItems.find(i => i.item_name === itemCode);
		return existingItem ? existingItem.qty.toString() : "0";
	};

	return (
		<>
			<View style={styles.allItems}>
				{itemToBuy &&
					itemToBuy.map((item, i) => (
						<View
							style={styles.item}
							key={item.item_name + i}>
							<View style={{ display: "flex", flexDirection: "column" }}>
								<Image
									source={{ uri: item.image ?? "", width: 150, height: 150 }}
									style={{ objectFit: "contain", borderRadius: 10 }}
								/>
								<View
									style={{ gap: 5, display: "flex", flexDirection: "column" }}>
									<Text
										variant='titleMedium'
										style={{ fontWeight: "bold" }}>
										{item.item_name}
									</Text>
									<Text
										variant='labelLarge'
										style={{ fontWeight: "bold" }}>
										@ {formatToLocalCurrency(item.rate)}/
										{item.standard_buying_uom}
									</Text>
								</View>
							</View>
							<View style={styles.itemButtons}>
								<IconButton
									icon='plus'
									onPress={() => handleItemIncrease(item)}
									containerColor={appColors.colors.primaryContainer}
								/>
								<TextInput
									mode='outlined'
									dense
									onChangeText={e => handleItemQtyChange(item, e)}
									theme={{ roundness: 10, mode: "exact" }}
									style={{ width: 65 }}
									value={getItemQuantity(item.item_name).toString()}
									keyboardType='numeric'
								/>
								<IconButton
									onPress={() => handleItemDecrease(item)}
									icon='minus'
									containerColor={appColors.colors.primaryContainer}
								/>
							</View>
						</View>
					))}
			</View>
		</>
	);
}

export const styles = StyleSheet.create({
	supplier: {
		display: "flex",
		flexDirection: "column",
		columnGap: 4,
		padding: 4,
	},
	card: {
		width: "100%",
	},
	allItems: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 5,
	},
	item: {
		display: "flex",
		justifyContent: "space-between",
		flexDirection: "column",
		width: "49%",
		flexWrap: "wrap",
		alignItems: "center",
		padding: 4,
		borderRadius: 5,
		backgroundColor: appColors.colors.onSecondary,
	},
	itemButtons: {
		display: "flex",
		flexDirection: "row",
		columnGap: 5,
		alignItems: "center",
	},
});
