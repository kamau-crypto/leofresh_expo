import { HillFreshFieldForm, HillFreshPickerFormField } from "@/components";
import { CreateTankReading, TankStockTaking } from "@/constants";
import {
	useCustomerTankDetailsStore,
	useCustomerTankStore,
} from "@/store/tank";
import { Tanks } from "@/use-cases/tank";
import { hideKeyboard } from "@/utils/keyboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	ToastAndroid,
	View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { z, ZodType } from "zod";
import { CurrentTime } from "./CurrentTime";

const water_tanks_schema: ZodType<CreateTankReading> = z.object({
	tank: z.string({
		required_error: "A tank name is required",
		description: "The tank you are adding water readings against",
	}),
	reading_type: z.string({
		required_error: "The type of Reading you want to declare",
		description: "The tanks water reading reading type",
	}),
	number_of_tanks: z.number(),
	height: z.coerce
		.number({ required_error: "The tank water reading height in mm's" })
		.min(0),
	meter_reading: z.coerce.number({
		required_error: "The tank's water meter reading",
	}),
	opening_tank_reading: z.coerce.number({
		required_error: "Opening tank readings are needed",
	}),
	volume: z.number({ required_error: "volume is required" }),
});

export function Tank() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { tank } = useCustomerTankStore();
	const bottom = useBottomTabBarHeight();

	const defaultValues: CreateTankReading = {
		opening_tank_reading: 0,
		number_of_tanks: tank!.length,
		volume: 0,
		meter_reading: 0,
		reading_type: TankStockTaking["Stock Take"],
		tank: tank![0].tank,
		height: 0,
	};
	// const tanks = useMemo(() => {
	// 	let tanks: { label: string; value: string }[] = [{ label: "", value: "" }];
	// 	if (tank) {
	// 		tanks = tank.map(tk => ({ label: tk.tank_name, value: tk.tank_name }));
	// 	}
	// 	return tanks;
	// }, [tank]);

	const {
		handleSubmit,
		control,
		setValue,
		watch,
		getValues,
		reset,
		formState: { errors },
	} = useForm<CreateTankReading>({
		resolver: zodResolver(water_tanks_schema),
		defaultValues,
	});
	const { tankDetails } = useCustomerTankDetailsStore();

	const watchTank = watch("tank");
	const watchHeight = watch("height");

	useEffect(() => {
		const handleTankReadings = async () => {
			const waterTank = getValues("tank");
			const height = getValues("height");
			const retrTank = tankDetails!.filter(f => f.name === waterTank);
			const rsquare =
				(retrTank[0].diameter / 1000 / 2) * (retrTank[0].diameter / 1000 / 2);
			const volume = (Math.PI * rsquare * (height / 1000) * 1000).toFixed(2);
			setValue("volume", +volume);
		};

		handleTankReadings();
	}, [watchHeight, watchTank]);

	const handleTankStock = async (data: CreateTankReading) => {
		setIsLoading(true);
		hideKeyboard();
		const tkReading = new Tanks({ docType: "Tank Reading" });
		const res = await tkReading.createTankReading({
			data: data,
		});
		setIsLoading(false);
		if (res.data.name) {
			reset();
			ToastAndroid.show("Tank Stock Reading added successfully", 100);
		}
	};
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<KeyboardAvoidingView style={styles.container}>
				<CurrentTime />
				<View style={styles.item}>
					<Text>Tank</Text>
					<HillFreshFieldForm
						control={control}
						error={errors.tank}
						disabled={true}
						name='tank'
					/>
				</View>
				<View style={styles.item}>
					<Text>Reading Type</Text>
					<HillFreshPickerFormField
						control={control}
						error={errors.reading_type}
						items={Object.values(TankStockTaking).map(v => ({
							label: v,
							value: v,
						}))}
						name='reading_type'
					/>
				</View>
				<View style={styles.item}>
					<Text>Tank Height (mm)</Text>
					<HillFreshFieldForm
						control={control}
						error={errors.height}
						name='height'
					/>
				</View>
				<View style={styles.item}>
					<Text>Volume (Ltrs)</Text>
					<HillFreshFieldForm
						control={control}
						error={errors.volume}
						name='volume'
					/>
				</View>
				<View style={styles.item}>
					<Text>Meter Reading</Text>
					<HillFreshFieldForm
						control={control}
						error={errors.meter_reading}
						name='meter_reading'
					/>
				</View>
				<View style={{ paddingBottom: bottom / 2 }}>
					<Button
						loading={isLoading}
						onPress={handleSubmit(handleTankStock)}
						mode='contained'>
						Submit
					</Button>
				</View>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		rowGap: 15,
		padding: 8,
	},
	item: {
		paddingHorizontal: 10,
	},
});
