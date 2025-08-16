import { HillFreshPrimaryChip } from "@/components";
import { ReadSingleMaterialRequestData } from "@/constants";
import { MaterialRequest } from "@/services";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { OrderItem } from "./OrderItem";

export function MaterialRequestDetails({
	req_name,
	setItemsOrdered,
}: {
	req_name: string;
	setItemsOrdered: (items: number) => void;
}) {
	const [matReqItem, setMatReqItem] = useState<
		ReadSingleMaterialRequestData | undefined
	>(undefined);

	const materialRequest = new MaterialRequest({ docType: "Material Request" });

	useEffect(() => {
		if (req_name.length > 1) {
			const getItems = async () => {
				const res = await materialRequest.retrieveMaterialRequest({
					material_req: req_name,
				});

				if (res) {
					setMatReqItem(res);
					setItemsOrdered(res.items.length);
				}
			};
			getItems();
		}
	}, [req_name]);

	if (!matReqItem) {
		return <ActivityIndicator size={"small"} />;
	}

	return (
		<ScrollView contentContainerStyle={{ flex: 1, width: "100%" }}>
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
				{matReqItem.items.map(item => (
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
						matReqItem.schedule_date,
						"yyyy-MM-dd"
					)} `}
				/>
				<HillFreshPrimaryChip
					text={`Date : ${format(matReqItem.creation, "yyyy-MM-dd HH:mm:ss")} `}
				/>
				<HillFreshPrimaryChip text={`Created By : ${matReqItem.owner}`} />
				<HillFreshPrimaryChip
					text={`% Received : ${matReqItem.per_ordered.toFixed(2)} %`}
				/>
			</View>
		</ScrollView>
	);
}
