import { GetPurchaseOrder } from "@/constants";
import { useEffect, useMemo, useState } from "react";

function compileReceptionData({
	purchaseOrder,
}: {
	purchaseOrder: GetPurchaseOrder;
}) {
    const newItems = purchaseOrder.items.map(({ actual_qty, amount, item_name, image }) => {
        
    })
    const toReceive = {
        
    }
}
