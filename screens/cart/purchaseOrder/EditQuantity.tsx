import { appColors, CreatePurchaseOrderItem } from "@/constants";
import { formatToLocalCurrency } from "@/utils/format";
import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";

interface EditQuantityModalProps {
	isVisible: boolean;
	item: CreatePurchaseOrderItem;
	onClose: () => void;
}

export function EditQuantityModal({
	isVisible,
	item,
	onClose,
}: EditQuantityModalProps) {
	// Get the form methods from FormProvider
	const { setValue, getValues } = useFormContext();

	// Local state for the quantity input
	const [quantity, setQuantity] = useState(item.qty.toString());

	const setItemQuantity = useCallback((value: string) => {
		setQuantity(value);
	}, []);

	// Handle saving the updated quantity
	const handleSave = () => {
		const newQty = parseFloat(quantity);

		if (isNaN(newQty) || newQty <= 0) {
			// Handle invalid input
			return;
		}

		// Calculate the new amount
		const newAmount = item.rate * newQty;

		// Find the index of the item in the items array
		const items = getValues("items");
		const itemIndex = items.findIndex(
			(i: CreatePurchaseOrderItem) => i.item_name === item.item_name
		);

		if (itemIndex !== -1) {
			// Batch the updates to avoid multiple re-renders
			const updatedItems = [...items];
			updatedItems[itemIndex] = {
				...updatedItems[itemIndex],
				qty: newQty,
				amount: newAmount,
			};

			// Update the entire array at once
			setValue("items", updatedItems, { shouldDirty: true });
		}

		// Close the modal
		onClose();
	};

	// Handle canceling the edit
	const handleCancel = () => {
		onClose();
	};

	return (
		<Portal>
			<Modal
				visible={isVisible}
				onDismiss={handleCancel}
				contentContainerStyle={styles.container}>
				<View style={styles.modalContent}>
					<Text
						variant='headlineSmall'
						style={styles.title}>
						Edit Quantity
					</Text>
					<Text
						variant='titleMedium'
						style={styles.itemCode}>
						{item.item_name}
					</Text>

					<View style={styles.rateContainer}>
						<Text variant='bodyLarge'>Rate: </Text>
						<Text
							variant='bodyLarge'
							style={styles.rate}>
							{formatToLocalCurrency(
								Math.round(item.rate * item.conversion_factor)
							)}
							/{item.uom}
						</Text>
					</View>

					<TextInput
						label='Quantity'
						value={quantity}
						onChangeText={setItemQuantity}
						keyboardType='numeric'
						mode='outlined'
						style={styles.input}
					/>

					<View style={styles.totalContainer}>
						<Text variant='bodyLarge'>Total Amount: </Text>
						<Text
							variant='bodyLarge'
							style={styles.total}>
							{parseFloat(quantity) > 0
								? (
										item.rate *
										item.conversion_factor *
										parseFloat(quantity)
								  ).toFixed(2)
								: "0.00"}
						</Text>
					</View>

					<View style={styles.buttonContainer}>
						<Button
							mode='outlined'
							onPress={handleCancel}
							style={styles.button}>
							Cancel
						</Button>
						<Button
							mode='contained'
							onPress={handleSave}
							style={styles.button}>
							Save
						</Button>
					</View>
				</View>
			</Modal>
		</Portal>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 20,
		margin: 20,
		borderRadius: 10,
	},
	modalContent: {
		gap: 16,
	},
	title: {
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
	},
	itemCode: {
		fontWeight: "bold",
	},
	rateContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	rate: {
		fontWeight: "bold",
	},
	input: {
		marginVertical: 10,
	},
	totalContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	total: {
		fontWeight: "bold",
		color: appColors.colors.primary,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	button: {
		flex: 1,
		marginHorizontal: 5,
	},
});
