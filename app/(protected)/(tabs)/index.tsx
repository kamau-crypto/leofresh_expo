import { ScrollView, StyleSheet } from "react-native";

import { appColors } from "@/constants";
import { Tanks } from "@/screens/home";
import { useProfileStore } from "@/store/profile";

import { ShopDetails } from "@/screens/home/Shop";
import { StockLevels } from "@/screens/home/StockLevels";
import { useUserStore } from "@/store/user";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect, useRouter } from "expo-router";

export default function HomeScreen() {
	const top = useHeaderHeight();
	const { profile } = useProfileStore();
	const { user } = useUserStore();

	const router = useRouter();

	useFocusEffect(() => {
		//
		//If we have a user, but not profile, redirect to settings.
		//If we have a user profile, and their user.type is of type agent, redirect to the Agent page.Rewire this logic to ensure that we have more than one app ready for usage.
		if (user && user.type !== "Agent" && !profile?.customer) {
			router.push("/(protected)/settings");
		} else {
			if (user!.type === "Agent") {
				return router.replace("/(protected)/agent");
			}
		}
	});

	return (
		<ScrollView
			contentContainerStyle={{
				paddingTop: top,
				...styles.container,
				paddingBottom: 10,
			}}>
			<ShopDetails />
			<Tanks />
			<StockLevels />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		rowGap: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		padding: 10,
		textAlign: "center",
	},
	card: {
		width: "80%",
		borderRadius: 10,
		padding: 4,
		alignContent: "center",
		backgroundColor: appColors.colors.surfaceVariant,
	},
});
