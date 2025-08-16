import { AnimatedTank } from "@/components/illustrations";
import { appColors, ReadTankDetails } from "@/constants";
import { useGetCustomerTankReading } from "@/hooks/tanks";
import {
	useCustomerTankDetailsStore,
	useCustomerTankReadingStore,
	useCustomerTankStore,
} from "@/store/tank";
import React, { Suspense, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface TankDetialsWithReadings extends ReadTankDetails {
	water_height: number;
}

export function Tanks() {
	useGetCustomerTankReading();
	const { tank } = useCustomerTankStore();
	const { tankReading, isLoading } = useCustomerTankReadingStore();
	//
	//If a shop has two tanks, then show them next to each other
	const { tankDetails } = useCustomerTankDetailsStore();
	const { tkReadings } = useMemo(() => {
		let tkReadings: TankDetialsWithReadings[] = [];

		if (tankDetails && tankReading) {
			//If we have more than one tank, we need to create a tank for the item
			const readings: TankDetialsWithReadings[] = tankDetails.map(tk => ({
				...tk,
				water_height: tankReading[0] ? tankReading[0].height : 0,
			}));
			if (tankDetails[0].tank_num > 1) {
				tkReadings = [...readings, ...readings];
			} else {
				tkReadings = [...readings];
			}
		}
		return { tkReadings };
	}, [tankDetails, tankReading]);

	if (!tank) {
		return (
			<View
				style={{
					padding: 4,
					borderRadius: 10,
					backgroundColor: appColors.colors.primaryContainer,
				}}>
				<Text> Customer does not have a tank</Text>
			</View>
		);
	}

	if (!tankDetails || !tankReading || isLoading) {
		return (
			<ActivityIndicator
				animating={true}
				size={"large"}
				color={appColors.colors.primary}
			/>
		);
	}

	if (!tankReading[0]) {
		return (
			<View style={styles.card}>
				<Text
					variant='bodyMedium'
					style={{ textAlign: "center" }}>
					Could not find Tank/Meter Readings for {tankDetails[0].name}
				</Text>
			</View>
		);
	}

	return (
		<Suspense
			fallback={
				<ActivityIndicator
					animating={true}
					size={"large"}
					color={appColors.colors.primary}
				/>
			}>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					width: "100%",
					paddingHorizontal: 15,
					gap: 20,
					flexWrap: "wrap",
				}}>
				<View style={styles.tanks}>
					{tkReadings.map((t, i) => (
						<AnimatedTank
							key={t.name + i}
							waterLevel={(t.water_height / t.height) * 100}
							lowLevel={(t.low / t.height) * 100}
							lowLowLevel={(t.low_low / t.height) * 100}
						/>
					))}
				</View>
				<View style={styles.card}>
					<Text
						variant='titleSmall'
						style={{ textAlign: "center" }}>
						{tankReading[0].tank}
					</Text>
					<View style={styles.reading}>
						<Text
							variant='bodyMedium'
							style={styles.description}>
							Meter Reading
						</Text>
						<Text
							style={styles.text}
							variant='headlineSmall'>
							{tankReading[0].meter_reading ?? 0}
						</Text>
					</View>
					<View style={styles.reading}>
						<Text
							variant='bodyMedium'
							style={styles.description}>
							Tank{tankDetails[0].tank_num > 1 ? "s" : null} Capacity (in Ltrs)
						</Text>
						<Text
							style={styles.text}
							variant='headlineSmall'>
							{tankReading[0].volume ?? 0 * tankDetails[0].tank_num ?? 0}
						</Text>
					</View>
					<View style={styles.reading}>
						<Text
							variant='bodyMedium'
							style={
								styles.description
							}>{` ${tankReading[0].reading_type}`}</Text>
					</View>
				</View>
			</View>
		</Suspense>
	);
}

const styles = StyleSheet.create({
	tanks: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		rowGap: 25,
		flexDirection: "row",
	},
	reading: {
		display: "flex",
		width: "100%",
		flexDirection: "column",
		gap: 3,
	},
	text: {
		fontSize: 30,
		marginHorizontal: 8,
		fontWeight: "700",
		direction: "rtl",
	},
	description: {
		display: "flex",
		flexDirection: "row",
		color: appColors.colors.outline,
	},
	card: {
		width: "100%",
		borderRadius: 10,
		padding: 8,
		alignContent: "center",
		backgroundColor: appColors.colors.surfaceVariant,
		borderColor: appColors.colors.primary,
		borderWidth: 1,
	},
});
