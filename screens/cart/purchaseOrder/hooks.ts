import {
	CreateMaterialRequest,
	MaterialRequestItem,
	PurchaseOrderDetails,
	ReadPOSProfile,
} from "@/constants";
import { MaterialRequest, PurchaseOrder } from "@/use-cases";

export async function createPurchaseOrder({
	data,
	purchaseOrder,
	naming_series,
}: {
	data: PurchaseOrderDetails;
	purchaseOrder: PurchaseOrder;
	naming_series: string;
}) {
	const items = data.items.map(
		({ item_name, amount, qty, rate, uom, item_code, conversion_factor }) => ({
			item_name,
			item_code,
			amount: Math.round(amount * conversion_factor),
			qty,
			rate: Math.round(rate * conversion_factor),
			uom,
			conversion_factor,
		})
	);

	const pOrder = { ...data, items: items, naming_series };

	const res = await purchaseOrder.createPurchaseOrder({ order: pOrder });

	return res.data.name;
}

export async function createInternalProcurement({
	data,
	materialRequest,
	profile,
}: {
	data: PurchaseOrderDetails;
	materialRequest: MaterialRequest;
	profile: ReadPOSProfile;
}) {
	const items: MaterialRequestItem[] = data.items.map(
		({ item_code, item_name, qty, uom }) => ({
			item_name,
			item_code,
			qty,
			uom,
			schedule_date: data.schedule_date,
			from_warehouse: profile!.source_warehouse,
			warehouse: profile!.warehouse_name,
		})
	);
	const materialReqData: CreateMaterialRequest = {
		company: data.company,
		material_request_type: "Material Transfer",
		schedule_date: new Date(),
		set_from_warehouse: profile!.source_warehouse,
		purpose: `Material Transfer`,
		set_warehouse: profile!.warehouse_name,
		items,
	};

	const res = await materialRequest.createMaterialRequest({
		data: materialReqData,
	});
	return res.name;
}
