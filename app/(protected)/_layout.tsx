import { useSession } from "@/components";
import { useUserStore } from "@/store/user";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
	const { session } = useSession();
	const { user } = useUserStore();

	if (!session || !user) {
		return <Redirect href={"/login"} />;
	}
	return (
		<Stack>
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
				}}
			/>
		</Stack>
	);
}
