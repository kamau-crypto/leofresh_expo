import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-paper";

export function CurrentTime() {
	const time = new Date();
	const localTime = time.toLocaleDateString("en-KE", {
		weekday: "short",
		year: "numeric",
		month: "numeric",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<View style={styles.container}>
			<Icon
				size={20}
				source='clock-outline'
			/>
			<Text>{localTime}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 4,
	},
});
