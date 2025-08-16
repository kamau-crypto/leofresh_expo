import { HillFreshKeyBoardView } from "@/components";
import { PaymentEntry } from "@/screens/bank/PaymentEntry";
import { StyleSheet } from "react-native";

export default function Bank() {
	return (
		<HillFreshKeyBoardView style={styles.container}>
			<PaymentEntry />
		</HillFreshKeyBoardView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 4,
		flex: 1,
		height: "100%",
		flexDirection: "column",
		rowGap: 10,
	},
});
