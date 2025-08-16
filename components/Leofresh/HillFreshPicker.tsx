import { appColors } from "@/constants";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export interface HillFreshPickerProps {
	selectedValue: string;
	setSelectedValue: (itemValue: any, itemIndex: number) => void;
	items: { label: string; value: string; enabled?: boolean }[];
	style?: StyleProp<ViewStyle>;
}

export function HillFreshPicker({
	selectedValue,
	setSelectedValue,
	items,
	style,
}: HillFreshPickerProps) {
	return (
		<View
			style={{
				borderColor: appColors.colors.outline,
				borderStyle: "solid",
				borderWidth: 1,
				padding: 2,
				borderRadius: 10,
			}}>
			<Picker
				style={{
					...(style as object),
				}}
				selectedValue={selectedValue}
				onValueChange={setSelectedValue}>
				{items.map(item => (
					<Picker.Item
						enabled={item.enabled}
						style={{ fontFamily: "SpaceMono" }}
						key={item.label}
						label={item.label}
						value={item.value}
					/>
				))}
			</Picker>
		</View>
	);
}
