import { useSnackbar } from "@/components";
import {
	appColors,
	CreatePurchaseOrderItem,
	PurchaseOrderDetails,
} from "@/constants";
import { useNamingSeries } from "@/hooks/naming_series";
import { MaterialRequest, PurchaseOrder } from "@/services";
import { usePurchaseCartStore } from "@/store/cart";
import { useProfileStore } from "@/store/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { CartItem } from "./CartItem";
import { EditQuantityModal } from "./EditQuantity";
import { createInternalProcurement, createPurchaseOrder } from "./hooks";
import { createPurchaseOrderDetails } from "./schema";

export const CreatePurchaseOrderViaCart = React.memo(
	({ cartItems }: { cartItems: PurchaseOrderDetails }) => {
		const [isLoading, setIsLoading] = useState<boolean>(false);
		const [itemsInCart, setItemsInCart] = useState<CreatePurchaseOrderItem[]>(
			[]
		);
		const router = useRouter();
		const { profile } = useProfileStore();
		const { removeItem, removeItems } = usePurchaseCartStore();
		const [isUpdating, setIsUpdating] = useState<boolean>(false);
		const [editingItem, setEditingItem] =
			useState<CreatePurchaseOrderItem | null>(null);
		const { show } = useSnackbar();
		const purchaseOrder = new PurchaseOrder({ docType: "Purchase Order" });
		const materialRequest = new MaterialRequest({
			docType: "Material Request",
		});

		const naming_series = useNamingSeries({ classObject: purchaseOrder });

		// Initialize form with calculated amounts
		const allItems = useMemo(() => {
			const items = cartItems.items.map(item => {
				// const newTotal = item * item.qty;
				return { ...item };
			});
			setItemsInCart(items);
			return { ...cartItems, items: items, naming_series };
		}, [cartItems]);

		const methods = useForm<PurchaseOrderDetails>({
			defaultValues: allItems,
			resolver: zodResolver(createPurchaseOrderDetails),
			mode: "onChange",
		});
		const {
			handleSubmit,
			watch,
			formState: { errors },
		} = methods;

		// Watch the items to display updated values
		// const watchedItems = watch("items");

		const watchedItems = watch("items");
		useMemo(() => {
			return setItemsInCart(watchedItems);
		}, [JSON.stringify(watchedItems)]);

		// Disable the Place Order button if there are no items
		const hasItems = watchedItems && watchedItems.length > 0;

		// Show the edit modal for an item
		const handleEditItem = (item: CreatePurchaseOrderItem) => {
			setEditingItem(item);
		};

		// Close the edit modal
		const handleCloseEditModal = () => {
			setEditingItem(null);
		};

		const handleDeleteItem = (item: CreatePurchaseOrderItem) => {
			removeItem(item);

			const currentItems = methods.getValues("items");
			const updatedItems = currentItems.filter(
				i => i.item_name !== item.item_name
			);
			methods.setValue("items", updatedItems);

			show({ message: `${item.item_name} removed from cart` });
		};

		const handleMakePurchaseOrder = async (data: PurchaseOrderDetails) => {
			setIsLoading(true);
			let responseString: string = "";
			if (data.supplier.toLowerCase().includes("leofresh")) {
				responseString = await createInternalProcurement({
					data,
					materialRequest,
					profile: profile!,
				});
			} else {
				responseString = await createPurchaseOrder({
					data,
					naming_series,
					purchaseOrder,
				});
			}
			setIsLoading(false);
			if (responseString.length > 1) {
				show({ message: "Order created successfully" });
				setIsLoading(false);
				setTimeout(() => {
					removeItems();
					router.push("/(protected)/(tabs)/purchases");
				}, 1000);
			} else {
				show({ message: "Failed to make the order" });
			}
		};

		return (
			<ScrollView
				contentContainerStyle={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					paddingHorizontal: 4,
					width: "100%",
					justifyContent: "center",
					gap: 5,
					backgroundColor: appColors.colors.onPrimary,
				}}>
				<View style={{ padding: 30 }}>
					<Text
						variant='titleLarge'
						style={{ textAlign: "center", fontWeight: "bold" }}>
						Supplier : {cartItems.supplier}
					</Text>
				</View>
				<FormProvider {...methods}>
					<>
						{itemsInCart.map((item, index) => (
							<CartItem
								key={item.item_name + index}
								item={item}
								onDelete={handleDeleteItem}
								onEdit={handleEditItem}
							/>
						))}
					</>
					{editingItem && (
						<EditQuantityModal
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
				<View style={{ paddingBottom: 30 }}>
					<Button
						loading={isLoading}
						mode='contained'
						disabled={!hasItems}
						onPress={handleSubmit(handleMakePurchaseOrder)}>
						{hasItems ? "Place Order" : "No Items to Order"}
					</Button>
				</View>
			</ScrollView>
		);
	}
);
