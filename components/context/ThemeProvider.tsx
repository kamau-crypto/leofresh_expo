import { appColors, appDarkColors } from "@/constants";
import { HillFreshError } from "@/utils/customError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	configureFonts,
	MD3DarkTheme,
	MD3LightTheme,
	MD3Theme,
} from "react-native-paper";

type AppTheme = MD3Theme & {
	colors: MD3Theme["colors"] & {
		customColor?: string;
	};
};

type ThemeContextType = {
	theme: AppTheme;
	isDarkMode: boolean;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

	useEffect(() => {
		const loadTheme = async () => {
			const savedTheme = await AsyncStorage.getItem("theme");
			if (savedTheme) setIsDarkMode(savedTheme === "dark");
		};
		loadTheme();
	}, []);

	const toggleTheme = async () => {
		const newMode = !isDarkMode;
		setIsDarkMode(newMode);
		await AsyncStorage.setItem("theme", newMode ? "dark" : "light");
	};

	// const baseFont: MD3Type = {
	// 	fontFamily: "SpaceMono",
	// 	fontWeight: "700",
	// 	lineHeight: 1,
	// 	fontSize: 16,
	// 	letterSpacing: 1,
	// 	fontStyle: "normal",
	// } as const;

	const baseFont = {
		fontFamily: "SpaceMono",
		fontWeight: "700",
	} as const;

	const baseVariants = configureFonts({ config: baseFont });

	// Define your themes
	const lightTheme = {
		...MD3LightTheme,
		colors: {
			...appColors.colors,
		},
		roundness: 2,
		font: { ...baseVariants },
	};

	const darkTheme = {
		...MD3DarkTheme,
		roundness: 2,
		colors: {
			...appDarkColors.colors,
		},
		font: { ...baseVariants },
	};

	// const theme = () => setIsDarkMode(!isDarkMode);
	return (
		<ThemeContext.Provider
			value={{
				theme: isDarkMode ? darkTheme : lightTheme,
				toggleTheme,
				isDarkMode,
			}}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useHillFreshTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new HillFreshError({
			message: "useTheme must be used within a Theme Provider",
		});
	}
	return context;
};
