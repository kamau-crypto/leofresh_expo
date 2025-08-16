import { useSnackbar } from "@/components";
import {
	appColors,
	CreateMaterialRequest,
	MaterialRequestItem,
} from "@/constants";
import { useNamingSeries } from "@/hooks/naming_series";
import { useMaterialReqCartStore } from "@/store/cart";
import { MaterialRequest } from "@/use-cases/material.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { EditMaterialRequestQuantityModal } from "./EditMaterialRequestQuantity";
import { createMaterialRequestSchema } from "./materialSchema";

export function CreateMaterialOrderItems({
	cartItems,
}: {
	cartItems: CreateMaterialRequest;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const { removeItem, removeItems } = useMaterialReqCartStore();
	const [editingItem, setEditingItem] = useState<MaterialRequestItem | null>(
		null
	);
	const { show } = useSnackbar();
	const materialRequest = new MaterialRequest({ docType: "Material Request" });

	const naming_series = useNamingSeries({ classObject: materialRequest });

	// Initialize form with calculated amounts
	const allItems = useMemo(() => {
		const items = cartItems.items.map(item => {
			// const newTotal = item * item.qty;
			return { ...item };
		});
		return { ...cartItems, items: items, naming_series };
	}, [cartItems]);

	const methods = useForm<CreateMaterialRequest>({
		defaultValues: allItems,
		resolver: zodResolver(createMaterialRequestSchema),
		mode: "onChange",
	});

	// Show the edit modal for an item
	const handleEditItem = (item: MaterialRequestItem) => {
		setEditingItem(item);
	};

	// Close the edit modal
	const handleCloseEditModal = () => {
		setEditingItem(null);
	};

	const handleDeleteItem = (item: MaterialRequestItem) => {
		removeItem(item);

		const currentItems = methods.getValues("items");
		const updatedItems = currentItems.filter(
			i => i.item_name !== item.item_name
		);
		methods.setValue("items", updatedItems);

		show({ message: `${item.item_name} removed from cart` });
	};

	const handleMakePurchaseOrder = async (data: CreateMaterialRequest) => {
		setIsLoading(true);

		const items = data.items.map(
			({
				item_name,
				qty,
				uom,
				item_code,
				from_warehouse,
				schedule_date,
				warehouse,
			}) => ({
				item_name,
				item_code,
				qty,
				uom,
				schedule_date,
				from_warehouse,
				warehouse,
			})
		);

		const order: CreateMaterialRequest = {
			...data,
			items: items,
		};

		try {
			const res = await materialRequest.createMaterialRequest({ data: order });

			if (res.name) {
				show({ message: "Order created successfully" });
				setTimeout(() => {
					removeItems();
					router.push("/purchases");
				}, 2000);
			} else {
				show({ message: "Failed to create the order" });
			}
		} catch (error) {
			show({ message: "An error occurred while creating the order" });
		} finally {
			setIsLoading(false);
		}
	};

	const {
		handleSubmit,
		watch,
		formState: { errors },
	} = methods;

	// Watch the items to display updated values
	const watchedItems = watch("items");

	// Disable the Place Order button if there are no items
	const hasItems = watchedItems && watchedItems.length > 0;

	return (
		<View
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				paddingHorizontal: 8,
				width: "100%",
				justifyContent: "center",
				gap: 5,
				backgroundColor: appColors.colors.onPrimary,
			}}>
			<FormProvider {...methods}>
				{watchedItems?.map((item, index) => (
					<View
						key={item.item_name}
						style={{
							display: "flex",
							flexDirection: "row",
							padding: 5,
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
							backgroundColor: appColors.colors.onSecondary,
						}}>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								columnGap: 10,
								marginLeft: 30,
							}}>
							<Text
								variant='titleMedium'
								style={{ fontWeight: "bold", maxWidth: "50%" }}>
								{item.item_name}
							</Text>
							<Text variant='titleMedium'>X </Text>
							<Text
								variant='titleMedium'
								style={{ fontWeight: "bold" }}>
								{`${item.qty} ${item.uom}`}
								{item.qty > 1 ? "s" : null}
							</Text>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								padding: 5,
								justifyContent: "flex-end",
							}}>
							<IconButton
								size={30}
								icon={"pencil-circle"}
								onPress={() => handleEditItem(item)}
							/>
							<IconButton
								size={30}
								icon={"delete"}
								iconColor={appColors.colors.error}
								onPress={() => handleDeleteItem(item)}
							/>
						</View>
					</View>
				))}
				{editingItem && (
					<EditMaterialRequestQuantityModal
						isVisible={!!editingItem}
						item={editingItem}
						onClose={handleCloseEditModal}
					/>
				)}
			</FormProvider>
			{watchedItems?.length === 0 && (
				<View style={{ padding: 20, alignItems: "center" }}>
					<Text variant='titleMedium'>Your cart is empty</Text>
				</View>
			)}
			<Button
				loading={isLoading}
				mode='contained'
				disabled={!hasItems}
				onPress={handleSubmit(handleMakePurchaseOrder)}>
				{hasItems ? "Place Order" : "No Items to Order"}
			</Button>
		</View>
	);
}
