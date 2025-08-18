import { appColors, ReadPOSProfile } from "@/constants";
import { useProfileStore } from "@/store/profile";

import { HillFreshDialog } from "@/components";
import { POSProfile } from "@/services";
import { useUserStore } from "@/store/user";
import { appConfig } from "@/utils/config";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Badge, Button, Checkbox, Text } from "react-native-paper";
import { Logout } from "./Logout";
import { Results } from "./Results";
import { ShopPicker } from "./ShopPicker";
import { settingsStyles } from "./styles";

export function SettingsScreen() {
	const router = useRouter();

	const [openDialog, isDialog] = useState<boolean>(false);
	const { profile } = useProfileStore();
	const { user } = useUserStore();

	const [allProfiles, setProfiles] = useState<ReadPOSProfile[]>([]);
	const posProfile = new POSProfile({ docType: "POS Profile" });

	useEffect(() => {
		const retrieveProjects = async () => {
			const data = await posProfile.retrievePOSProfile({});
			if (data) {
				return setProfiles(data);
			}
			return;
		};
		retrieveProjects();
	}, []);

	return (
		<View style={settingsStyles.container}>
			<View
				style={{
					...settingsStyles.heading,
					paddingVertical: 20,
					rowGap: 20,
					borderColor: appColors.colors.primary,
					borderWidth: 2,
				}}>
				<Text
					variant='titleMedium'
					style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
					Welcome {user!.full_name}
				</Text>
				<View style={settingsStyles.cta}>
					<Text
						variant='titleMedium'
						style={{
							textAlign: "center",
							fontWeight: "bold",
							color: "black",
							lineHeight: 30,
						}}>
						You are overseeing {"\n"}
						{String(profile?.customer ?? "NO SHOP")} as a Sales Manager
					</Text>
				</View>
				<Text
					variant='bodyMedium'
					style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
					Your email is {user?.email}
				</Text>
			</View>
			<ShopPicker allProfiles={allProfiles} />
			<Results />
			<AutoSubmit />
			<TouchableOpacity
				onPress={() => isDialog(true)}
				style={styles.fab_like}>
				<Avatar.Icon
					size={32}
					icon='information-outline'
				/>
				<HillFreshDialog
					dialogHeader='App Info'
					content={<InfoDialog />}
					hideDialog={() => isDialog(false)}
					isOpen={openDialog}
				/>
			</TouchableOpacity>
			<View style={{ padding: 10 }}>
				<Text> Account Management</Text>
				<Button
					onPress={() => router.push("/change-password")}
					mode='outlined'>
					Reset Password
				</Button>
			</View>
			<View style={{ paddingBottom: 30 }}>
				<Logout />
			</View>
		</View>
	);
}

function InfoDialog() {
	const version = Constants.expoConfig?.version;
	return (
		<View>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Avatar.Icon
					icon='web'
					size={20}
				/>
				<Text variant='bodyLarge'> {appConfig.PUBLIC_URL}</Text>
			</View>
			<View>
				<Text variant='bodyLarge'>Current Version - v {version}</Text>
			</View>
			<Badge
				style={{ padding: 2 }}
				visible={true}
				size={24}>
				{process.env.NODE_ENV}
			</Badge>
		</View>
	);
}

//Might not be needed in the long run.
function AutoSubmit() {
	const [isChecked, setIsChecked] = useState<boolean>(true);
	const { updateUser, user } = useUserStore();

	const handleIsChecked = () => {
		setIsChecked(prev => !prev);
		const updatedUser = { ...user!, autosubmit: isChecked };
		updateUser(updatedUser);
	};

	return (
		<View
			style={{
				...settingsStyles.result,
				backgroundColor: appColors.colors.onPrimary,
			}}>
			<Checkbox
				status={isChecked ? "checked" : "unchecked"}
				onPress={handleIsChecked}
			/>
			<Text variant='titleMedium'>Auto Submit Sales and Purchase Orders</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	fab_like: {
		position: "absolute",
		borderRadius: 50,
		right: 10,
		bottom: "40%",
	},
});
