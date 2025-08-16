// ["customer", "name", "status", "transaction_date","grand_total", "company"]

export enum SalesStatusEnum {
	Draft = "Draft",
	Completed = "Completed",
	Paid = "Paid",
	Unpaid = "Unpaid",
	Overdue = "Overdue",
	"Partly Paid" = "Partly Paid",
}

export enum SalesOrderEnum {
	customer = "customer",
	name = "name",
	status = "status",
	transaction_date = "transaction_date",
	grand_total = "grand_total",
	company = "company",
}
