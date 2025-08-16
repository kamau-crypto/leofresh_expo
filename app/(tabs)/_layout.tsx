import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable } from "react-native";

import { useHillFreshTheme, useSession } from "@/components";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { appColors } from "@/constants/theme";
import { ActivityIndicator, Icon, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
	const clientValue = useClientOnlyValue(false, true);

	const { isLoading, session } = useSession();
	const { theme } = useHillFreshTheme();
	if (isLoading) {
		return (
			<ActivityIndicator
				style={{ flex: 1 }}
				size={"large"}
				animating={true}
			/>
		);
	}

	if (!session) {
		return <Redirect href={"/login"} />;
	}
	return (
		<SafeAreaView
			style={{ flex: 1 }}
			edges={["right", "bottom", "left"]}>
			<Tabs
				screenOptions={{
					tabBarHideOnKeyboard: true,
					tabBarActiveTintColor: theme.colors.primary,
					tabBarLabelStyle: { fontSize: 14 },
					tabBarStyle: {
						height: Platform.select({
							ios: 80,
							android: 60,
						}),
						// elevation:0,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: theme.colors.onPrimary,
					},
					tabBarItemStyle: {
						height: Platform.select({
							ios: 80,
							android: 60,
						}),
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						alignContent: "center",
					},
					// : appColors.colors.primaryContainer,
					// Disable the static render of the header on web
					// to prevent a hydration error in React Navigation v6_.
					headerShown: clientValue,
				}}>
				<Tabs.Screen
					name='index'
					options={{
						headerShown: false,
						title: "Home",
						tabBarIcon: ({ color }) => (
							<FontAwesome
								name='home'
								size={25}
								color={color}
							/>
						),
						headerRight: () => (
							<Link
								href='/settings'
								asChild>
								<Pressable>
									{({ pressed }) => (
										<IconButton
											icon='cog'
											iconColor={appColors.colors.onSurfaceVariant}
											size={25}
											style={{ marginRight: 15, opacity: pressed ? 0.8 : 1 }}
										/>
									)}
								</Pressable>
							</Link>
						),
					}}
				/>
				<Tabs.Screen
					name='sales'
					options={{
						headerShown: false,
						title: "Sales",
						tabBarIcon: ({ color }) => (
							<Icon
								source='sale'
								size={25}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='cart'
					options={{
						href: null,
						headerShown: false,
						title: "cart",
						tabBarIcon: ({ color }) => (
							<Icon
								source='cart'
								size={25}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='purchases'
					options={{
						headerShown: false,
						title: "Orders",
						tabBarIcon: ({ color }) => (
							<Icon
								source='shopping'
								size={25}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='bank'
					options={{
						headerShown: false,
						title: "Bank",
						tabBarIcon: ({ color }) => (
							<Icon
								source='bank'
								size={25}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='expenses'
					options={{
						headerShown: false,
						title: "Expenses",
						tabBarIcon: ({ color }) => (
							<Icon
								source='wallet'
								size={25}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='stock'
					options={{
						headerShown: false,
						title: "Stock",
						tabBarIcon: ({ color }) => (
							<Icon
								source='store'
								size={25}
								color={color}
							/>
						),
					}}
				/>
			</Tabs>
		</SafeAreaView>
	);
}
