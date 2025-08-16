import { appColors } from "@/constants";
import { useWarehouseItemStore } from "@/store/warehouse";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export function StockLevels() {
	const { items } = useWarehouseItemStore();
	if (!items) {
		return (
			<ActivityIndicator
				size={"small"}
				animating={true}
			/>
		);
	}

	return (
		<View style={styles.container}>
			{items.length > 1 ? (
				items.map(item => (
					<View
						style={styles.card}
						key={item.item_code}>
						<Text>{item.item_code}</Text>
						<View style={styles.item_qty}>
							<Text variant='bodyMedium'>{item.actual_qty}</Text>
							{/* <View>
							<Text>{item.stock_uom}</Text>
							<Text>{+item.stock_uom > 1 ? "1" : null}</Text>
						</View> */}
						</View>
					</View>
				))
			) : (
				<View style={styles.card}>
					<Text variant='bodyMedium'>No Stock Items In The Shop </Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		width: "90%",
		borderRadius: 10,
		flexDirection: "column",
		rowGap: 10,
		padding: 10,
		backgroundColor: appColors.colors.surfaceVariant,
		borderColor: appColors.colors.primary,
		borderWidth: 1,
	},
	card: {
		display: "flex",
		flexDirection: "row",
		borderRadius: 10,
		padding: 4,
		alignContent: "center",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: appColors.colors.surfaceVariant,
	},
	item_qty: {
		display: "flex",
		flexDirection: "row",
		columnGap: 10,
	},
});
