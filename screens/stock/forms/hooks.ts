import { CreateMeterReading } from "@/constants";
import { useProfileStore } from "@/store/profile";
import { useMemo } from "react";
import {
	UseFormGetValues,
	UseFormSetError,
	UseFormSetValue,
} from "react-hook-form";

export function useCalculateBulkStock({
	setValue,
	getValues,
	setError,
}: {
	setValue: UseFormSetValue<CreateMeterReading>;
	setError: UseFormSetError<CreateMeterReading>;
	getValues: UseFormGetValues<CreateMeterReading>;
}) {
	const { profile } = useProfileStore();
	//previous water reading
	const prev = getValues("previous_reading");
	const curr = getValues("current_reading");
	// const rate = getValues("rate");
	const mpesa = getValues("mpesa");
	const cash = getValues("cash");
	const { updateCalculations } = useMemo(() => {
		const updateCalculations = () => {
			//
			// calculate the totals
			const dispensedWater = curr - prev;
			if (prev <= curr || Math.sign(dispensedWater) < 0) {
				setError(
					"current_reading",
					{
						message: "CWR should not be less than the PWR",
					},
					{ shouldFocus: true }
				);
			}
			const waste = +((profile!.waste_water / 100) * dispensedWater).toFixed(2);
			const billable_water = dispensedWater - waste;
			// const total = billable_water * rate;
			setValue("waste", waste);
			setValue("quantity", billable_water);

			if (mpesa + cash + waste !== dispensedWater) {
				setError(
					"cash",
					{
						message: "The total of Mpesa,Cash, and waste does not add up",
					},
					{ shouldFocus: true }
				);
				setError(
					"mpesa",
					{
						message: "The total of Mpesa,Cash, and waste does not add up",
						type: "onBlur",
					},
					{ shouldFocus: true }
				);
			}
		};
		return { updateCalculations };
	}, [prev, curr, mpesa, cash]);
	return { calculateStock: updateCalculations };
}
