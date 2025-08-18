import { ReadMultipleMaterialRequestsData } from "@/constants";
import { useProfileStore } from "@/store/profile";
import { useResultStore } from "@/store/result";

import { useHillFreshTheme } from "@/components";
import { NotFound } from "@/components/illustrations";
import {
	MaterialRequest,
	PurchaseOrder,
	ReturnedPurchaseOrder,
} from "@/services";
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
import { PurchaseItem } from "./PurchaseItem";

export function PurchasePage() {
	return (
		<View style={styles.salesContainer}>
			<PurchaseOrderFlatList />
			<CreateSalesFab />
		</View>
	);
}

function CreateSalesFab() {
	const router = useRouter();
	const { theme } = useHillFreshTheme();
	return (
		<TouchableOpacity>
			<FAB
				icon='plus'
				color={theme.colors.onPrimary}
				style={{ ...styles.fab, backgroundColor: theme.colors.primary }}
				onPress={() => {
					router.push("/(protected)/add-purchase");
				}}
			/>
		</TouchableOpacity>
	);
}

function PurchaseOrderFlatList() {
	const { profile } = useProfileStore();
	const [refreshing, setIsRefreshing] = useState<boolean>(false);
	const { limit } = useResultStore();
	const { theme } = useHillFreshTheme();
	const purchases = new PurchaseOrder({ docType: "Purchase Order" });
	const matReq = new MaterialRequest({ docType: "Material Request" });
	const [purchaseOrders, setPurchcaseOrders] = useState<
		ReturnedPurchaseOrder[]
	>([]);
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
			const data = await purchases.retrievePurchaseOrders({
				limit: limit,
				cost_center: profile!.cost_center,
			});
			const internalOrd = await matReq.retrieveMaterialRequests({
				limit: limit,
				warehouse: profile!.warehouse_name,
			});
			if (data || internalOrd) {
				setIsRefreshing(false);
				setPurchcaseOrders(data);
				setMaterialRequests(internalOrd);
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
		const POs = purchaseOrders.map(ord => ({
			...ord,
			origin: "Purchase Order",
		}));

		const MRs = materialRequests.map(mr => ({
			...mr,
			origin: "Stock Entry",
		}));

		const combined = [...POs, ...MRs];
		if (combined.length > 0) {
			const firstDate = combined[0].creation;

			if (typeof firstDate === "string") {
				return combined.sort(
					(a, b) =>
						(new Date(b.creation) as Date).getTime() -
						(new Date(a.creation) as Date).getTime()
				);
			} else {
				return combined.sort((a, b) =>
					String(b.creation).localeCompare(String(a.creation))
				);
			}
		}

		return combined;
	}, [purchaseOrders, materialRequests]);

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
								textAlign: "center",
							}}>
							No Purchase Orders found for {profile!.customer}
						</Text>
						<Text style={{ textAlign: "center" }}>
							Click the + below to create one
						</Text>
					</View>
				</View>
			)}
			ListHeaderComponent={() => (
				<Text
					style={{
						textAlign: "center",
						backgroundColor: theme.colors.onPrimary,
						padding: 10,
					}}
					variant='titleLarge'>
					Purchase Orders
				</Text>
			)}
			data={DATA}
			style={{ height: "100%" }}
			renderItem={({ item }) => (
				<PurchaseItem
					refetch={refetch}
					items={item}
					purchaseOrder={purchases}
					materialRequest={matReq}
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
