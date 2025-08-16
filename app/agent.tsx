import { useGetPurchaseProducts } from "@/hooks/products";
import { AgentScreen } from "@/screens/agent/AgentScreen";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { KeyboardAvoidingView } from "react-native";

export default function Agent() {
	const top = useHeaderHeight();
	useGetPurchaseProducts();
	return (
		<KeyboardAvoidingView style={{ paddingTop: top }}>
			<AgentScreen />
		</KeyboardAvoidingView>
	);
}
