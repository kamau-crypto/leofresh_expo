import {
	appColors,
	CreatePurchaseOrderItem,
	MaterialRequestItem,
} from "@/constants";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Text, TextInput } from "react-native-paper";

interface EditQuantityModalProps {
	isVisible: boolean;
	item: MaterialRequestItem;
	onClose?: () => void;
}

export function EditMaterialRequestQuantityModal({
	isVisible,
	item,
	onClose,
}: EditQuantityModalProps) {
	// Get the form methods from FormProvider
	const { setValue, getValues } = useFormContext();

	// Local state for the quantity input
	const [quantity, setQuantity] = useState(item.qty.toString());

	// Handle saving the updated quantity
	const handleSave = () => {
		const newQty = parseFloat(quantity);

		if (isNaN(newQty) || newQty <= 0) {
			// Handle invalid input
			return;
		}

		// Find the index of the item in the items array
		const items = getValues("items");
		const itemIndex = items.findIndex(
			(i: CreatePurchaseOrderItem) => i.item_name === item.item_name
		);

		if (itemIndex !== -1) {
			// Update quantity and amount in the form
			setValue(`items.${itemIndex}.qty`, newQty);
		}

		// Close the modal
		if (onClose) {
			onClose();
		}
	};

	// Handle canceling the edit
	const handleCancel = () => {
		if (onClose) {
			onClose();
		}
	};

	return (
		<Modal
			visible={isVisible}
			onDismiss={handleCancel}
			contentContainerStyle={styles.container}>
			<View style={styles.modalContent}>
				<Text
					variant='headlineSmall'
					style={styles.title}>
					Edit {item.item_name} Quantity
				</Text>
				<View style={styles.rateContainer}>
					<Text variant='bodyLarge'>Quantity: </Text>
					<Text
						variant='bodyLarge'
						style={styles.rate}>
						{`${item.qty} ${item.uom}`}
						{item.qty > 1 ? "s" : null}
					</Text>
				</View>

				<TextInput
					label='Quantity'
					value={quantity}
					onChangeText={setQuantity}
					keyboardType='numeric'
					mode='outlined'
					style={styles.input}
				/>

				{/* <View style={styles.totalContainer}>
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
				</View> */}

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
