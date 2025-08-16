import React from "react";
import { View } from "react-native";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";
import { Meters } from "./forms/Meters";
import { Movement } from "./forms/Movement";
import { Stock } from "./forms/Stock";
import { Tank } from "./forms/Tank";

export function StockScreen() {
	return (
		<View style={{ height: "100%" }}>
			<TabsProvider defaultIndex={0}>
				<Tabs style={{ flexDirection: "row" }}>
					<TabScreen label='Meters'>
						<Meters />
					</TabScreen>
					<TabScreen label='Tanks'>
						<Tank />
					</TabScreen>
					<TabScreen label='Stocks'>
						<Stock />
					</TabScreen>
					<TabScreen label='Movement'>
						<Movement />
					</TabScreen>
				</Tabs>
			</TabsProvider>
		</View>
	);
}
