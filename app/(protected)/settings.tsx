import { HillFreshModalHeader } from "@/components";
import { AgentUser } from "@/screens/settings/AgentUser";
import { SettingsScreen } from "@/screens/settings/Settings";
import { useUserStore } from "@/store/user";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

export default function Settings() {
	const top = useHeaderHeight();
	const { user } = useUserStore();
	return (
		<ScrollView>
			<SafeAreaView style={{ paddingTop: top, height: "100%", width: "100%" }}>
				<HillFreshModalHeader heading='Settings' />
				{user && user.type === "Agent" ? <AgentUser /> : <SettingsScreen />}
			</SafeAreaView>
		</ScrollView>
	);
}
