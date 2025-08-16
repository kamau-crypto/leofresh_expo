import { HillFreshFieldForm } from "@/components";
import { appColors } from "@/constants";
import { formatToLocalCurrency } from "@/utils/format";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form"; // Import the new hook
import { StyleSheet, View } from "react-native";
import { Icon, Text, TextInput } from "react-native-paper";
import { CreateSalesInvoice } from "./schema";
import { useWaterCalculations } from "./waterCalculations";

export const WaterReadingForm = () => {
	const {
		setValue,
		watch,
		getValues,
		setError,

		control,
		formState: { errors },
	} = useFormContext<CreateSalesInvoice>();

	const calculateWaterValues = useWaterCalculations({
		setValue,
		watch,
		setError,
	});
	const watchRate = watch("bulk_water.rate");
	const watchCWR = watch("bulk_water.current_water_reading");

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (
				name === "bulk_water.current_water_reading" ||
				name === "bulk_water.rate"
			) {
				const rate = getValues("bulk_water.rate");
				calculateWaterValues();
			}

			if (
				name === "bulk_water.previous_water_reading" ||
				name === "bulk_water.current_water_reading"
			) {
				const pwr = getValues("bulk_water.previous_water_reading");
				const cwr = getValues("bulk_water.current_water_reading");
				if (cwr < pwr) {
					setError("bulk_water.current_water_reading", {
						message: "Meter Reading cannot be Lower",
						type: "validate",
					});
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [watchRate, calculateWaterValues, watchCWR]);

	return (
		<View style={styles.container}>
			<View style={styles.input}>
				<View>
					<Text variant='titleMedium'>PMR</Text>
					<Text> Previous Meter Reading</Text>
				</View>
				<TextInput
					dense={true}
					label={"PWR"}
					mode='outlined'
					style={{ width: 125, marginLeft: 20 }}
					theme={{ roundness: 20, mode: "exact" }}
					value={
						getValues("bulk_water.previous_water_reading").toString() ?? "0"
					}
					editable={false}
				/>
			</View>
			<View style={styles.input}>
				<View>
					<Text variant='titleMedium'>CMR</Text>
					<Text>Current Meter Reading</Text>
				</View>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						flexWrap: "wrap",
					}}>
					<HillFreshFieldForm
						dense
						style={{ width: 125, marginLeft: 20 }}
						control={control}
						valueAsNumber={true}
						keyBoardType='number-pad'
						name='bulk_water.current_water_reading'
						error={errors.bulk_water?.current_water_reading}
					/>
				</View>
			</View>
			<View style={styles.input}>
				<Text variant='titleMedium'>Amount Dispensed</Text>
				<TextInput
					dense={true}
					mode='outlined'
					style={{ width: "30%" }}
					theme={{ roundness: 20, mode: "exact" }}
					value={getValues("bulk_water.water_used")?.toString() ?? "0"}
					editable={false}
					keyboardType='numeric'
				/>
			</View>
			<View style={styles.input}>
				<Text variant='titleMedium'>Rate</Text>
				<HillFreshFieldForm
					dense
					style={{ width: 100 }}
					control={control}
					error={errors.bulk_water?.rate}
					name='bulk_water.rate'
					valueAsNumber={true}
					defaultValue={getValues("bulk_water.rate").toString()}
					keyBoardType='numeric'
				/>
			</View>
			<View style={styles.input}>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<Icon
						source={"delete"}
						size={20}
					/>
					<Text variant='titleMedium'>4% Waste</Text>
				</View>
				<TextInput
					dense={true}
					mode='outlined'
					style={{ width: "30%" }}
					theme={{ roundness: 20, mode: "exact" }}
					value={getValues("bulk_water.waste").toFixed(3)?.toString() ?? "0"}
					editable={false}
				/>
			</View>

			<View style={styles.input}>
				<Text variant='titleMedium'>Billable Water</Text>
				<TextInput
					dense={true}
					mode='outlined'
					style={{ width: "30%" }}
					theme={{ roundness: 20, mode: "exact" }}
					value={
						getValues("bulk_water.billable_water").toFixed(3)?.toString() ?? "0"
					}
					editable={false}
				/>
			</View>

			<View style={styles.figures}>
				<Text
					style={styles.total}
					variant='titleLarge'>
					Bulk Water Total :{" "}
					{formatToLocalCurrency(getValues("bulk_water.total_bulk"))}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		paddingBottom: 20,
	},
	input: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		marginVertical: 4,
	},
	figures: {
		flex: 1,
		width: "100%",
		height: "40%",
		display: "flex",
		flexDirection: "column",
		rowGap: 5,
		elevation: 10,
	},
	total: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: appColors.colors.onPrimary,
		padding: 10,
		borderRadius: 10,
		textAlign: "center",
		fontWeight: "bold",
	},
});
