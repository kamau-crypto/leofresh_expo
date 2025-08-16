import { appColors } from "@/constants";
import { useRetrieveMeterReadings } from "@/hooks/meter";
import { useGetPurchaseProducts, useGetSalesProducts } from "@/hooks/products";
import { useGetCustomerTank, useGetCustomerTankDetails } from "@/hooks/tanks";
import { useGetStockLevels, useGetWarehouses } from "@/hooks/warehouse";
import { useProfileStore } from "@/store/profile";

import { useUserStore } from "@/store/user";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export function ShopDetails() {
	// const [fetchTrigger, setFetchTrigger] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const { refetch: refetchTanks } = useGetCustomerTank();
	const { refetch: refetchSales } = useGetSalesProducts();
	const { refetch: refetchProducts } = useGetPurchaseProducts();
	useGetWarehouses();
	const { profile } = useProfileStore();
	useGetCustomerTankDetails();
	const { refetch: refetchStockLevels } = useGetStockLevels();
	const { refetch: refetchMeterReadings } = useRetrieveMeterReadings();

	useFocusEffect(
		useCallback(() => {
			setIsRefreshing(true);

			refetchTanks();
			refetchSales();
			refetchProducts();
			refetchMeterReadings();
			refetchStockLevels();

			setIsRefreshing(false);
			return () => {
				// Optional cleanup when screen loses focus
			};
		}, [])
	);

	const { user } = useUserStore();

	return (
		<ScrollView
			style={styles.card}
			refreshControl={
				<RefreshControl
					refreshing={isRefreshing}
					onRefresh={() => setIsRefreshing(prev => !prev)}
				/>
			}>
			<View
				style={{
					backgroundColor: appColors.colors.surfaceVariant,
					paddingTop: 10,
					borderRadius: 10,
				}}>
				<Text
					variant='titleMedium'
					style={{ padding: 4, textAlign: "center" }}>
					Welcome, {user?.username} to
				</Text>
				<Text
					variant='headlineMedium'
					style={styles.title}>
					{profile ? profile.customer : " Unknown"}
				</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: "bold",
		padding: 10,
		textAlign: "center",
	},
	card: {
		width: "80%",
		borderRadius: 10,
		padding: 4,
		alignContent: "center",
	},
});
