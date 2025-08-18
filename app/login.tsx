import { HillFreshKeyBoardView, useHillFreshTheme } from "@/components";
import { LoginPage } from "@/screens/LoginPage";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
	const { top } = useSafeAreaInsets();
	const { theme } = useHillFreshTheme();
	// Add a safe area view for the app to tackle edge to edge display problems.
	return (
		<HillFreshKeyBoardView
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: theme.colors.background,
				paddingTop: top,
			}}>
			<View
				style={{
					...styles.header,
					backgroundColor: theme.colors.inversePrimary,
				}}>
				<Text
					variant='titleLarge'
					style={styles.heading}>
					Login to Leofresh
				</Text>
			</View>
			<ScrollView contentContainerStyle={styles.container}>
				<LoginPage />
			</ScrollView>
		</HillFreshKeyBoardView>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		height: 60,
		display: "flex",
		width: "100%",
		padding: 2,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	heading: {
		fontWeight: "bold",
	},
});
