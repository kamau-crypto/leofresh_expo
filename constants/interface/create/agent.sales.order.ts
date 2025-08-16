export interface CreateAgentSalesOrder {
	data: CreateAgentSalesOrderData;
}

export interface CreateAgentSalesOrderData {
	quotation?: string;
	customer: string;
	items: CreateAgentSalesItem[];
	delivery_date: string;
	company: string;
	transaction_date: string;
}

export interface CreateAgentSalesItem {
	item_code: string;
	item_name: string;
	qty: number;
	rate: number;
	price_list: string;
	uom: string;
}

export interface CreateAgentSalesInvoice {
	data: CreateAgentSalesInvoiceData;
}

export interface CreateAgentSalesInvoiceData {
	customer: string;
	items: CreateAgentSalesInvoiceItem[];
	due_date: Date;
	company: string;
	posting_date: Date;
	is_pos: number;
}

export interface CreateAgentSalesInvoiceItem {
	item_code: string;
	qty: number;
	rate: number;
	sales_order: string;
}
