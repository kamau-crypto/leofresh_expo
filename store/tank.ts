import {
	ReadCustomerTank,
	ReadTankDetails,
	ReadTankReading,
} from "@/constants";
import { create } from "zustand";

//
//Store to hold the tank associated with a customer
type CustomerTank = {
	tank: undefined | ReadCustomerTank[];
	setTank: (tanks: ReadCustomerTank[]) => void;
};

export const useCustomerTankStore = create<CustomerTank>(set => ({
	tank: undefined,
	setTank: tanks =>
		set(() => ({
			tank: tanks,
		})),
}));
//
//Store to hold the tank readings for a certain customer
type CustomerTankReading = {
	isLoading: boolean;
	setIsLoading: (v: boolean) => void;
	tankReading: undefined | ReadTankReading[];
	setTankReading: (readings: ReadTankReading[]) => void;
};

export const useCustomerTankReadingStore = create<CustomerTankReading>(set => ({
	isLoading: false,
	tankReading: undefined,
	setIsLoading: v =>
		set(() => ({
			isLoading: v,
		})),
	setTankReading: readings =>
		set(() => ({
			tankReading: readings,
		})),
}));
//
//Store to hold the tank Details for a certain store
type CustomerTankDetails = {
	tankDetails: undefined | ReadTankDetails[];
	setTankDetails: (details: ReadTankDetails[]) => void;
};

export const useCustomerTankDetailsStore = create<CustomerTankDetails>(set => ({
	tankDetails: undefined,
	setTankDetails: tnkDetails =>
		set(() => ({
			tankDetails: tnkDetails,
		})),
}));
