import {
	HillFreshPickerFormField,
	useHillFreshTheme,
	useSnackbar,
} from "@/components";
import { appColors, commonStyles, Weather } from "@/constants";

import { formatToLocalCurrency } from "@/utils/format";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";
import { Icon, IconButton, Text, TextInput } from "react-native-paper";
import { BottledWaterWithImage, CreateSalesInvoice } from "./schema";

export function BottledWater({
	sellableItems,
}: {
	sellableItems: BottledWaterWithImage[];
}) {
	const [disableNegativeValues, setDisableNegativeValues] =
		useState<boolean>(false);
	const [disablePositiveValues, setDisablePositiveValues] =
		useState<boolean>(false);
	const { theme } = useHillFreshTheme();
	const {
		watch,
		setValue,
		getValues,
		control,
		formState: { errors, defaultValues },
	} = useFormContext<CreateSalesInvoice>();
	const { show } = useSnackbar();
	//Watch the cash, mpesa, and items. To trigger a grand total recalculation.
	// const watchItems = watch("items");
	const watchItems = useWatch({ control, name: "items" });

	//use effect to recalculate the total(grand_total) of the bottled items.
	useEffect(() => {
		const handleItemsTotal = () => {
			const allItems = getValues("items");
			const total = allItems.reduce((curr, acc) => acc.amount + curr, 0);
			setValue("total_bottled", total);
		};
		handleItemsTotal();
	}, [watchItems]);

	// Handle increasing an item's quantity
	const handleItemIncrease = (item: BottledWaterWithImage) => {
		const currentItems = getValues("items") || [];
		let updatedItems = [...currentItems];
		let newGrandTotal = getValues("total_bottled");

		const existingItemIndex = currentItems.findIndex(
			i => i.item_name === item.item_name
		);

		if (existingItemIndex >= 0) {
			const newQty = updatedItems[existingItemIndex].qty + 1;
			const rate = updatedItems[existingItemIndex].rate;
			const oldTotal = updatedItems[existingItemIndex].amount;
			const newTotal = newQty * rate;

			newGrandTotal = newGrandTotal - oldTotal + newTotal;

			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				qty: newQty,
				amount: newTotal,
			};
		} else {
			const itemRate = item.rate || 0;
			const newTotal = itemRate * 1;

			newGrandTotal += newTotal;

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
		setValue("total_bottled", newGrandTotal);
	};

	const handleItemQtyChange = (item: BottledWaterWithImage, e: string) => {
		//Get all items
		const currentItems = getValues("items") || [];
		// retrieve the quantity passed as a parameter
		const newQty = Number(e) || 0;
		//
		//Initialize the grand total since we will change this
		let newGrandTotal = getValues("total_bottled");
		//check if the item exists within the array.
		const existingItemIndex = currentItems.findIndex(
			i => i.item_name === item.item_name
		);
		//
		//if the item is not found, show the error
		if (existingItemIndex === -1) {
			setDisableNegativeValues(false);
			show({
				message: `Item ${item.item_name} quantity is less than 0`,
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

			newGrandTotal = newGrandTotal - oldTotal + newTotal;

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
			newGrandTotal = newGrandTotal - oldTotal + newTotal;
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
		setValue("total_bottled", newGrandTotal);
	};
	const handleItemDecrease = (item: BottledWaterWithImage) => {
		const currentItems = getValues("items") || [];
		let newGrandTotal = getValues("total_bottled");

		const existingItemIndex = currentItems.findIndex(
			i => i.item_name === item.item_name
		);

		if (existingItemIndex === -1) {
			show({
				message: `Item ${item.item_name} quantity is less than 0`,
				action: {},
			});
			setDisableNegativeValues(true);
			return;
		}

		const currentQty = currentItems[existingItemIndex].qty;
		const rate = currentItems[existingItemIndex].rate;
		const oldTotal = currentItems[existingItemIndex].amount;

		if (currentQty <= 0) {
			//Here I was removing all items from the list of items instead of removing
			const foundItem = currentItems[existingItemIndex];
			//Change the quantity to 0, and then trigger the Disabled State on the item decrease button
			currentItems[existingItemIndex] = { ...foundItem, qty: currentQty };

			newGrandTotal -= oldTotal;

			setValue("items", currentItems);
		} else {
			const updatedItems = [...currentItems];
			const newQty = currentQty - 1;
			const newTotal = newQty * rate;

			newGrandTotal = newGrandTotal - oldTotal + newTotal;

			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				qty: newQty,
				amount: newTotal,
			};

			setValue("items", updatedItems);
		}

		setValue("total_bottled", newGrandTotal);
	};
	const handleItemRateChange = (
		item: BottledWaterWithImage,
		rateStr: string
	) => {
		const rate = parseFloat(rateStr) || 0;
		const currentItems = getValues("items") || [];
		let newGrandTotal = getValues("grand_total");

		// Find if the item already exists in the form
		const existingItemIndex = currentItems.findIndex(
			i => i.item_name === item.item_name
		);

		if (existingItemIndex >= 0) {
			// Update existing item
			const updatedItems = [...currentItems];
			const qty = updatedItems[existingItemIndex].qty;
			const oldTotal = updatedItems[existingItemIndex].amount;
			const newTotal = rate * qty;

			// Update the grand total
			newGrandTotal = newGrandTotal - oldTotal + newTotal;

			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				rate: rate,
				amount: newTotal,
			};

			setValue("items", updatedItems);
		} else if (rate > 0) {
			// Add new item if it has a rate
			const newTotal = rate * 1;
			newGrandTotal += newTotal;

			setValue("items", [
				...currentItems,
				{ ...item, rate: rate, qty: 1, amount: newTotal },
			]);
		}

		// Update the grand total directly
		setValue("grand_total", newGrandTotal);
	};

	// const handleBottledWaterSales = async (data: WaterSalesInvoice) => {
	// 	const validData = {
	// 		...data,
	// 		items: data.items.filter(a => a.qty > 0),
	// 	};
	// 	// console.log("data to submit", validData);
	// 	const { name } = await salesInvoice.createSalesInvoice({ inv: validData });

	// 	if (name) {
	// 		setIsSubmitting(false);
	// 		show({
	// 			message:
	// 				"Sales Invoice for Bottled water created. Add another for Bulk water.",
	// 		});
	// 	}
	// };
	// Get the current quantity for an item
	const getItemQuantity = (itemCode: string) => {
		const currentItems = getValues("items") || [];
		const existingItem = currentItems.find(i => i.item_name === itemCode);
		return existingItem ? existingItem.qty.toString() : "0";
	};

	// Get the current rate for an item
	const getItemRate = (itemCode: string) => {
		const currentItems = getValues("items") || [];
		const existingItem = currentItems.find(i => i.item_name === itemCode);
		return existingItem ? existingItem.rate.toString() : "0";
	};

	const weatherItems = Object.values(Weather).map(w => ({
		label: w,
		value: w,
	}));

	return (
		<View style={styles.allItems}>
			<View style={{ backgroundColor: appColors.colors.onSecondary }}>
				<Text variant='bodyMedium'> Weather</Text>
				<HillFreshPickerFormField
					items={weatherItems}
					defaultValue={Weather.HOT}
					control={control}
					name='weather'
					error={errors.weather}
				/>
			</View>
			<View style={{ ...styles.total, ...commonStyles.border }}>
				<Text variant='titleMedium'> Bottled Water</Text>
			</View>
			{sellableItems &&
				sellableItems.map((item, i) => (
					<View
						style={{ ...styles.item, paddingHorizontal: 6 }}
						key={item.item_name}>
						<View style={{ width: "27%" }}>
							<Image
								source={{ uri: item.image ?? "", width: 50, height: 50 }}
								style={{ objectFit: "contain", borderRadius: 10 }}
							/>
							{item.item_tax_template && item.tax_rate && (
								<View style={styles.badge}>
									<Icon
										source='percent'
										size={12}
										color={theme.colors.onSurfaceVariant}
									/>
								</View>
							)}
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text variant='titleSmall'>{item.item_name}</Text>
							</View>
						</View>
						<View style={styles.itemButtons}>
							<IconButton
								disabled={disablePositiveValues}
								icon='plus'
								onPress={() => handleItemIncrease(item)}
								containerColor={theme.colors.secondaryContainer}
							/>
							<TextInput
								dense={true}
								mode='outlined'
								onChangeText={e => handleItemQtyChange(item, e)}
								style={{ width: "30%" }}
								theme={{ roundness: 20, mode: "exact" }}
								value={getItemQuantity(item.item_name).toString()}
								keyboardType='numeric'
							/>
							<IconButton
								disabled={disableNegativeValues}
								onPress={() => handleItemDecrease(item)}
								icon='minus'
								containerColor={theme.colors.secondaryContainer}
							/>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								columnGap: 10,
								alignContent: "center",
							}}>
							<TextInput
								dense={true}
								mode='outlined'
								onChangeText={e => handleItemRateChange(item, e)}
								// style={{ width: "20%" }}
								theme={{ roundness: 20, mode: "exact" }}
								value={getItemRate(item.item_name)}
								keyboardType='numeric'
							/>
						</View>
					</View>
				))}
			<View style={{ ...styles.figures }}>
				<Text
					style={styles.total}
					variant='titleLarge'>
					Bottled Water Total :{" "}
					{formatToLocalCurrency(getValues("total_bottled"))}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	allItems: {
		display: "flex",
		flexDirection: "column",
		rowGap: 5,
	},
	item: {
		display: "flex",
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
		alignContent: "space-around",
		borderRadius: 10,
		padding: 4,
		backgroundColor: appColors.colors.onSecondary,
	},
	figures: {
		flex: 1,
		width: "100%",
		height: "40%",
		display: "flex",
		flexDirection: "column",
		rowGap: 5,
		elevation: 10,
	},
	itemButtons: {
		width: "50%",
		display: "flex",
		flexDirection: "row",
		columnGap: 10,
		alignContent: "center",
	},
	total: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: appColors.colors.onPrimary,
		padding: 10,
		borderRadius: 10,
		paddingTop: 10,
		textAlign: "center",
		fontWeight: "bold",
	},
	badge: {
		position: "absolute",
		margin: 2,
		zIndex: 1,
		top: 2,
		right: 50,
		borderRadius: 50,
	},
});
