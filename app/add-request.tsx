import { RequestMaterials } from "@/screens/internalOrder/form/CreateOrder";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { View } from "react-native";

export default function FactoryMaterialRequest() {
	const top = useHeaderHeight();
	return (
		<View style={{ paddingTop: top }}>
			<RequestMaterials />
		</View>
	);
}
