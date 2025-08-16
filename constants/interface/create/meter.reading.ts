export interface CreateMeterReading {
	quantity: number;
	cash: number;
	mpesa: number;
	waste: number;
	naming_series: string;
	variation: number;
	created_by: string;
	previous_reading: number;
	current_reading: number;
	status: string;
	tank: string;
}

export interface CreatedMeterReading {
	data: CreatedMeterReadingValue;
}

export interface CreatedMeterReadingValue {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	naming_series: string;
	quantity: number;
	variation: number;
	previous_reading: number;
	current_reading: number;
	created_by: string;
	date: Date;
	status: string;
	tank: string;
	doctype: string;
}
