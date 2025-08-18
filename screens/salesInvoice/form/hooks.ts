import {
	CreateSalesInvItem,
	CreateSalesInvoiceRecord,
	SalesInvoiceItemWiseTaxDetails,
	SalesInvoiceRecordTax,
	SalesItems,
} from "@/constants";
import { useEffect } from "react";
import {
	UseFormClearErrors,
	UseFormGetValues,
	UseFormSetError,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { CreateSalesInvoice } from "./schema";

// compile a hook to introduce VAT calculation as early as possible.
export function useSalesVAT() {
	//calculate VAT inclusive price List.
	const vatInclusivePriceList = ({ items }: { items: SalesItems[] }) => {
		return items.map(
			({ price_list_rate, tax_rate, item_tax_template, ...rest }) => {
				const taxable_rate =
					(price_list_rate ?? 0) +
					(!!tax_rate && !!item_tax_template && !!price_list_rate
						? price_list_rate * (tax_rate / 100)
						: 0);

				return {
					...rest,
					price_list_rate: taxable_rate,
					tax_rate,
					item_tax_template,
				};
			}
		);
	};

	const removeVATFromPriceList = ({
		data,
	}: {
		data: CreateSalesInvoiceRecord;
	}): CreateSalesInvoiceRecord => {
		const { items, ...rest } = data;

		const updatedItems = items.map(({ rate, tax_rate, ...rest }) => {
			const updatedRate = !!tax_rate ? (100 * rate) / (tax_rate + 100) : rate;

			return {
				...rest,
				tax_rate,
				rate: updatedRate,
			};
		});
		return { ...rest, items: updatedItems };
	};

	//Calculate Items VAT if they are vatable when posting a sales Inv
	const salesInvoiceVAT = ({
		items,
	}: {
		items: CreateSalesInvItem[];
	}): SalesInvoiceRecordTax[] => {
		//
		const taxableEntries = items.filter(item =>
			Object.values(item).every(value => !!value)
		);
		//calculate tax amount
		const itemTaxDetails = taxableEntries.map(
			({ tax_rate, item_code, rate }) => {
				const tax_amount = +(tax_rate! * rate).toPrecision(2);
				return {
					item_code,
					tax_rate,
					tax_amount,
				};
			}
		);
		// Return something like "500ml":[10, 1], for each specific item
		const taxDetails = itemTaxDetails.reduce((acc, item) => {
			acc[item.item_code] = [item.tax_rate!, item.tax_amount];
			return acc;
		}, {} as SalesInvoiceItemWiseTaxDetails);

		const taxes_charges: SalesInvoiceRecordTax = {
			charge_type: "On Net Total",
			account_head: "VAT - LBL",
			description: "VAT",
			rate: 0,
			item_wise_tax_detail: taxDetails,
		};

		return [taxes_charges];
	};
	return {
		vatInclusivePriceList,
		salesInvoiceVAT,
		removeVATFromPriceList,
	};
}

export function useCalculateGrandTotal({
	watch,
	getValues,
	setValue,
	setError,
	clearErrors,
}: {
	getValues: UseFormGetValues<CreateSalesInvoice>;
	watch: UseFormWatch<CreateSalesInvoice>;
	setValue: UseFormSetValue<CreateSalesInvoice>;
	setError: UseFormSetError<CreateSalesInvoice>;
	clearErrors: UseFormClearErrors<CreateSalesInvoice>;
}) {
	const watchMpesa = watch("mpesa");
	const watchCash = watch("cash");
	const watchBulkTotal = watch("bulk_water.total_bulk");
	const watchBottledTotal = watch("total_bottled");
	const watchGrandTotal = watch("grand_total");

	useEffect(() => {
		const handleTotal = () => {
			const mpesa = Number(getValues("mpesa"));
			const cash = +getValues("cash");
			const bulkTotal = getValues("bulk_water.total_bulk");
			const totalBottled = getValues("total_bottled");
			const grandTotal = +getValues("grand_total");
			const sumCashAndMpesa = Number(cash + mpesa);

			setValue("grand_total", totalBottled + bulkTotal);

			//
			if (grandTotal > 0) {
				if (cash > 0) {
					clearErrors("cash");
					clearErrors("mpesa");
				} else if (mpesa > 0) {
					clearErrors("cash");
					clearErrors("mpesa");
				} else {
					setError("mpesa", {
						message: "Cash or Mpesa Need to be greater than 0",
					});
					setError("cash", {
						message: "Cash or Mpesa Need to be greater than 0",
					});
				}
			}
		};

		handleTotal();
	}, [
		watchCash,
		watchBottledTotal,
		watchCash,
		watchBulkTotal,
		watchMpesa,
		watchGrandTotal,
	]);
}
