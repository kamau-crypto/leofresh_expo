import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";
import { useHillFreshTheme } from "../context";

export function HillFreshPrimaryChip({ text }: { text: string }) {
	const { theme } = useHillFreshTheme();
	const colors = {
		borderColor: theme.colors.primary,
		backgroundColor: theme.colors.onSecondary,
	};
	return <Chip style={{ ...styles.chipStyle, ...colors }}>{text}</Chip>;
}

const styles = StyleSheet.create({
	chipStyle: {
		borderWidth: 1,
		borderRadius: 30,
	},
});
