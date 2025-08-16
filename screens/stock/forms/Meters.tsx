import { HillFreshFieldForm } from "@/components";
import { appColors, CreateMeterReading } from "@/constants";
import { useNamingSeries } from "@/hooks/naming_series";
import { useMeterReadingStore } from "@/store/meter";
import { useProfileStore } from "@/store/profile";
import {
	useCustomerTankReadingStore,
	useCustomerTankStore,
} from "@/store/tank";
import { useUserStore } from "@/store/user";
import { Meter } from "@/use-cases/meter";
import { hideKeyboard } from "@/utils/keyboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import { z, ZodType } from "zod";
import { CurrentTime } from "./CurrentTime";
import { useCalculateBulkStock } from "./hooks";

export interface MeteredWaterStocks {
	rate: number;
	previous_reading: number;
	current_reading: number;
	waste: number;
	qty: number;
	cash: number;
	mpesa: number;
	total: number;
}

const meteredWaterSchema: ZodType<CreateMeterReading> = z.object({
	previous_reading: z.coerce.number(),
	naming_series: z.string(),
	cash: z.coerce.number(),
	mpesa: z.coerce.number(),
	waste: z.number(),
	current_reading: z.coerce.number({
		description: "The current reading of water at your shop",
	}),
	quantity: z.number().min(1),
	status: z.string().min(0),
	tank: z
		.string({ required_error: "A tank is required to store the data" })
		.min(0),
	variation: z.number().min(0),
	created_by: z.string(),
});

export function Meters() {
	const { user } = useUserStore();
	const meter = new Meter({ docType: "Meter Reading" });
	const bottom = useBottomTabBarHeight();
	const { mreading } = useMeterReadingStore();
	const { tank } = useCustomerTankStore();
	const { profile } = useProfileStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { tankReading } = useCustomerTankReadingStore();

	const naming_series = useNamingSeries({ classObject: meter });
	const defaultValues: CreateMeterReading = {
		current_reading: 0,
		previous_reading: mreading ? +mreading.current_reading : 0,
		naming_series,
		cash: 0,
		mpesa: 0,
		waste: profile!.waste_water,
		quantity: 0,
		created_by: user!.email.includes("admin") ? user!.full_name : user!.email,
		status: "Enabled",
		tank: tank![0].tank,
		variation: 0.0,
	};
	const {
		control,
		formState: { errors },
		setValue,
		getValues,
		reset,
		setError,
		handleSubmit,
		watch,
	} = useForm<CreateMeterReading>({
		resolver: zodResolver(meteredWaterSchema),
		defaultValues,
	});

	const { calculateStock } = useCalculateBulkStock({
		getValues,
		setError,
		setValue,
	});

	const watchCurrentReading = watch("current_reading");
	const mpesa = watch("mpesa");
	const cash = watch("cash");
	// const watchTank = watch("tank");

	useEffect(() => {
		calculateStock();
	}, [watchCurrentReading, mpesa, cash]);

	// useEffect(() => {
	// 	const reading = async () => {
	// 		const currentTank = getValues("tank");
	// 		const mReading = await meter.retrive_meter_readings({
	// 			tank_name: currentTank,
	// 		});
	// 		const meterReading = mReading.data[0].current_reading ?? 0;
	// 		setValue("previous_reading", +meterReading);
	// 	};

	// 	reading();
	// }, [watchTank]);

	const handleSubmitMeterReadings = async (data: CreateMeterReading) => {
		hideKeyboard();
		setIsLoading(true);
		const createdWaterMeter = await meter.addMeterReadings({ data });
		setIsLoading(false);

		if (createdWaterMeter.data.name) {
			ToastAndroid.show("Added meter Reading successfully", 100);
			reset();
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<CurrentTime />
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					paddingHorizontal: 10,
				}}>
				<Text>Tank</Text>
				<HillFreshFieldForm
					control={control}
					name='tank'
					error={errors.tank}
					defaultValue={tank![0].tank}
					disabled={true}
				/>
			</View>
			<View style={styles.inputMiddle}>
				<Text>Prev. Reading</Text>
				<HillFreshFieldForm<CreateMeterReading>
					control={control}
					disabled={true}
					name='previous_reading'
					valueAsNumber={true}
					error={errors.previous_reading}
					keyBoardType='number-pad'
				/>
			</View>
			<View style={styles.inputMiddle}>
				<Text>Curr. Reading</Text>
				<HillFreshFieldForm<CreateMeterReading>
					control={control}
					name='current_reading'
					error={errors.current_reading}
					keyBoardType='number-pad'
				/>
			</View>
			<View style={styles.inputMiddle}>
				<Text>Cash Sale</Text>
				<HillFreshFieldForm
					control={control}
					name='cash'
					error={errors.cash}
					keyBoardType='number-pad'
				/>
			</View>
			<View style={styles.inputMiddle}>
				<Text>Mpesa Sale</Text>
				<HillFreshFieldForm
					control={control}
					name='mpesa'
					error={errors.mpesa}
					keyBoardType='number-pad'
				/>
			</View>
			<View style={{ ...styles.inputMiddle }}>
				<Text> Waste Limit</Text>
				<Text>{profile!.waste_water}%</Text>
			</View>
			<View style={{ ...styles.inputMiddle }}>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<Icon
						size={20}
						source='delete'
						color={appColors.colors.error}
					/>
					<Text> Waste</Text>
				</View>
				<Text>{getValues("waste")}</Text>
			</View>
			<View style={{ paddingBottom: bottom / 2 }}>
				<Button
					mode='contained'
					loading={isLoading}
					onPress={handleSubmit(handleSubmitMeterReadings)}>
					Submit
				</Button>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		paddingHorizontal: 10,
		rowGap: 5,
	},
	inputMiddle: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		borderRadius: 10,
		padding: 4,
		justifyContent: "space-between",
	},
});
