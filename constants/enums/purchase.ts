export enum PurchaseOrderStatusEnum {
	DRAFT = "Draft", // The initial state when the purchase order is created but not submitted.
	TO_RECEIVE_AND_BILL = "To Receive and Bill", // Items are yet to be received and billed.
	TO_RECEIVE = "To Receive", // Items are yet to be received.
	TO_BILL = "To Bill", // Items are received, but billing is pending.
	COMPLETED = "Completed", // All items are received and billed.
	CANCELLED = "Cancelled", // The purchase order is cancelled.
	CLOSED = "Closed", // The purchase order is manually closed.
	ON_HOLD = "On Hold", // The purchase order is put on hold.
	UNDER_REVIEW = "Under Review", // The purchase order is under review.
	PARTIALLY_RECEIVED = "Partially Received", // Some items are received, but not all.
	PARTIALLY_BILLED = "Partially Billed", // Some items are billed, but not all.
}

export enum PurchaseInvoiceFieldsEnum {
	"cost_center" = "cost_center",
	"name" = "name",
	"project" = "project",
	"items" = "items",
	"posting_date" = "posting_date",
	"due_date" = "due_date",
	"status" = "status",
	"grand_total" = "grand_total",
	"company" = "company",
}


