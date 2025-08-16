import { appColors } from "@/constants";
import { useResultStore } from "@/store/result";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { settingsStyles } from "./styles";

export function Results() {
	const { decreaseLimit, increaseLimit, limit } = useResultStore();

	const handleIncreaseLimit = () => {
		increaseLimit();
	};
	const handleDecreaseLimit = () => {
		decreaseLimit();
	};
	return (
		<View style={settingsStyles.heading}>
			<Text
				variant='titleMedium'
				style={{ textAlign: "center", fontWeight: "bold" }}>
				Number of results you can view at once
			</Text>
			<Text
				variant='bodyMedium'
				style={{ textAlign: "center" }}>
				Increase or Decrease by a factor of 5
			</Text>
			<View style={settingsStyles.result}>
				<IconButton
					containerColor={appColors.colors.tertiaryContainer}
					icon='plus'
					onPress={handleIncreaseLimit}
				/>
				<Text
					variant='titleMedium'
					style={{ fontWeight: "bold" }}>
					{limit}
				</Text>
				<IconButton
					containerColor={appColors.colors.tertiaryContainer}
					icon='minus'
					onPress={handleDecreaseLimit}
				/>
			</View>
		</View>
	);
}
