import { CreatePurchaseOrder } from "@/screens/purchaseOrder/form/CreatePurchaseOrder";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddPurchase() {
	const top = useHeaderHeight();
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}>
			<SafeAreaView
				style={{ paddingTop: top }}
				edges={["right", "bottom", "left"]}>
				<CreatePurchaseOrder />
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}
