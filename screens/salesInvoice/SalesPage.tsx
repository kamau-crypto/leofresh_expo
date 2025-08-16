import { HillFreshMenuOptions, useHillFreshTheme } from "@/components";
import { NotFound } from "@/components/illustrations";
import { appColors, ResultInvoice } from "@/constants";
import { useProfileStore } from "@/store/profile";
import { useResultStore } from "@/store/result";
import { SalesInvoice } from "@/use-cases";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	FlatList,
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Card, FAB, IconButton, Text } from "react-native-paper";
import { useGenerateSalesInvMenuItems } from "./list/hooks/hooks";
import {
	OrderItemsDialog,
	SalesInvoiceItemDialog,
} from "./list/SalesInvoiceItemDialog";
import { CompileChipStatus } from "./list/StatusChip";

export function SalesPage() {
	return (
		<View style={styles.salesContainer}>
			<SalesInvoiceFlatList />
			<CreateSalesFab />
		</View>
	);
}
//
//The create sales Fab
function CreateSalesFab() {
	const router = useRouter();
	return (
		<TouchableOpacity onPress={() => router.push("/add-sales")}>
			<FAB
				icon='plus'
				color={appColors.colors.onPrimary}
				style={{ ...styles.fab, backgroundColor: appColors.colors.primary }}
				onPress={() => router.push("/add-sales")}
			/>
		</TouchableOpacity>
	);
}
//
//The sales order flat list
function SalesInvoiceFlatList() {
	const orders = new SalesInvoice({ docType: "Sales Invoice" });
	const { limit } = useResultStore();
	const { profile } = useProfileStore();
	const [refreshing, setIsRefreshing] = useState<boolean>(true);
	const [salesInvoices, setSalesInvoices] = useState<ResultInvoice[]>([]);
	const [fetchTrigger, setFetchTrigger] = useState(0);
	const refetch = useCallback(() => {
		setIsRefreshing(true);
		setFetchTrigger(prevTrigger => prevTrigger + 1);
	}, []);

	useEffect(() => {
		const retrieveSales = async () => {
			const data = await orders.retrieveSalesInvoices({
				page_length: limit,
				project: profile!.project,
			});
			if (data) {
				setIsRefreshing(false);
				setSalesInvoices(data);
			}
		};

		retrieveSales();
	}, [fetchTrigger, profile]);

	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [])
	);

	const DATA = useMemo(() => {
		if (salesInvoices.length > 1) {
			return salesInvoices.map(s => ({
				...s,
			}));
		}
		return salesInvoices;
	}, [salesInvoices]);

	return (
		<FlatList
			ListEmptyComponent={() => (
				<View style={{ flex: 1, height: "100%" }}>
					<View
						style={{
							...styles.salesContainer,
							justifyContent: "center",
							alignItems: "center",
							paddingTop: "50%",
						}}>
						<NotFound />
						<Text
							variant='titleMedium'
							style={{
								padding: 8,
								textAlign: "center",
							}}>
							No Sales Invoices found for {profile!.customer}
						</Text>
						<Text style={{ textAlign: "center" }}>
							Click the + below to create on
						</Text>
					</View>
				</View>
			)}
			ListHeaderComponent={() => (
				<Text
					style={{
						textAlign: "center",
						backgroundColor: appColors.colors.primaryContainer,
						padding: 10,
					}}
					variant='titleLarge'>
					Sales Invoices
				</Text>
			)}
			style={{ height: "100%", width: "100%" }}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => setFetchTrigger(prevTrigger => prevTrigger + 1)}
				/>
			}
			data={DATA}
			renderItem={({ item }) => (
				<Invoice
					items={item}
					order={orders}
					refetch={refetch}
				/>
			)}
			keyExtractor={item => item.name}
		/>
	);
}

// The single Invoice item rendered in a flat list
function Invoice({
	items,
	order,
	refetch,
}: {
	items: ResultInvoice;
	order: SalesInvoice;
	refetch: () => void;
}) {
	const { theme } = useHillFreshTheme();
	const [openItemsModal, setOpenItemsModal] = useState(false);
	const [invoiceItems, setInvoiceItems] = useState<number>(0);
	const [visible, setVisible] = React.useState(false);
	const [invoiceName, setInvoiceName] = useState("");

	const { options } = useGenerateSalesInvMenuItems({
		item: items,
		invoice: order,
		refetch: refetch,
	});

	const openMenu = () => setVisible(prev => !prev);

	const closeMenu = () => setVisible(false);

	const handleCardPress = useCallback((name: string) => {
		setInvoiceName(name);
		setOpenItemsModal(prev => !prev);
	}, []);

	const hideItemsDialog = () => {
		setOpenItemsModal(prev => !prev);
	};
	const setRetrievedItems = useCallback((items: number) => {
		setInvoiceItems(items);
	}, []);

	return (
		<View
			style={{
				width: "100%",
				padding: 10,
				paddingHorizontal: 20,
			}}>
			<Card
				onPress={() => handleCardPress(items.name)}
				style={{ backgroundColor: theme.colors.primaryContainer }}>
				{/* <Card.Actions style={{ position: "absolute", right: 0 }}></Card.Actions> */}
				<Card.Title
					title={items.name}
					titleStyle={{ fontWeight: "bold", fontSize: 16 }}
					right={props => (
						<HillFreshMenuOptions
							menuItems={options}
							visible={visible}
							closeMenu={closeMenu}
							Anchor={() => (
								<IconButton
									{...props}
									icon='dots-vertical'
									onPress={openMenu}
								/>
							)}
						/>
					)}
				/>
				<Card.Content
					style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
					<View style={styles.cardItems}>
						<Text style={{ fontWeight: "bold" }}>{items.customer}</Text>
						<Text style={{ fontWeight: "bold" }}>{items.company}</Text>
					</View>
					<Text style={{ fontWeight: "bold", marginTop: 10 }}>
						{new Intl.NumberFormat("en-KE", {
							style: "currency",
							currency: "KES",
						}).format(+items.grand_total)}
					</Text>
					<Text> Created : {items.posting_date}</Text>
					<CompileChipStatus status={items.status} />
				</Card.Content>
			</Card>
			<OrderItemsDialog
				Component={() => (
					<SalesInvoiceItemDialog
						inv_name={invoiceName}
						invoiceItems={setRetrievedItems}
					/>
				)}
				hideDialog={hideItemsDialog}
				visible={openItemsModal}
				style={{
					minHeight: "50%",
					paddingHorizontal: 10,
					paddingVertical: 20,
					height: `${invoiceItems * 5 + 50}%`,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	salesContainer: {
		width: "100%",
		height: "100%",
	},
	cardItems: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		fontWeight: "bold",
	},
	chip: {
		width: "auto",
		position: "absolute",
		right: 10,
		bottom: 10,
		borderRadius: 30,
		fontWeight: "bold",
	},
	fab: {
		position: "absolute",
		borderRadius: 50,
		margin: 20,
		right: 0,
		bottom: 0,
	},
});
