import { appColors } from "@/constants";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function HillFreshModalHeader({ heading }: { heading: string }) {
	const router = useRouter();
	const { top } = useSafeAreaInsets();
	return (
		<View style={{ ...styles.container, paddingTop: top }}>
			<IconButton
				onPress={() => router.back()}
				style={styles.icon}
				size={24}
				icon={"arrow-left"}
			/>
			<Text
				style={styles.text}
				variant='titleLarge'>
				{heading}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		width: "100%",
		padding: 2,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: appColors.colors.inversePrimary,
	},
	icon: {
		display: "flex",
		justifyContent: "flex-start",
	},
	text: {
		width: "80%",
		textAlign: "center",
		fontWeight: "700",
		fontFamily: "SpaceMono",
	},
});
