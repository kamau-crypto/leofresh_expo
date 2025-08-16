import { CreatedSalesInvoice, SalesInvoiceItem } from "@/constants";
import { CustomChip } from "@/screens/internalOrder/list/Chip";
import { SalesInvoice } from "@/services";
import { formatToLocalCurrency } from "@/utils/format";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";
import {
	ActivityIndicator,
	Dialog,
	Divider,
	Portal,
	Text,
} from "react-native-paper";

export function SalesInvoiceItemDialog({
	inv_name,
	invoiceItems,
}: {
	inv_name: string;
	invoiceItems: (items: number) => void;
}) {
	const [invItems, setInvItems] = useState<CreatedSalesInvoice | undefined>(
		undefined
	);

	const salesInv = new SalesInvoice({ docType: "Sales Invoice" });

	useEffect(() => {
		const retrieveInvDetails = async () => {
			if (inv_name.length > 1) {
				const invDetails = await salesInv.retrieveSalesInvoice({
					name: inv_name,
				});
				if (invDetails) {
					setInvItems(invDetails);
					invoiceItems(invDetails.items.length);
				}
			}
		};

		retrieveInvDetails();
	}, [inv_name]);

	if (!invItems) {
		return <ActivityIndicator size={"small"} />;
	}

	return (
		<ScrollView contentContainerStyle={{ flex: 1, width: "100%" }}>
			<Text
				style={{ textAlign: "center" }}
				variant='titleMedium'>
				SALES INVOICE DETAILS
			</Text>
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					rowGap: 9,
					paddingVertical: 5,
					paddingHorizontal: 10,
				}}>
				{invItems.items.map(item => (
					<View key={item.name}>
						<InvoiceItem item={item} />
						<Divider bold={true} />
					</View>
				))}
			</View>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					columnGap: 2,
					rowGap: 5,
					flexWrap: "wrap",
				}}>
				<CustomChip
					text={` Total : ${formatToLocalCurrency(invItems.total)}`}
				/>
				<CustomChip
					text={`Mpesa : ${formatToLocalCurrency(invItems.mpesa_amount)}`}
				/>
				<CustomChip
					text={` Cash : ${formatToLocalCurrency(invItems.cash_amount)} `}
				/>
				<Divider style={{ height: 4 }} />
				<CustomChip text={`Weather : ${invItems.weather}`} />

				<CustomChip
					text={`Created : ${format(
						invItems.creation,
						"yyyy-MM-dd HH:mm:ss"
					)} `}
				/>
				<CustomChip
					text={`Posted : ${format(
						invItems.posting_date,
						"yyyy-MM-dd HH:mm:ss"
					)} `}
				/>
				<CustomChip
					text={`Due : ${format(invItems.due_date, "yyyy-MM-dd HH:mm:ss")} `}
				/>
				<CustomChip text={`Created By : ${invItems.owner}`} />
			</View>
		</ScrollView>
	);
}

function InvoiceItem({ item }: { item: SalesInvoiceItem }) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				flexWrap: "wrap",
				alignItems: "center",
				justifyContent: "space-around",
				padding: 3,
			}}>
			<Text>
				{`${item.qty} ${item.uom}`}
				{item.qty > 1 ? "s" : null}
			</Text>
			<Text>{item.item_name}</Text>
			<Text>@{`${item.rate}`}</Text>
			<Text>{` = ${item.amount}`}</Text>
		</View>
	);
}

export const OrderItemsDialog = ({
	Component,
	hideDialog,
	visible,
	style,
}: {
	Component: React.ComponentType;
	hideDialog: () => void;
	visible: boolean;
	style: StyleProp<ViewStyle>;
}) => {
	return (
		<Portal>
			<Dialog
				style={{ display: "flex", maxHeight: "95%" }}
				visible={visible}
				onDismiss={hideDialog}>
				<Dialog.Content style={style}>
					<ScrollView>
						<Component />
					</ScrollView>
				</Dialog.Content>
			</Dialog>
		</Portal>
	);
};
