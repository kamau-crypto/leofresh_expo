import { HillFreshMenuOptions, useHillFreshTheme } from "@/components";
import { appColors } from "@/constants";
import { MaterialRequest, PurchaseOrder } from "@/services";
import { formatToLocalCurrency } from "@/utils/format";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { CompileChipStatus } from "./Chip";
import {
	isPurchaseOrder,
	MaterialRequestWithOrigin,
	PurchaseOrderWithOrigin,
} from "./hooks/guard";
import { useGenerateInternalProcMenuItems } from "./hooks/ord.item";
import { useGeneratePurchaseOrderMenuItems } from "./hooks/po.item";
import { MaterialRequestDetails } from "./MaterialRequestDetails";
import { OrderItemsDialog } from "./OrderItemsDialog";
import { Percent } from "./Percent";
import { PurchaseOrderDetails } from "./PurchaseOrderDetails";

export function PurchaseItem({
	items,
	purchaseOrder,
	materialRequest,
	refetch,
}: {
	items: PurchaseOrderWithOrigin | MaterialRequestWithOrigin;
	purchaseOrder: PurchaseOrder;
	materialRequest: MaterialRequest;
	refetch: () => void;
}) {
	if (isPurchaseOrder(items)) {
		return (
			<PurchaseOrderItem
				refetch={refetch}
				items={items}
				purchaseOrder={purchaseOrder}
			/>
		);
	} else {
		return (
			<MaterialRequestItem
				refetch={refetch}
				items={items}
				materialRequest={materialRequest}
			/>
		);
	}
}

function PurchaseOrderItem({
	items,
	purchaseOrder,
	refetch,
}: {
	items: PurchaseOrderWithOrigin;
	purchaseOrder: PurchaseOrder;
	refetch: () => void;
}) {
	const [openItemsModal, setOpenItemsModal] = useState(false);
	const [visible, setVisible] = useState(false);
	const [orderItems, setOrderItems] = useState<number>(0);

	const { options } = useGeneratePurchaseOrderMenuItems({
		item: items,
		purchaseOrder,
		refetch,
	});

	const setRetrievedItems = useCallback((items: number) => {
		setOrderItems(items);
	}, []);

	const openMenu = () => setVisible(prev => !prev);

	const closeMenu = () => setVisible(false);

	const handleCardPress = useCallback(() => {
		setOpenItemsModal(prev => !prev);
	}, []);

	const hideItemsDialog = () => {
		setOpenItemsModal(prev => !prev);
	};

	return (
		<View
			style={{
				width: "100%",
				padding: 10,
				paddingHorizontal: 20,
			}}>
			<Card
				style={{ backgroundColor: appColors.colors.tertiaryContainer }}
				onPress={handleCardPress}>
				<Card.Title
					title={items.name}
					titleStyle={{ fontWeight: "bold", fontSize: 16 }}
					right={props => (
						<HillFreshMenuOptions
							menuItems={options}
							visible={visible}
							closeMenu={closeMenu}
							Anchor={() => (
								<IconButton
									{...props}
									icon='dots-vertical'
									onPress={openMenu}
								/>
							)}
						/>
					)}
				/>
				<Card.Content
					style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
					<Percent per={items.per_received} />
					<View style={styles.cardItems}>
						<Text style={{ fontWeight: "bold" }}>{items.supplier}</Text>
						<Text style={{ fontWeight: "bold" }}> | </Text>
						<Text style={{ fontWeight: "bold" }}>
							{" "}
							{items.per_received.toFixed(1)} % Received
						</Text>
						<Text style={{ fontWeight: "bold" }}> | </Text>
						<Text style={{ fontWeight: "bold" }}>
							{formatToLocalCurrency(items.grand_total)}
						</Text>
					</View>
					<Text>{format(new Date(items.creation), "yyyy-MM-dd HH:ss")}</Text>
					<CompileChipStatus status={items.status} />
				</Card.Content>
			</Card>
			<OrderItemsDialog
				hideDialog={hideItemsDialog}
				visible={openItemsModal}
				Component={() => (
					<PurchaseOrderDetails
						po_order={items.name}
						setOrderedItems={setRetrievedItems}
					/>
				)}
				style={{
					minHeight: "50%",
					// height: `${orderItems > 0 ? orderItems * 8 + 20 : 50}%`,
					paddingHorizontal: 10,
					paddingVertical: 5,
				}}
			/>
		</View>
	);
}

function MaterialRequestItem({
	items,
	materialRequest,
	refetch,
}: {
	items: MaterialRequestWithOrigin;
	materialRequest: MaterialRequest;
	refetch: () => void;
}) {
	const [openItemsModal, setOpenItemsModal] = useState(false);
	const [visible, setVisible] = useState(false);
	const [orderItems, setOrderItems] = useState<number>(0);
	const { theme } = useHillFreshTheme();

	const { options } = useGenerateInternalProcMenuItems({
		item: items,
		materialRequest,
		refetch,
	});

	const setRetrievedItems = useCallback((items: number) => {
		setOrderItems(items);
	}, []);

	const openMenu = () => setVisible(prev => !prev);

	const closeMenu = () => setVisible(false);

	const handleCardPress = useCallback(() => {
		setOpenItemsModal(prev => !prev);
	}, []);

	const hideItemsDialog = () => {
		setOpenItemsModal(prev => !prev);
	};

	return (
		<View
			style={{
				width: "100%",
				padding: 10,
				paddingHorizontal: 20,
			}}>
			<Card
				style={{ backgroundColor: theme.colors.primaryContainer }}
				onPress={handleCardPress}>
				<Card.Title
					title={items.name}
					titleStyle={{ fontWeight: "bold", fontSize: 16 }}
					right={props => (
						<HillFreshMenuOptions
							menuItems={options}
							visible={visible}
							closeMenu={closeMenu}
							Anchor={() => (
								<IconButton
									{...props}
									icon='dots-vertical'
									onPress={openMenu}
								/>
							)}
						/>
					)}
				/>
				<Card.Content style={{ flexDirection: "column", rowGap: 10 }}>
					<Percent
						per={items.per_ordered > 0 ? +items.per_ordered.toFixed(2) : 0}
					/>
					<View style={styles.cardItems}>
						<Text style={{ fontWeight: "bold" }}>
							From : {items.from_warehouse}
						</Text>
						<Text style={{ fontWeight: "bold" }}>
							{" "}
							To : {items.set_warehouse}
						</Text>
						<Text style={{ fontWeight: "bold" }}>
							{items.material_request_type}
						</Text>
					</View>
					<Text>{format(new Date(items.creation), "yyyy-MM-dd HH:ss")}</Text>
					<CompileChipStatus status={items.status} />
				</Card.Content>
			</Card>
			<OrderItemsDialog
				hideDialog={hideItemsDialog}
				visible={openItemsModal}
				Component={() => (
					<MaterialRequestDetails
						req_name={items.name}
						setItemsOrdered={setRetrievedItems}
					/>
				)}
				style={{
					minHeight: "50%",
					// height: `${orderItems > 0 ? orderItems * 8 + 20 : 50}%`,
					paddingHorizontal: 10,
					paddingVertical: 5,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	cardItems: {
		flexDirection: "row",
		justifyContent: "space-between",
		fontWeight: "bold",
		flexWrap: "wrap",
		width: "100%",
	},
});
