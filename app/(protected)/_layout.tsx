import { HillFreshHeader } from "@/components";
import { useUserStore } from "@/store/user";
import { Redirect, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProtectedLayout() {
	const { user } = useUserStore();
	const { top } = useSafeAreaInsets();
	const store_key = SecureStore.getItem("auth_token");

	if (!user || !store_key) {
		return <Redirect href={"/login"} />;
	}
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerTransparent: true,
				statusBarHidden: false,
				header: () => (
					<View style={{ paddingTop: top }}>
						<HillFreshHeader />
					</View>
				),
			}}>
			<Stack.Screen
				name='(tabs)'
				options={{ headerShown: true, fullScreenGestureShadowEnabled: true }}
			/>
			<Stack.Screen
				name='add-expense'
				options={{ headerShown: true, fullScreenGestureShadowEnabled: true }}
			/>
			<Stack.Screen
				name='add-purchase'
				options={{ headerShown: true, fullScreenGestureShadowEnabled: true }}
			/>
			<Stack.Screen
				name='add-request'
				options={{ headerShown: true, fullScreenGestureShadowEnabled: true }}
			/>
			<Stack.Screen
				name='add-sales'
				options={{ headerShown: true, fullScreenGestureShadowEnabled: true }}
			/>
			<Stack.Screen
				name='agent'
				options={{ headerShown: true, fullScreenGestureShadowEnabled: true }}
			/>
			<Stack.Screen
				name='settings'
				options={{
					headerShown: false,
					fullScreenGestureShadowEnabled: true,
					presentation: "fullScreenModal",
				}}
			/>
		</Stack>
	);
}
