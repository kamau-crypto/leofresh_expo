import { StyleSheet } from "react-native";
import { appColors } from "./theme";

export const commonStyles = StyleSheet.create({
	centeredContainer: {
		justifyContent: "center",
		flex: 1,
		alignItems: "center",
	},
	links: {
		color: appColors.colors.tertiary,
		textDecorationLine: "underline",
		fontWeight: "bold",
	},
	submitButtonContainer: {
		marginTop: 20,
		marginBottom: 30,
		paddingHorizontal: 40,
	},
	scrollContainer: {
		flexGrow: 1,
		paddingBottom: 20,
	},
	appContainer: {
		flex: 1,
	},
	border: {
		borderColor: appColors.colors.primary,
		borderWidth: 1,
	},
});
