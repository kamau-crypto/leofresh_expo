import { HillFreshFieldForm, HillFreshPickerFormField } from "@/components";
import { CreateStockMovementEntry } from "@/constants";
import { useNamingSeries } from "@/hooks/naming_series";
import { StockTransfer } from "@/services/stock.transfer";
import { useProductsToSellStore } from "@/store/products";
import { useProfileStore } from "@/store/profile";
import { useWarehousesStore } from "@/store/warehouse";
import { hideKeyboard } from "@/utils/keyboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { z, ZodType } from "zod";

interface CustomCreateStockMovementEntry extends CreateStockMovementEntry {
	target: string;
}

const stock_movement_schema: ZodType<CustomCreateStockMovementEntry> = z.object(
	{
		naming_series: z.string(),
		target: z.string({ required_error: "The target warehouse is required" }),
		stock_entry_type: z.string(),
		items: z.array(
			z.object({
				item_name: z.string(),
				item_code: z.string(),
				s_warehouse: z.string(),
				t_warehouse: z.string(),
				qty: z.coerce
					.number({ description: "Item Quantity is required" })
					.min(0),
				uom: z.string(),
				conversion_factor: z.number(),
				basic_rate: z.number(),
			})
		),
	}
);

export function Movement() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { warehouses } = useWarehousesStore();
	const bottom = useBottomTabBarHeight();
	const { profile } = useProfileStore();
	const { items } = useProductsToSellStore();
	const stkMovement = new StockTransfer({ docType: "Stock Entry" });
	const naming_series = useNamingSeries({ classObject: stkMovement });

	const { toWhs, fromWhs, allItems } = useMemo(() => {
		if (warehouses && items) {
			const mvmntWarehouses = warehouses.map(wh => ({
				label: wh.name,
				value: wh.name,
			}));
			//remove the current's shop warehouse
			const toWhs = mvmntWarehouses.filter(
				fwh => !profile!.warehouse_name.includes(fwh.value)
			);

			const fromWhs = [
				{ label: profile!.warehouse_name, value: profile!.warehouse_name },
			];

			const itemToTransfer = items!.map(item => ({
				item_name: item.item_name,
				item_code: item.item_code,
				s_warehouse: profile!.warehouse_name,
				t_warehouse: "",
				qty: 0,
				uom: item.standard_selling_uom ?? "Nos",
				conversion_factor: 0,
				basic_rate: 0,
			}));

			return { toWhs, fromWhs, allItems: itemToTransfer };
		} else {
			return { toWhs: [], fromWhs: [], allItems: [] };
		}
	}, [warehouses]);

	const defaultValues: CustomCreateStockMovementEntry = {
		target: toWhs[0]!.value,
		items: allItems,
		naming_series: naming_series,
		stock_entry_type: "Material Transfer",
	};
	const {
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
		reset,
		watch,
		control,
	} = useForm<CustomCreateStockMovementEntry>({
		defaultValues,
		resolver: zodResolver(stock_movement_schema),
	});

	const watchTargetWarehouse = watch("target");

	useEffect(() => {
		const handleItemsWarehouse = () => {
			const targetWarehouse = getValues("target");
			const findItems = getValues("items");

			const items = findItems.map(v => ({
				...v,
				t_warehouse: targetWarehouse,
			}));
			setValue("items", items);
		};

		handleItemsWarehouse();
	}, [watchTargetWarehouse]);

	const handleStockMovement = async (data: CreateStockMovementEntry) => {
		setIsLoading(true);
		hideKeyboard();
		const movableStocks = {
			...data,
			items: data.items.filter(data => data.qty > 0),
		};

		const response = await stkMovement.transferStock({ data: movableStocks });
		if (response.name) {
			reset();
			ToastAndroid.show("Stock movement successful", 100);
			setIsLoading(false);
		} else {
			setIsLoading(false);
			reset();
		}
	};
	return (
		<ScrollView style={styles.container}>
			<View style={styles.inputMiddle}>
				<Text> Source Warehouse</Text>
				<Text variant='labelMedium'>The Origin of the items</Text>
				<HillFreshPickerFormField
					control={control}
					error={errors.items && errors.items[0]?.s_warehouse}
					items={fromWhs}
					name={`items.${0}.s_warehouse`}
				/>
			</View>
			<View style={styles.inputMiddle}>
				<Text> Target Warehouse </Text>
				<Text variant='labelMedium'>Where the items are moving to</Text>
				<HillFreshPickerFormField
					control={control}
					error={errors.target}
					items={toWhs}
					name='target'
				/>
			</View>
			<View style={styles.inputMiddle}>
				<Text> Items</Text>
				<Text variant='labelMedium'>
					Adjust the quantities of items move. Items with a quantity of 0 (zero)
					are not moved.
				</Text>
				{allItems.map((item, i) => (
					<View
						style={styles.items}
						key={item.item_code + i}>
						<Text variant='bodyMedium'>{item.item_name}</Text>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								gap: 5,
								alignItems: "center",
							}}>
							<HillFreshFieldForm
								control={control}
								error={errors.items && errors.items[i]?.qty}
								defaultValue={item.qty}
								name={`items.${i}.qty`}
							/>
							<Text variant='bodySmall'>{item.uom}</Text>
						</View>
					</View>
				))}
			</View>
			<View style={{ paddingBottom: bottom / 2 }}>
				<Button
					loading={isLoading}
					mode='contained'
					onPress={handleSubmit(handleStockMovement)}>
					Move Stock
				</Button>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		rowGap: 10,
		padding: 10,
	},
	items: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	inputMiddle: {
		padding: 8,
		display: "flex",
		flexDirection: "column",
		rowGap: "4",
		borderRadius: 15,
	},
});
