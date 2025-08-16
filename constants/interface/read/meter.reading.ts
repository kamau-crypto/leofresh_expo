export interface ReadMeterReadings {
	data: ReadMeterReading[];
}

export interface ReadMeterReading {
	name: string;
	quantity: string;
	variation: string;
	previous_reading: string;
	current_reading: string;
	created_by: string;
	date: Date;
	tank: string;
}
