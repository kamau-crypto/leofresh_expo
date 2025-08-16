import { useProfileStore } from "@/store/profile";
import {
	useCustomerTankDetailsStore,
	useCustomerTankReadingStore,
	useCustomerTankStore,
} from "@/store/tank";
import { useUserStore } from "@/store/user";
import { Tanks } from "@/use-cases/tank";
import { useCallback, useEffect, useState } from "react";
//
//Get the tank associated with a customer
export function useGetCustomerTank() {
	const { profile } = useProfileStore();
	const { user } = useUserStore();
	const { setTank } = useCustomerTankStore();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// const { isLoading, isError, refetch, isRefetching, data } = useQuery({
	// 	queryKey: [...queryKeys.tank.all],
	// 	queryFn: async () => {
	// 		const tankClass = new Tanks({ docType: "Tank" });

	// 		if (profile && profile.customer) {
	// 			return await tankClass.getTank({ tank_name: profile.customer });
	// 		}
	// 	},
	// });
	// if (!isLoading && !isError && data) {
	// 	setTank(data);
	// } else {
	// 	throw new HillFreshError({ message: "Failed to retrieve the tank" });
	// }

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsLoading(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		const retrieveTanks = async () => {
			if (profile && profile.customer) {
				const tankClass = new Tanks({ docType: "Tank" });
				const tanks = await tankClass.getTank({ tank_name: profile.customer });
				return setTank(tanks);
			}
			setIsLoading(false);
		};
		retrieveTanks();
	}, [profile, fetchTrigger]);

	return { refetch, isLoading };
}
//
//Latest reading from a customer's tank
export function useGetCustomerTankReading() {
	const { tank } = useCustomerTankStore();
	const { user } = useUserStore();
	const { setTankReading, setIsLoading: setIsGettingReadings } =
		useCustomerTankReadingStore();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// const { isLoading, isError, data, refetch, isRefetching } = useQuery({
	// 	queryKey: [...queryKeys.tank.tankReading],
	// 	queryFn: async () => {
	// 		const tankClass = new Tanks({ docType: "Tank Reading" });

	// 		if (tank) {
	// 			return await tankClass.getLatestTankReading({
	// 				tank: tank[0].tank,
	// 			});
	// 		}
	// 	},
	// });

	// if (!isLoading && !isError && data) {
	// 	return setTankReading(data);
	// }

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsLoading(true);
		setIsGettingReadings(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		const getTankReadings = async () => {
			if (tank) {
				const tankClass = new Tanks({ docType: "Tank Reading" });

				const readings = await tankClass.getLatestTankReading({
					tank: tank[0].tank,
				});
				setIsLoading(false);
				setIsGettingReadings(false);
				return setTankReading(readings);
			}
		};

		getTankReadings();
	}, [tank, fetchTrigger]);

	return { refetch, isLoading };
}
//
//Details about the customer's tank
export function useGetCustomerTankDetails() {
	const { tank } = useCustomerTankStore();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { setTankDetails } = useCustomerTankDetailsStore();

	// const { data, isLoading, isError, refetch, isRefetching } = useQuery({
	// 	queryKey: [...queryKeys.tank.tankDetails],
	// 	queryFn: async () => {
	// 		if (tank) {
	// 			const tankClass = new Tanks({ docType: "Tank" });
	// 			return await tankClass.getTankDetails({
	// 				tank_name: tank[0].tank,
	// 			});
	// 		}
	// 	},
	// });

	// if (!isLoading && !isError && data) {
	// 	setTankDetails(data);
	// }

	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsLoading(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		const retrieveTankDetails = async () => {
			if (tank) {
				const tankClass = new Tanks({ docType: "Tank" });
				const tkDetails = await tankClass.getTankDetails({
					tank_name: tank[0].tank,
				});
				setIsLoading(false);

				setTankDetails(tkDetails);
			}
		};
		retrieveTankDetails();
	}, [tank, fetchTrigger]);
	return { refetch, isLoading };
}
