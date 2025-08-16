import {
	GetPurchaseOrderItem,
	ReadSingleMaterialRequestItem,
} from "@/constants";
import { appConfig } from "@/utils/config";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";

export function OrderItem({
	item,
}: {
	item: ReadSingleMaterialRequestItem | GetPurchaseOrderItem;
}) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				flexWrap: "wrap",
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
