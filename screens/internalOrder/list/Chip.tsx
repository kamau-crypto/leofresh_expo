import { appColors, MaterialRequestEnum } from "@/constants";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

export function CompileChipStatus({ status }: { status: string }) {
	switch (status) {
		case MaterialRequestEnum.Transferred:
			return (
				<Chip
					textStyle={{ color: "#43A047", fontWeight: "bold" }}
					style={{
						backgroundColor: "#E8F5E9",
						...(styles.chip as object),
					}}>
					{status}
				</Chip>
			);
		case MaterialRequestEnum.Draft || MaterialRequestEnum.Cancelled:
			return (
				<Chip
					textStyle={{ color: "#E57373" }}
					style={{
						backgroundColor: "#FFEBEE",
						...(styles.chip as object),
					}}>
					{status}
				</Chip>
			);
		case MaterialRequestEnum.Pending || MaterialRequestEnum.Issued:
			return (
				<Chip
					textStyle={{ color: "#EEEE" }}
					style={{
						backgroundColor: "#FFCCBC",
						...(styles.chip as object),
					}}>
					{status}
				</Chip>
			);
		case MaterialRequestEnum.PartiallyReceived:
			return (
				<Chip
					textStyle={{ color: "#FF8A79" }}
					style={{
						backgroundColor: "#FFCCBC",
						...(styles.chip as object),
					}}>
					{status}
				</Chip>
			);

		default:
			return (
				<Chip
					textStyle={{ color: "#7E57C2" }}
					style={{
						backgroundColor: "#D1C4E9",
						...(styles.chip as object),
					}}>
					{status}
				</Chip>
			);
	}
}

export function CustomChip({ text }: { text: string }) {
	return <Chip style={styles.chipStyle}>{text}</Chip>;
}

const styles = StyleSheet.create({
	chip: {
		width: "auto",
		position: "absolute",
		right: 10,
		bottom: 10,
		borderRadius: 30,
		fontWeight: "bold",
	},
	chipStyle: {
		borderWidth: 1,
		borderColor: appColors.colors.primary,
		backgroundColor: appColors.colors.onSecondary,
		borderRadius: 30,
	},
});
