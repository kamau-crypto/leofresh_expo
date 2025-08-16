import { useProfileStore } from "@/store/profile";
import { useCallback } from "react";
import {
	UseFormSetError,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { CreateSalesInvoice } from "./schema";

interface WaterCalculationParams {
	setValue: UseFormSetValue<CreateSalesInvoice>;
	watch: UseFormWatch<CreateSalesInvoice>;
	setError: UseFormSetError<CreateSalesInvoice>;
}

export const useWaterCalculations = ({
	setValue,
	watch,
	setError,
}: WaterCalculationParams) => {
	const { profile } = useProfileStore();
	const calculateWaterValues = useCallback(() => {
		const previousReading = Number(
			watch("bulk_water.previous_water_reading") || 0
		);
		const currentReading = +Number(
			watch("bulk_water.current_water_reading") || 0
		).toFixed(3);
		const waterRate = Number(watch("bulk_water.rate") || 0);
		let updatedPrevWR = +previousReading.toFixed(3);
		//
		// Consider the following edge cases associated with water meters.
		// The upper bound of a water meter is 9,999,999.9 while its lowest bound
		// is 0,000,000,000. Consider the upper bound when making new water reading adjustments

		if (updatedPrevWR === 9999999.9) {
			updatedPrevWR = 0;
		}
		// Only perform calculations if we have valid readings
		if (currentReading >= updatedPrevWR) {
			const waterUsed = +(currentReading - updatedPrevWR);
			// Calculate 4% waste
			const wasteWater = waterUsed * (profile!.waste_water / 100);

			// Calculate billable water (water sold minus waste)
			const billableWater = Math.round(waterUsed - wasteWater);

			// Calculate water amount (billable water * rate)
			const waterAmount = billableWater * waterRate;

			// Update form values
			setValue("bulk_water.water_used", +waterUsed.toFixed(4), {
				shouldValidate: true,
			});
			setValue("bulk_water.waste", wasteWater, { shouldValidate: true });
			setValue("bulk_water.billable_water", Math.round(billableWater), {
				shouldValidate: true,
			});

			// Update grand total
			const currentGrandTotal = Number(watch("bulk_water.total_bulk") || 0);

			// Subtract previous water amount (if any) and add new water amount
			const newGrandTotal = waterAmount;
			setValue("bulk_water.total_bulk", Math.round(+newGrandTotal), {
				shouldValidate: true,
			});
		} else {
			return setError("bulk_water.current_water_reading", {
				message: "Invalid Reading,\n CWR should not be less than PWR",
			});
		}
	}, [setValue, watch]);

	// Return the calculation function so it can be called manually if needed
	return calculateWaterValues;
};
