import { MenuItemProps, useSnackbar } from "@/components";
import { GetPurchaseOrder, PurchaseOrderStatusEnum } from "@/constants";
import { PurchaseOrder } from "@/services";
import { useReceptionStore } from "@/store/receptionstore";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { PurchaseOrderWithOrigin } from "./guard";

export function useGeneratePurchaseOrderMenuItems({
	item,
	purchaseOrder,
	refetch,
}: {
	item: PurchaseOrderWithOrigin;
	purchaseOrder: PurchaseOrder;
	refetch: () => void;
}): {
	options: MenuItemProps[];
} {
	const { show } = useSnackbar();
	const { setReceptionItems: setReceptionStore, clearReceptionCart } =
		useReceptionStore();
	const router = useRouter();

	const { options } = useMemo(() => {
		const initialOptions: MenuItemProps[] = [
			{
				title: "Submit",
				leadingIcon: "upload",
				onPress: async () => {
					await purchaseOrder.submitPurchaseOrder({
						name: item.name,
					});
					show({ message: "Purchase Order Submitted Successfully" });
					refetch();
				},
			},
			{
				title: "Reception",
				leadingIcon: "inbox-arrow-down-outline",
				onPress: async () => {
					clearReceptionCart();
					const pO: GetPurchaseOrder =
						await purchaseOrder.retrievePurchaseOrder({ name: item.name });
					setReceptionStore(pO);
					show({
						message: "Reception Items added to the cart",
						action: {
							label: "Go To Cart",
							onPress: () => router.replace("/(protected)/(tabs)/cart"),
						},
					});
					router.replace("/(protected)/(tabs)/cart");
					refetch();
				},
			},
			{
				title: "Delete",
				leadingIcon: "delete",
				onPress: async () => {
					await purchaseOrder.deletePurchaseOrder({ name: item.name });
					show({
						message: `Purchase Order Deleted`,
						action: {
							label: "Success",
						},
					});
					refetch();
				},
			},
			{
				title: "Cancel",
				leadingIcon: "cancel",
				onPress: async () => {
					const result = await purchaseOrder.cancelPurchaseOrder({
						name: item.name,
					});
					if (result.message.name) {
						show({
							message:
								"Successfully Cancelled this Purchase Order. A copy was created",
							action: {
								label: "Success",
							},
						});
						refetch();
					} else {
						show({
							message:
								"Error cancelling the Purchase Order. Contact the Supervisor for help",
							action: {
								label: "Error",
							},
						});
						refetch();
					}
				},
			},
			{
				title: "Resend",
				leadingIcon: "restart",
				onPress: async () => {
					const order = await purchaseOrder.resendPurchaseOrder({
						name: item.name,
					});
					show({
						message: `Purchase Order ${item.name} resent to supplier ${item.supplier}`,
					});
					refetch();
				},
			},
		];

		const options = compileMenuStates({
			initialOptions,
			status: item.status,
		});

		if (!options) {
			throw new Error("Cannot print");
		}

		return { options };
	}, [item, purchaseOrder, show, setReceptionStore, router]);

	return { options };
}

function compileMenuStates({
	initialOptions,
	status,
}: {
	initialOptions: MenuItemProps[];
	status: string;
}): MenuItemProps[] {
	const options = initialOptions;
	const submitIsCompleted = ["Submit", "Cancel", "Delete"];
	const draftState = ["Delete", "Submit"];
	const receiveAndBill = ["Submit", "Delete", "Cancel", "Resend"];

	switch (status) {
		case PurchaseOrderStatusEnum.DRAFT:
			return options.map(o => {
				const isDisabled = draftState.includes(o.title) ? false : true;
				return {
					...o,
					disabled: isDisabled,
				};
			});
		case PurchaseOrderStatusEnum.ON_HOLD:
			return options.map(option => {
				const isDisabled = submitIsCompleted.includes(String(option.title))
					? true
					: false;
				return {
					...option,
					disabled: isDisabled,
				};
			});
		case PurchaseOrderStatusEnum.TO_RECEIVE_AND_BILL:
			return options.map(op => {
				const isDisabled = receiveAndBill.includes(op.title!) ? true : false;
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
