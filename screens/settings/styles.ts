import { appColors } from "@/constants";
import { StyleSheet } from "react-native";

export const settingsStyles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		gap: 10,
		flex: 1,
		padding: 8,
	},
	heading: {
		padding: 15,
		backgroundColor: appColors.colors.onPrimary,
		borderRadius: 10,
	},
	cta: {
		padding: 15,
		backgroundColor: appColors.colors.inversePrimary,
		borderRadius: 10,
	},
	result: {
		display: "flex",
		flexDirection: "row",
		padding: 10,
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	picker: {
		backgroundColor: appColors.colors.onPrimary,
		color: "black",
		borderRadius: 20,
		borderColor: appColors.colors.outline,
	},
});
