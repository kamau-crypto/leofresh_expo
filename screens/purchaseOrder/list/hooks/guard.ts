import { ReadMultipleMaterialRequestsData } from "@/constants";
import { ReturnedPurchaseOrder } from "@/use-cases";

export interface PurchaseOrderWithOrigin extends ReturnedPurchaseOrder {
	origin: string;
}
export interface MaterialRequestWithOrigin
	extends ReadMultipleMaterialRequestsData {
	origin: string;
}

export function isPurchaseOrder(ob: any): ob is PurchaseOrderWithOrigin {
	return ob !== null && typeof ob === "object" && "supplier" in ob;
}

export function isMaterialRequest(obj: any): obj is MaterialRequestWithOrigin {
	return (
		obj !== null && typeof obj === "object" && "material_request_type" in obj
	);
}
