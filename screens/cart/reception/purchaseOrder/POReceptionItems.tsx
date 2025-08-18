import {
	HillFreshFieldForm,
	HillFreshPickerFormField,
	useSnackbar,
} from "@/components";
import {
	appColors,
	CreatePurchaseReceipt,
	GetPurchaseOrder,
} from "@/constants";
import { useGetSuppliers } from "@/hooks/supplier";
import { PurchaseInvoice } from "@/services/purchase.invoice";
import { PurchaseReceipt } from "@/services/purchase.receipt";
import { useProfileStore } from "@/store/profile";
import { useReceptionStore } from "@/store/receptionstore";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CreatePurchaseInvoice, createPurchaseInvoiceSchema } from "../schema";

export function PurchaseOrderReceptionItems({
	items,
}: {
	items: GetPurchaseOrder;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [purchaseInvoice, setPurchaseInvoice] =
		useState<GetPurchaseOrder>(items);
	const { suppliers } = useGetSuppliers();
	const { profile } = useProfileStore();
	const purchaseRecpt = new PurchaseReceipt({ docType: "Purchase Receipt" });
	const purchaseInv = new PurchaseInvoice({ docType: "Purchase Invoice" });

	const { itemsToView, prodSuppliers } = useMemo(() => {
		const itemsToView = purchaseInvoice.items.map(
			({
				qty,
				uom,
				amount,
				item_name,
				rate,
				item_code,
				received_qty,
				name,
			}) => ({
				qty: qty - received_qty,
				uom,
				amount,
				item_name,
				rate,
				item_code,
				name,
			})
		);
		const prodSuppliers = suppliers.map(({ supplier_name }) => ({
			label: supplier_name,
			value: supplier_name,
		}));
		return { itemsToView, prodSuppliers };
	}, [items, suppliers]);

	const defaultValues: CreatePurchaseInvoice = {
		delivery_date: new Date(items.schedule_date),
		delivery_note: "",
		driver_name: "",
		items: itemsToView,
		supplier: purchaseInvoice.supplier,
		reg_no: "",
	};

	const methods = useForm<CreatePurchaseInvoice>({
		defaultValues,
		resolver: zodResolver(createPurchaseInvoiceSchema),
	});
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = methods;
	const { show } = useSnackbar();
	const router = useRouter();
	const { clearReceptionCart } = useReceptionStore();

	const handleCreatePurchaseInvoice = async (data: CreatePurchaseInvoice) => {
		setIsLoading(true);
		const deliveredItems = data.items.filter(d => d.qty > 0);
		//Create and submit purchase Receipt first before proceeding
		const purchaseReceiptData: CreatePurchaseReceipt = {
			company: profile!.company,
			transporter_name: data.driver_name,
			items: deliveredItems!.map(item => ({
				purchase_order_item: item.name,
				item_code: item.item_code,
				item_name: item.item_name,
				against_purchase_order: items.name,
				purchase_order: items.name,
				qty: item.qty,
				rate: item.rate,
				warehouse: profile!.warehouse_name,
			})),
			posting_date: format(data.delivery_date, "yyyy-MM-dd"),
			lr_no: data.reg_no,
			supplier: data.supplier,
			supplier_delivery_note: data.delivery_note,
		};
		//Create a Purchase Receipt
		const createPR = await purchaseRecpt.createAndSubmitPurchaseReceipt({
			data: purchaseReceiptData,
		});

		if (createPR.name || items.per_received === 100) {
			await purchaseInv.purchasesInvoiceCycle({
				purchaseOrder: items.name,
			});
			setIsLoading(false);
			clearReceptionCart();
			router.replace("/(protected)/(tabs)/purchases");
			show({ message: "Purchase Invoice Created Successfully" });
		} else {
			clearReceptionCart();
			setIsLoading(false);
			show({ message: "Purchase Receipt Created Successfully" });
			router.replace("/(protected)/(tabs)/purchases");
		}
		return;
	};

	return (
		<ScrollView style={styles.container}>
			<FormProvider {...methods}>
				<HillFreshPickerFormField<CreatePurchaseInvoice>
					defaultValue={defaultValues.supplier}
					control={control}
					placeholder='Pick A Supplier'
					error={errors.supplier}
					items={prodSuppliers}
					name='supplier'
				/>
				<DeliveryDatePicker />
				<View style={styles.list}>
					<HillFreshFieldForm<CreatePurchaseInvoice>
						labelText='Delivery Note'
						style={styles.input}
						name='delivery_note'
						control={control}
						error={errors.delivery_note}
						defaultValue={defaultValues.delivery_note}
						dense={true}
					/>
					<HillFreshFieldForm<CreatePurchaseInvoice>
						style={styles.input}
						labelText='Driver Name'
						name='driver_name'
						control={control}
						error={errors.driver_name}
						dense={true}
					/>
					<HillFreshFieldForm<CreatePurchaseInvoice>
						labelText='Vehicle Number Plate'
						style={styles.input}
						name='reg_no'
						control={control}
						error={errors.reg_no}
						dense={true}
					/>
				</View>
				<View style={styles.listItems}>
					{items.items.map(({ image, item_name, qty, rate, uom }, i) => (
						<View
							key={item_name}
							style={styles.item}>
							<View style={{ display: "flex", flexDirection: "column" }}>
								<Text variant='titleLarge'>{item_name}</Text>
								<Text variant='bodyMedium'>{uom}</Text>
							</View>
							<HillFreshFieldForm<CreatePurchaseInvoice>
								labelText='Quantity'
								name={`items.${i}.qty`}
								disabled={qty === 0 ? true : false}
								control={control}
								error={errors.items && errors.items[i]?.qty}
								keyBoardType='numeric'
								dense={true}
								defaultValue={qty}
							/>
						</View>
					))}
				</View>
				<Button
					loading={isLoading}
					disabled={isLoading}
					style={{ padding: 4, marginTop: 10 }}
					mode='contained'
					onPress={handleSubmit(handleCreatePurchaseInvoice)}>
					Submit
				</Button>
			</FormProvider>
		</ScrollView>
	);
}

function DeliveryDatePicker() {
	const {
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<CreatePurchaseInvoice>();
	const updateDate = (date: Date | undefined) => {
		//update the formik value with the proper values...
		setValue("delivery_date", date ?? new Date());
	};
	return (
		<SafeAreaProvider>
			<View
				style={{
					padding: 4,
					backgroundColor: appColors.colors.onPrimary,
					gap: 8,
				}}>
				<Text variant='titleMedium'>Delivery Date</Text>
				<DatePickerInput
					locale='en'
					label={"Delivery Date"}
					value={new Date()}
					onChange={d => updateDate(d)}
					inputMode='start'
					style={{ width: 200 }}
					validRange={{
						startDate: new Date(),
						endDate: addDays(new Date(), 5),
					}}
					mode='outlined'
				/>
				{errors.delivery_date && (
					<Text style={{ color: "red" }}>{errors.delivery_date.message}</Text>
				)}
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 4,
		display: "flex",
		flexDirection: "column",
		width: "100%",
		height: "auto",
		gap: 5,
		paddingHorizontal: 10,
	},
	list: {
		display: "flex",
		flexDirection: "column",
		width: "auto",
		minWidth: 200,
		gap: 3,
		alignItems: "stretch",
	},
	item: {
		display: "flex",
		flexDirection: "row",
		paddingHorizontal: 10,
		justifyContent: "space-between",
		alignItems: "center",
	},
	input: {
		width: "auto",
	},
	text: {
		fontWeight: "bold",
	},
	listItems: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center",
		gap: 5,
		borderRadius: 5,
		backgroundColor: appColors.colors.onPrimary,
	},
});
