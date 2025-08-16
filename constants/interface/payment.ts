export interface PaymentSchedule {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	due_date: Date;
	invoice_portion: number;
	discount: number;
	payment_amount: number;
	outstanding: number;
	paid_amount: number;
	discounted_amount: number;
	base_payment_amount: number;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
}
