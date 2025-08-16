import {
	SessionProvider,
	ThemeProvider,
	useHillFreshTheme,
} from "@/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { registerTranslation } from "react-native-paper-dates";
import "react-native-reanimated";
import { SnackBarProvider } from "../components/context/SnackBarContext";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/Quicksand.ttf"),
	});

	// translations for react native paper date picker
	registerTranslation("en", {
		save: "Save",
		selectSingle: "Select date",
		selectMultiple: "Select dates",
		selectRange: "Select period",
		notAccordingToDateFormat: inputFormat =>
			`Date format must be ${inputFormat}`,
		mustBeHigherThan: date => `Must be later then ${date}`,
		mustBeLowerThan: date => `Must be earlier then ${date}`,
		mustBeBetween: (startDate, endDate) =>
			`Must be between ${startDate} - ${endDate}`,
		dateIsDisabled: "Day is not allowed",
		previous: "Previous",
		hour: "",
		minute: "",
		next: "Next",
		typeInDate: "Type in date",
		pickDateFromCalendar: "Pick date from calendar",
		close: "Close",
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider>
			<ThemedApp />
		</ThemeProvider>
	);
}

function ThemedApp() {
	const { theme } = useHillFreshTheme();
	const queryClient = new QueryClient();

	return (
		<PaperProvider theme={theme}>
			<SnackBarProvider>
				<QueryClientProvider client={queryClient}>
					<SessionProvider>
						<RootLayoutNav />
					</SessionProvider>
				</QueryClientProvider>
			</SnackBarProvider>
		</PaperProvider>
	);
}

function RootLayoutNav() {
	return (
		<Stack screenOptions={{}}>
			<Stack.Screen
				name='(protected)'
				options={{ headerShown: false, fullScreenGestureShadowEnabled: true }}
			/>
			<Stack.Screen
				name='login'
				options={{
					headerShown: false,
					fullScreenGestureShadowEnabled: true,
				}}
			/>
			<Stack.Screen
				name='forgot-password'
				options={{
					headerShown: false,
					fullScreenGestureShadowEnabled: true,
				}}
			/>
			<Stack.Screen
				name='change-password'
				options={{
					headerShown: false,
					fullScreenGestureShadowEnabled: true,
				}}
			/>
			<Stack.Screen
				name='login-via-code'
				options={{
					headerShown: false,
					fullScreenGestureShadowEnabled: true,
				}}
			/>
			<Stack.Screen
				name='modal'
				options={{
					presentation: "modal",
					fullScreenGestureShadowEnabled: true,
				}}
			/>
		</Stack>
	);
}
