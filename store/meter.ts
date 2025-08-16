import { ReadMeterReading } from "@/constants";
import { create } from "zustand";

type MeterReadingStore = {
	mreading: ReadMeterReading | undefined;
	setMReading: (reading: ReadMeterReading) => void;
};

export const useMeterReadingStore = create<MeterReadingStore>(set => ({
	mreading: undefined,
	setMReading: rdng =>
		set(() => ({
			mreading: rdng,
		})),
}));
