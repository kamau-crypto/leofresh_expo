export function formatToLocalCurrency(value: number) {
	return new Intl.NumberFormat("en-KE", {
		style: "currency",
		currency: "KES",
	}).format(value);
}
