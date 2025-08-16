//

import { MenuItemProps, useSnackbar } from "@/components";
import { ResultInvoice, SalesStatusEnum } from "@/constants";
import { SalesInvoice } from "@/services";
import { useRouter } from "expo-router";
import { useMemo } from "react";

//A custom hook to generate the menu Items
export function useGenerateSalesInvMenuItems({
	item,
	invoice,
	refetch,
}: {
	item: ResultInvoice;
	invoice: SalesInvoice;
	refetch: () => void;
}): {
	options: MenuItemProps[];
} {
	const router = useRouter();
	const { show } = useSnackbar();
	const salesInv = new SalesInvoice({ docType: "Sales Invoice" });
	const { options } = useMemo(() => {
		const initialOptions: MenuItemProps[] = [
			{
				title: "Submit",
				leadingIcon: "upload",
				onPress: async () => {
					const getInvOrder = await salesInv.retrieveSalesInvoice({
						name: item.name,
					});
					const submission = await salesInv.submitSalesInvoice({
						order: getInvOrder,
					});
					if (submission.message.name) {
						show({
							message: "Sales Invoice Submitted",
							action: {
								label: "Success",
							},
						});
					} else {
						show({
							message: "Sales Invoice Not Submitted",
							action: { label: "Error" },
						});
					}
					return refetch();
				},
			},
			{
				title: "Pay",
				leadingIcon: "cash",
				onPress: () => {
					return router.replace("/bank");
				},
			},
			{
				title: "Delete",
				leadingIcon: "delete",
				onPress: async () => {
					const result = await invoice.deleteSalesInvoice({ name: item.name });

					if (result) {
						show({
							message: "Successfully Deleted the invoice",
							action: {
								label: "Success",
							},
						});
						return refetch();
					} else {
						show({
							message:
								"Error cancelling the Invoice. Contact the Supervisor for help",
							action: {
								label: "Error",
							},
						});
						return refetch();
					}
				},
			},
			{
				title: "Cancel",
				leadingIcon: "cancel",
				onPress: async () => {
					const result = await salesInv.cancelSalesInvoice({ name: item.name });
					if (result!.message.name) {
						show({
							message:
								"Successfully Cancelled this Invoice. A copy was created",
							action: {
								label: "Success",
							},
						});
						return refetch();
					} else {
						show({
							message:
								"Error cancelling the Invoice. Contact the Supervisor for help",
							action: {
								label: "Error",
							},
						});
						return refetch();
					}
				},
			},
		];
		const options = compileMenuStates({
			initialOptions,
			status: item.status as SalesStatusEnum,
		});
		if (!options) {
			throw new Error("Cannot print");
		}

		return { options };
	}, [item]);
	return { options };
}

//
//Compiling the various options that can be used based on the status of the sales_invoice
function compileMenuStates({
	initialOptions,
	status,
}: {
	initialOptions: MenuItemProps[];
	status: string;
}) {
	const options = initialOptions;
	const submitState = ["Submit", "Cancel", "Delete"];
	const draftState = ["Submit", "Delete"];
	// const is

	switch (true) {
		case (status as SalesStatusEnum) === SalesStatusEnum.Draft:
			return options.map(o => {
				const isDisabled = draftState.includes(String(o.title)) ? false : true;
				return {
					...o,
					disabled: isDisabled,
				};
			});
		case status === SalesStatusEnum.Completed:
			return options.map(option => {
				const isDisabled = submitState.includes(String(option.title))
					? true
					: false;
				return {
					...option,
					disabled: isDisabled,
				};
			});
		case status === SalesStatusEnum.Overdue:
			return options.map(op => {
				const isDisabled = op.title !== "Pay" ? true : false;
				return {
					...op,
					disabled: isDisabled,
				};
			});
		case status === SalesStatusEnum.Unpaid:
			return options.map(op => {
				const allowedActions = submitState.filter(f => f !== "Cancel");
				// const isDisabled = allowedActions.includes(String(op.title))
				const isDisabled = op.title === "Pay" || "Cancel" ? true : false;
				return {
					...op,
					disabled: isDisabled,
				};
			});

		default:
			return options.map(op => ({
				...op,
				disabled: true,
			}));
	}
}
