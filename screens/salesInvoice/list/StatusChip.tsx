import { SalesStatusEnum } from "@/constants";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

//Render different chips based on the status of the sales order...
export function CompileChipStatus({ status }: { status: string }) {
	switch (true) {
		case status === SalesStatusEnum.Completed ||
			status === SalesStatusEnum.Paid:
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
		case status === SalesStatusEnum.Draft || status === SalesStatusEnum.Unpaid:
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
		case status === SalesStatusEnum.Overdue:
			return (
				<Chip
					textStyle={{ color: "#FF8A65" }}
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

const styles = StyleSheet.create({
	chip: {
		width: "auto",
		position: "absolute",
		right: 10,
		bottom: 10,
		borderRadius: 30,
		fontWeight: "bold",
	},
});
