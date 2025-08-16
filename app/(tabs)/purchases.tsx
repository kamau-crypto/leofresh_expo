import { HillFreshKeyBoardView } from "@/components";
import { useGetPurchaseProducts } from "@/hooks/products";
import { PurchasePage } from "@/screens/purchaseOrder/list/PurchasePage";
import React from "react";

export default function Purchases() {
	useGetPurchaseProducts();
	return (
		<HillFreshKeyBoardView>
			<PurchasePage />
		</HillFreshKeyBoardView>
	);
}
