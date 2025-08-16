import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export function AgentScreen() {
	return (
		<ScrollView style={{ height: "100%", padding: 4 }}>
			<View>
				<Text>Create a quote(Optional)</Text>
			</View>
			<View>
				<Text>Create a sales order for the client</Text>
			</View>
			<View>
				<Text>Request a payment Entry</Text>
			</View>
		</ScrollView>
	);
}
