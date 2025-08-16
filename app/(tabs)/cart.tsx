import { HillFreshKeyBoardView } from "@/components";
import { CartIcon } from "@/components/illustrations";
import { appColors, commonStyles } from "@/constants";
import { useGetPurchaseProducts } from "@/hooks/products";
import {
	CreateMaterialOrderItems,
	PurchaseOrderReceptionItems,
} from "@/screens/cart";
import { CreatePurchaseOrderViaCart } from "@/screens/cart/purchaseOrder/CreatePurchaseOrder";
import { MaterialReceptionItems } from "@/screens/cart/reception/materialReceipt/MaterialReceptionItems";
import { useMaterialReqCartStore, usePurchaseCartStore } from "@/store/cart";
import {
	useMaterialReceptionStore,
	useReceptionStore,
} from "@/store/receptionstore";
import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function ShoppingCart() {
	useGetPurchaseProducts();
	const { cartItems } = usePurchaseCartStore();
	const { cartItems: mItems } = useMaterialReqCartStore(); //Not currently being used (in isolation)

	const { receptionItems } = useMaterialReceptionStore();
	const { receptionItems: receivePurchaseOrder } = useReceptionStore();
	//Account for both the Material Request Orders and the Purchase Order Request orders.
	switch (true) {
		case receptionItems && receptionItems.items.length > 0:
			return (
				<HillFreshKeyBoardView>
					<MaterialReceptionItems items={receptionItems} />
				</HillFreshKeyBoardView>
			);
		case receivePurchaseOrder && receivePurchaseOrder.items.length > 0:
			return (
				<HillFreshKeyBoardView>
					<PurchaseOrderReceptionItems items={receivePurchaseOrder} />
				</HillFreshKeyBoardView>
			);
		case cartItems && cartItems.items.length > 0:
			return (
				<HillFreshKeyBoardView>
					<CreatePurchaseOrderViaCart cartItems={cartItems} />
				</HillFreshKeyBoardView>
			);
		case mItems && mItems.items.length > 0:
			return (
				<HillFreshKeyBoardView>
					<CreateMaterialOrderItems cartItems={mItems} />
				</HillFreshKeyBoardView>
			);
		default:
			return <NoCartItems />;
	}
}

function NoCartItems() {
	return (
		<View style={commonStyles.centeredContainer}>
			<CartIcon />
			<Text
				variant='titleMedium'
				style={{ textAlign: "center" }}>
				No Items in the Cart. {"\n"}To add Items, proceed to{" "}
				<Link
					href={"/add-purchase"}
					style={{
						...commonStyles.links,
						paddingHorizontal: 10,
						color: appColors.colors.primary,
					}}>
					Create an Order
				</Link>
			</Text>
		</View>
	);
}
