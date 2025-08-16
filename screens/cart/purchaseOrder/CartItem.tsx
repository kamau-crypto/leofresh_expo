import { useHillFreshTheme } from "@/components";
import { CreatePurchaseOrderItem } from "@/constants";
import { formatToLocalCurrency } from "@/utils/format";
import React from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export const CartItem = React.memo(
	({
		item,
		onEdit,
		onDelete,
	}: {
		item: CreatePurchaseOrderItem;
		onEdit: (item: CreatePurchaseOrderItem) => void;
		onDelete: (item: CreatePurchaseOrderItem) => void;
	}) => {
		const { theme } = useHillFreshTheme();
		return (
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					padding: 4,
					columnGap: 5,
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					backgroundColor: theme.colors.onSecondary,
				}}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						width: "70%",
						flexWrap: "wrap",
						justifyContent: "center",
						columnGap: 5,
						marginLeft: 10,
					}}>
					<Text
						variant='titleMedium'
						style={{ fontWeight: "bold" }}>
						{item.item_name}
					</Text>
					<Text variant='titleMedium'>X</Text>
					<Text
						variant='titleMedium'
						style={{ fontWeight: "bold" }}>
						{item.qty}
					</Text>
					<Text variant='titleMedium'>=</Text>
					<Text
						variant='titleMedium'
						style={{ fontWeight: "bold" }}>
						{formatToLocalCurrency(
							Math.round(item.amount * item.conversion_factor)
						)}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						width: "25%",
						paddingHorizontal: 5,
						justifyContent: "center",
					}}>
					<IconButton
						size={30}
						icon={"pencil-circle"}
						onPress={() => onEdit(item)}
					/>
					<IconButton
						size={30}
						icon={"delete"}
						iconColor={theme.colors.error}
						onPress={() => onDelete(item)}
					/>
				</View>
			</View>
		);
	}
);
