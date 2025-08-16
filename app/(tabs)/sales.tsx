import { HillFreshKeyBoardView } from "@/components";
import { useGetSalesProducts } from "@/hooks/products";
import { SalesPage } from "@/screens/salesInvoice/SalesPage";
import React from "react";
import { StyleSheet } from "react-native";

export default function Sales() {
	useGetSalesProducts();
	return (
		<HillFreshKeyBoardView style={styles.container}>
			<SalesPage />
		</HillFreshKeyBoardView>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		margin: 0,
	},
});
