import { MenuItemProps, useSnackbar } from "@/components";
import {
	MaterialRequestEnum,
	PurchaseOrderStatusEnum,
	ReadSingleMaterialRequestData,
} from "@/constants";
import { MaterialRequest } from "@/services/material.request";
import { useMaterialReceptionStore } from "@/store/receptionstore";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { MaterialRequestWithOrigin } from "./guard";

export function useGenerateInternalProcMenuItems({
	item,
	materialRequest,
	refetch,
}: {
	item: MaterialRequestWithOrigin;
	materialRequest: MaterialRequest;
	refetch: () => void;
}): {
	options: MenuItemProps[] | null;
} {
	const { show } = useSnackbar();
	const { setReceptionItems: setReceptionStore, clearReceptionCart } =
		useMaterialReceptionStore();
	const router = useRouter();

	const { options } = useMemo(() => {
		const initialOptions: MenuItemProps[] = [
			{
				title: "Submit",
				leadingIcon: "upload",
				onPress: async () => {
					clearReceptionCart();
					await materialRequest.submitMaterialRequest({
						name: item.name,
					});
					show({ message: "Order Submitted Successfully" });
					refetch();
				},
			},
			{
				title: "Reception",
				leadingIcon: "inbox-arrow-down-outline",
				onPress: async () => {
					const pO: ReadSingleMaterialRequestData =
						await materialRequest.retrieveMaterialRequest({
							material_req: item.name,
						});
					setReceptionStore(pO);

					show({
						message:
							"Reception Items added to the cart. Taking you to the cart",
						action: {
							label: "Go To Cart",
							onPress: () => router.replace("/(tabs)/cart"),
						},
					});
					router.replace("/(tabs)/cart");
					refetch();
				},
			},
			{
				title: "Delete",
				leadingIcon: "delete",
				onPress: async () => {
					await materialRequest.deleteMaterialRequest({ name: item.name });
					show({
						message: `Order Deleted`,
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
					const result = await materialRequest.cancelRequest({
						name: item.name,
					});
					if (result.message.name) {
						show({
							message: "Successfully Cancelled this Order. A copy was created",
							action: {
								label: "Success",
							},
						});
					} else {
						show({
							message:
								"Error cancelling the  Order. Contact the Supervisor for help",
							action: {
								label: "Error",
							},
						});
					}
					refetch();
				},
			},
			{
				title: "Resend",
				leadingIcon: "restart",
				onPress: async () => {
					const order = await materialRequest.resendRequest({
						name: item.name,
					});
					show({
						message: `Order ${item.name} resent to supplier`,
					});
					refetch();
				},
			},
		];
		const options = compileMenuStates({
			initialOptions,
			status: item.status as PurchaseOrderStatusEnum,
		});
		if (!options) {
			throw new Error("Cannot print");
		}

		return { options };
	}, [item]);
	return { options };
}

function compileMenuStates({
	initialOptions,
	status,
}: {
	initialOptions: MenuItemProps[];
	status: string;
}) {
	const options = initialOptions;
	//The list of menu states that are visible based on some state when you cannot redo the action
	const submitIsCompleted = ["Submit", "Cancel", "Delete"];
	const draftState = ["Delete", "Submit"];
	const receiveAndBill = ["Submit", "Delete", "Cancel", "Resend"];

	switch (status) {
		case MaterialRequestEnum.Draft:
			return options.map(o => {
				const isDisabled = draftState.includes(o.title) ? false : true;
				return {
					...o,
					disabled: isDisabled,
				};
			});
		case MaterialRequestEnum.Submitted:
			return options.map(option => {
				const isDisabled = submitIsCompleted.includes(String(option.title))
					? true
					: false;
				return {
					...option,
					disabled: isDisabled,
				};
			});
		case MaterialRequestEnum.Pending:
			return options.map(op => {
				const isDisabled = receiveAndBill.includes(op.title!) ? true : false;
				return {
					...op,
					disabled: isDisabled,
				};
			});
		case MaterialRequestEnum.PartiallyReceived:
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
