import { HillFreshPrimaryChip } from "@/components";
import { GetPurchaseOrder } from "@/constants";
import { PurchaseOrder } from "@/use-cases";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { OrderItem } from "./OrderItem";

export function PurchaseOrderDetails({
	po_order,
	setOrderedItems,
}: {
	po_order: string;
	setOrderedItems: (items: number) => void;
}) {
	const [purOrder, setPurOrder] = useState<GetPurchaseOrder | undefined>(
		undefined
	);

	const purchaseOrder = new PurchaseOrder({ docType: "Purchase Order" });

	useEffect(() => {
		if (po_order.length > 1) {
			const retrieveInvDetails = async () => {
				const res = await purchaseOrder.retrievePurchaseOrder({
					name: po_order,
				});
				if (res) {
					setPurOrder(res);
					setOrderedItems(res.items.length);
				}
			};

			retrieveInvDetails();
		}
	}, [po_order]);

	if (!purOrder) {
		return <ActivityIndicator size={"small"} />;
	}
	return (
		<ScrollView contentContainerStyle={{ flex: 1, width: "100%" }}>
			<Text
				style={{ textAlign: "center" }}
				variant='titleMedium'>
				PURCHASE ORDER ITEMS
			</Text>
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					rowGap: 9,
					paddingVertical: 5,
					paddingHorizontal: 10,
				}}>
				{purOrder.items.map(item => (
					<OrderItem
						key={item.name}
						item={item}
					/>
				))}
			</View>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					rowGap: 9,
					flexWrap: "wrap",
				}}>
				<HillFreshPrimaryChip
					text={`Delivery Date : ${format(
						purOrder.schedule_date,
						"yyyy-MM-dd"
					)} `}
				/>
				<HillFreshPrimaryChip
					text={`Created : ${format(
						purOrder.creation,
						"yyyy-MM-dd HH:mm:ss"
					)} `}
				/>
				<HillFreshPrimaryChip text={`Created By : ${purOrder.owner}`} />
				<HillFreshPrimaryChip
					text={`% Received : ${purOrder.per_received.toFixed(2)} %`}
				/>
			</View>
		</ScrollView>
	);
}
