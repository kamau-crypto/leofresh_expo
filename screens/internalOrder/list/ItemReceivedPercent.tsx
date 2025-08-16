import { appColors } from "@/constants";
import React from "react";
import { Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";

export function ItemsReceivedPercent({ per }: { per: number }) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "column",
				padding: 4,
				bottom: 5,
			}}>
			<Text>Percent Received</Text>
			<ProgressBar
				style={{ borderRadius: 10 }}
				progress={per / 100}
				color={per > 40 ? "#43A047" : appColors.colors.outline}
			/>
		</View>
	);
}
