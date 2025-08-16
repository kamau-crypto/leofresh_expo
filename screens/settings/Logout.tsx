import { useSession } from "@/components";
import { useStorageState } from "@/hooks/secure_store";
import { useProfileStore } from "@/store/profile";
import { useUserStore } from "@/store/user";
import React, { useCallback } from "react";
import { Button } from "react-native-paper";

export function Logout() {
	const { signOut, isLoading } = useSession();
	const { setValue: setSession } = useStorageState("auth_token");
	const user = useUserStore;
	const profile = useProfileStore;

	const handleLogout = useCallback(() => {
		user.persist.clearStorage();
		profile.persist.clearStorage();
		setSession(null);
		signOut();
	}, []);
	return (
		<Button
			style={{ padding: 4, marginTop: 10 }}
			contentStyle={{ flexDirection: "row-reverse" }}
			loading={isLoading}
			icon='logout'
			mode='contained'
			onPress={handleLogout}>
			Log Out
		</Button>
	);
}
