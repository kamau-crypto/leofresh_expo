import { appColors } from "@/constants";
import { useMaterialReqCartStore, usePurchaseCartStore } from "@/store/cart";
import {
	useMaterialReceptionStore,
	useReceptionStore,
} from "@/store/receptionstore";
import { useUserStore } from "@/store/user";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Icon } from "react-native-paper";

export function HillFreshHeader() {
	const router = useRouter();

	const { user } = useUserStore();
	return (
		<View style={styles.header}>
			<Image
				style={styles.logo}
				source={require("@/assets/hillfresh/logo.png")}
			/>
			<View style={styles.cartUser}>
				{user && user.type !== "Agent" ? (
					<TouchableOpacity onPress={() => router.replace("/(tabs)/cart")}>
						<View style={{ flexDirection: "row", position: "relative" }}>
							<NotificationHeaderCart />
						</View>
					</TouchableOpacity>
				) : null}
				<TouchableOpacity onPress={() => router.push("/settings")}>
					<Link
						href='/settings'
						asChild>
						<Image
							style={styles.userIcon}
							source={require("@/assets/hillfresh/shop-attendant.png")}
						/>
					</Link>
				</TouchableOpacity>
			</View>
		</View>
	);
}

function NotificationHeaderCart() {
	const { cartItems } = useMaterialReqCartStore();
	const { cartItems: purchaseOrder } = usePurchaseCartStore();
	const { receptionItems: moRitems } = useMaterialReceptionStore();
	const { receptionItems: poRitems } = useReceptionStore();

	if (
		(cartItems && cartItems!.items && cartItems.items.length > 0) ||
		(purchaseOrder && purchaseOrder!.items && purchaseOrder.items.length > 0) ||
		(moRitems && moRitems!.items && moRitems.items.length > 0) ||
		(poRitems && poRitems!.items && poRitems.items.length > 0)
	) {
		return (
			<>
				<Icon
					source='cart'
					size={30}
				/>
				<Badge
					size={10}
					style={{ bottom: "70%", right: "10%" }}
				/>
			</>
		);
	}

	return (
		<Icon
			source='cart'
			size={30}
		/>
	);
}

const styles = StyleSheet.create({
	header: {
		width: "100%",
		padding: 10,
		height: 60,
		backgroundColor: appColors.colors.inversePrimary,
		alignItems: "center",
		justifyContent: "space-between",
		display: "flex",
		flexDirection: "row",
	},
	logo: {
		padding: 10,
		justifyContent: "flex-start",
		height: 50,
		width: 120,
		borderRadius: 10,
	},
	cartUser: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: 5,
	},
	userIcon: {
		width: 50,
		height: 50,
		backgroundColor: appColors.colors.onPrimary,
		borderRadius: 50,
	},
});
