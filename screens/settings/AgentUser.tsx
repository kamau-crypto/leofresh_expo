import { StyleSheet, View } from "react-native";
import { Logout } from "./Logout";

export function AgentUser() {
	return (
		<View style={styles.container}>
			<Logout />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		gap: 10,
		flex: 1,
		padding: 8,
	},
});
