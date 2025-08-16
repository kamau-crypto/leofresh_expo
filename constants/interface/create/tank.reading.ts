export interface CreateTankReading {
	tank: string;
	opening_tank_reading: number;
	meter_reading: number;
	reading_type: string;
	number_of_tanks: number,
	height: number;
	volume: number;
}

export interface CreatedTankReading {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	naming_series: string;
	tank: string;
	meter_reading: number;
	reading_type: string;
	height: number;
	volume: number;
	date: Date;
	status: string;
	doctype: string;
}
