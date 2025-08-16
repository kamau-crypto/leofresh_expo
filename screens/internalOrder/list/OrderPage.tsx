import { appColors, ReadMultipleMaterialRequestsData } from "@/constants";
import { useProfileStore } from "@/store/profile";
import { useResultStore } from "@/store/result";

import { useHillFreshTheme } from "@/components";
import { NotFound } from "@/components/illustrations";
import { MaterialRequest } from "@/use-cases/material.request";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	FlatList,
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { FAB, Text } from "react-native-paper";
import { OrderItems } from "./OrderItem";

export function OrdersPage() {
	return (
		<View style={styles.salesContainer}>
			<MaterialorderFlatList />
			<CreateOrderFab />
		</View>
	);
}

function CreateOrderFab() {
	const router = useRouter();
	const { theme } = useHillFreshTheme();
	return (
		<TouchableOpacity>
			<FAB
				icon='plus'
				style={{ ...styles.fab, backgroundColor: theme.colors.primary }}
				onPress={() => {
					router.push("/add-request");
				}}
			/>
		</TouchableOpacity>
	);
}

function MaterialorderFlatList() {
	const { profile } = useProfileStore();
	const [refreshing, setIsRefreshing] = useState<boolean>(false);
	const { limit } = useResultStore();
	const mtRequests = new MaterialRequest({ docType: "Material Request" });
	const [materialRequests, setMaterialRequests] = useState<
		ReadMultipleMaterialRequestsData[]
	>([]);

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsRefreshing(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		const retrieveAllOrders = async () => {
			const data = await mtRequests.retrieveMaterialRequests({
				limit,
				warehouse: profile!.warehouse_name,
			});
			if (data) {
				setIsRefreshing(false);
				setMaterialRequests(data);
			}
		};
		retrieveAllOrders();
	}, [profile, fetchTrigger]);

	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [])
	);

	const DATA = useMemo(() => {
		if (materialRequests.length) {
			return materialRequests.map(purchase => ({ ...purchase }));
		}
		return materialRequests;
	}, [materialRequests]);

	return (
		<FlatList
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => setFetchTrigger(prevTrigger => prevTrigger + 1)}
				/>
			}
			ListEmptyComponent={() => (
				<View style={{ flex: 1, height: "100%" }}>
					<View
						style={{
							...styles.salesContainer,
							justifyContent: "center",
							alignItems: "center",
							paddingTop: "50%",
						}}>
						<NotFound />
						<Text
							variant='titleMedium'
							style={{
								padding: 8,
							}}>
							No Orders found for {profile!.customer}
						</Text>
						<Text>Click the + below to create one</Text>
					</View>
				</View>
			)}
			ListHeaderComponent={() => (
				<Text
					style={{
						textAlign: "center",
						backgroundColor: appColors.colors.onPrimary,
						padding: 10,
					}}
					variant='titleLarge'>
					All Orders
				</Text>
			)}
			data={DATA}
			style={{ height: "100%" }}
			renderItem={({ item }) => (
				<OrderItems
					refetch={refetch}
					items={item}
					materialRequest={mtRequests}
				/>
			)}
			keyExtractor={item => item.name}
		/>
	);
}

const styles = StyleSheet.create({
	salesContainer: {
		width: "100%",
		height: "100%",
	},
	cardItems: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		fontWeight: "bold",
	},
	fab: {
		position: "absolute",
		borderRadius: 50,
		margin: 20,
		right: 0,
		bottom: 0,
	},
});
