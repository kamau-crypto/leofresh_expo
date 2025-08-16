import { HillFreshMenuOptions, HillFreshPrimaryChip } from "@/components";
import {
	appColors,
	ReadMultipleMaterialRequestsData,
	ReadSingleMaterialRequestData,
	ReadSingleMaterialRequestItem,
} from "@/constants";
import { MaterialRequest } from "@/services/material.request";
import { appConfig } from "@/utils/config";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, IconButton, Text } from "react-native-paper";
import { useGenerateInternalProcMenuItems } from "../../purchaseOrder/list/hooks/ord.item";
import { CompileChipStatus } from "./Chip";
import { ItemsReceivedPercent } from "./ItemReceivedPercent";
import { OrderItemsDialog } from "./OrderItemsDialog";

export const OrderItems = ({
	items,
	materialRequest,
	refetch,
}: {
	items: ReadMultipleMaterialRequestsData;
	materialRequest: MaterialRequest;
	refetch: () => void;
}) => {
	const [openItemsModal, setOpenItemsModal] = useState(false);
	const [matReqitem, SetMatReqitem] = useState<
		ReadSingleMaterialRequestData | undefined
	>(undefined);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const getItems = async () => {
			const res = await materialRequest.retrieveMaterialRequest({
				material_req: items.name,
			});
			const responseItem = res ? res : undefined;
			SetMatReqitem(responseItem);
		};
		getItems();
	}, []);

	const { options } = useGenerateInternalProcMenuItems({
		refetch,
		item: { ...items, origin: "Material Request" },
		materialRequest,
	});

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
				paddingHorizontal: 20,
			}}>
			<Card
				style={{ backgroundColor: appColors.colors.primaryContainer }}
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
					<ItemsReceivedPercent per={items.per_ordered} />
					<View style={styles.cardItems}>
						<Text style={{ fontWeight: "bold" }}>{items.set_warehouse}</Text>
					</View>
					<Text>{format(items.transaction_date, "yyyy-MM-dd")}</Text>
					<CompileChipStatus status={items.status} />
				</Card.Content>
			</Card>
			<OrderItemsDialog
				hideDialog={hideItemsDialog}
				visible={openItemsModal}
				Component={() => <MaterialDetails orderItems={matReqitem} />}
				style={{
					height: `${matReqitem ? matReqitem.items.length * 8 + 22.5 : 30}%`,
					paddingHorizontal: 10,
					maxHeight: "80%",
				}}
			/>
		</View>
	);
};

function MaterialDetails({
	orderItems,
}: {
	orderItems: ReadSingleMaterialRequestData | undefined;
}) {
	if (!orderItems) {
		return <ActivityIndicator size={"small"} />;
	}
	return (
		<View style={{ flex: 1 }}>
			<Text
				style={{ textAlign: "center" }}
				variant='titleMedium'>
				ORDERED ITEMS
			</Text>
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					rowGap: 9,
					paddingVertical: 5,
					paddingHorizontal: 10,
				}}>
				{orderItems.items.map(item => (
					<MaterialItem
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
					text={`Date : ${format(orderItems.creation, "yyyy-MM-dd HH:mm:ss")} `}
				/>
				<HillFreshPrimaryChip text={`Created By : ${orderItems.owner}`} />
				<HillFreshPrimaryChip
					text={`% Received : ${orderItems.per_ordered.toFixed(2)} %`}
				/>
			</View>
		</View>
	);
}

function MaterialItem({ item }: { item: ReadSingleMaterialRequestItem }) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
			}}>
			<Image
				source={{
					uri: `${appConfig.PUBLIC_URL}${item.image}`,
					width: 50,
					height: 50,
				}}
				style={{ objectFit: "contain", borderRadius: 10 }}
			/>
			<Text>{item.item_name}</Text>
			<Text>
				{`${item.qty} ${item.uom}`}
				{item.qty > 1 ? "s" : null}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	cardItems: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		fontWeight: "bold",
	},
});
