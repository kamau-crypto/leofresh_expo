import { useSnackbar } from "@/components";
import { appColors, CreateMaterialRequest, ItemGroup } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNamingSeries } from "@/hooks/naming_series";
import { MaterialRequest } from "@/services/material.request";
import { useMaterialReqCartStore } from "@/store/cart";
import { useProductsToPurchaseStore } from "@/store/products";
import { useProfileStore } from "@/store/profile";
import { appConfig } from "@/utils/config";
import { formatToLocalCurrency } from "@/utils/format";
import { addDays, format, subDays } from "date-fns";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	createMaterialRequest,
	CustomCreateMaterialRequest,
	MaterialRequestItemWithImage,
} from "./schema";

export function RequestMaterials() {
	const { items: allItems } = useProductsToPurchaseStore();
	const { profile } = useProfileStore();
	const { show } = useSnackbar();
	const { setCart, removeItems } = useMaterialReqCartStore();
	const router = useRouter();
	const materialReq = new MaterialRequest({ docType: "Material Request" });
	const naming_series = useNamingSeries({ classObject: materialReq });

	const itemToReq = useMemo(() => {
		let validItems: MaterialRequestItemWithImage[] = [];
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
					from_warehouse: profile!.source_warehouse,
					warehouse: profile!.warehouse_name,
					image: `${appConfig.PUBLIC_URL}${image}`,
					company: profile!.company,
					item_name,
					item_code,
					qty: 0,
					amount: 0,
					standard_buying_uom: standard_buying_uom ?? "",
					schedule_date: format(new Date(), "yyyy-MM-dd"),
					rate: +(price_list_rate! * conversion_factor).toPrecision(3),
					uom: uom,
				})
			);
		}
		const itemsForPurchase = [...new Set(validItems)];
		return itemsForPurchase;
	}, [allItems]);

	const defaultItems: MaterialRequestItemWithImage[] = itemToReq!.map(
		({
			item_name,
			qty,
			image,
			from_warehouse,
			rate,
			schedule_date,
			uom,
			warehouse,
			amount,
			item_code,
		}) => ({
			image,
			item_name,
			price_list_rate: 0,
			qty: qty,
			uom: uom,
			rate: rate,
			from_warehouse,
			schedule_date,
			warehouse,
			amount,
			item_code,
		})
	);

	const defaultValues: CustomCreateMaterialRequest = {
		company: profile!.company,
		material_request_type: "Material Transfer",
		schedule_date: new Date(),
		items: defaultItems,
		set_from_warehouse: profile!.source_warehouse,
		purpose: `Material Transfer from ${profile!.source_warehouse} to ${
			profile!.warehouse_name
		}`,
		set_warehouse: profile!.warehouse_name ?? "",
	};

	const methods = useForm<CustomCreateMaterialRequest>({
		defaultValues,
		resolver: zodResolver(createMaterialRequest),
		mode: "onTouched",
	});
	const handleMaterialRequest = async ({
		schedule_date,
		items,
		set_warehouse,
		material_request_type,
		purpose,
		set_from_warehouse,
		company,
	}: CustomCreateMaterialRequest) => {
		if (Object.is(methods.formState.errors, {})) {
			show({ message: `Errors found while adding to cart` });
		}
		const itemToSave = items.map(i => ({
			...i,
			item_code: i.item_code,
			item_name: i.item_name,
			uom: i.uom,
			from_warehouse: i.from_warehouse,
			qty: i.qty,
			schedule_date: i.schedule_date,
			warehouse: i.warehouse,
		}));
		//
		//Compile the materials to create the material Request.

		const addToCart: CreateMaterialRequest = {
			company,
			material_request_type,
			purpose,
			set_from_warehouse,
			schedule_date,
			items: itemToSave.filter(i => i.qty >= 1),
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
				<DeliveryDatePicker />
				<ItemsForSale itemToBuy={itemToReq} />
				<Button
					style={{ padding: 4, marginTop: 10 }}
					mode='contained'
					onPress={methods.handleSubmit(handleMaterialRequest)}>
					Submit
				</Button>
			</FormProvider>
		</ScrollView>
	);
}

//
//Add a date picker at this step...
function DeliveryDatePicker() {
	const {
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<CustomCreateMaterialRequest>();
	const updateDate = (date: Date | undefined) => {
		//update the react form value with the proper values...
		setValue("schedule_date", date ?? new Date());
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
					value={getValues("schedule_date")}
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

function ItemsForSale({
	itemToBuy,
}: {
	itemToBuy: MaterialRequestItemWithImage[];
}) {
	const { show } = useSnackbar();
	const {
		watch,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<CustomCreateMaterialRequest>();

	//Watch for item changes
	const watchItems = watch("items");

	// Handle increasing an item's quantity
	const handleItemIncrease = (item: MaterialRequestItemWithImage) => {
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

	const handleItemQtyChange = (
		item: MaterialRequestItemWithImage,
		e: string
	) => {
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
	const handleItemDecrease = (item: MaterialRequestItemWithImage) => {
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
										@ {formatToLocalCurrency(item.rate)}/{item.uom}
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
