export interface ReadTankReadings {
	data: ReadTankReading[];
}

export interface ReadTankReading {
	opening_reading: null;
	meter_reading: number;
	reading_type: string;
	height: number;
	volume: number;
	date: null;
	tank: string;
	tank_height: number;
	tank_num: number;
}

export interface ReadCustomerTank {
	tank: string;
}

export interface ReadTankDetails {
	name: string;
	height: number;
	diameter: number;
	high: number;
	low: number;
	low_low: number;
	dead: number;
	tank_num: number;
	calibration: number;
	correction_factor: number;
}
