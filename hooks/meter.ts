import { useMeterReadingStore } from "@/store/meter";
import { useProfileStore } from "@/store/profile";
import { useCustomerTankStore } from "@/store/tank";
import { Meter } from "@/use-cases/meter";
import { useCallback, useEffect, useState } from "react";

export function useRetrieveMeterReadings() {
	const { setMReading } = useMeterReadingStore();
	const { profile } = useProfileStore();
	const { tank } = useCustomerTankStore();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	// const { limit } = useResultStore();
	const meter = new Meter({
		docType: "Meter Reading",
	});

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsLoading(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		if (tank) {
			const retrieveWarehouses = async () => {
				const meter_readings = await meter.retrive_meter_readings({
					tank_name: tank[0].tank,
				});
				setMReading(meter_readings[0]);
				setIsLoading(false);
			};
			retrieveWarehouses();
		}
	}, [tank, fetchTrigger]);

	return { refetch, isLoading };
}
