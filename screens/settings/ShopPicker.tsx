import { HillFreshSelectorWSearch } from "@/components";
import { ReadPOSProfile } from "@/constants";
import { useProfileStore } from "@/store/profile";
import { useUserStore } from "@/store/user";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";
import {
	ListItem,
	SelectedItem,
} from "react-native-paper-select/lib/typescript/interface/paperSelect.interface";
import { groupPOSProfiles } from "./hooks";
import { settingsStyles } from "./styles";

export function ShopPicker({ allProfiles }: { allProfiles: ReadPOSProfile[] }) {
	const { updateProfile, profile } = useProfileStore();
	const { user } = useUserStore();
	const router = useRouter();

	const [shops, setShops] = useState<{
		value: string;
		list: ListItem[];
		selectedList: ListItem[];
		error: string;
	}>({
		value: "",
		error: `${user && user.full_name} , pick a shop to oversee`,
		list: [
			{
				_id: "1",
				value: `${profile && profile.company} Shops will be displayed here`,
			},
		],
		selectedList: [],
	});

	const items = useMemo(() => {
		let prof: Array<{ label: string; value: string; enabled: boolean }> = [];
		if (allProfiles.length > 0) {
			const groupedProfiles = groupPOSProfiles(allProfiles);
			//
			//Have a disabled field here such that the user assigned to a certain shop cannot change and make transactions under another shop.
			prof = groupedProfiles.map((p, i) => ({
				enabled:
					p.user_emails.includes(user!.email) ||
					p.user_emails.includes(user!.full_name),
				label: `${p.customer}- ${p.company}`,
				value: p.customer,
			}));
			//Create a new picker array.
			const shopsList: ListItem[] = groupedProfiles.map(
				({ customer, company, user_emails }) => ({
					_id: customer,
					value: `${customer} - ${company}`,
					disabled: !(
						user_emails.includes(user!.email) ||
						user_emails.includes(user!.full_name)
					),
				})
			);
			setShops({
				value: "",
				list: shopsList,
				selectedList: [{ _id: "", value: "" }],
				error: "Pick a shop to oversee to proceed",
			});
		}
		return prof;
	}, [allProfiles]);

	// Pick a customer and if permitted to oversee it you are redirectred to the home page
	const handlePickerUpdates = async (itemValue: any, itemIndex?: number) => {
		const filteredProf = allProfiles.find(p => p.customer === itemValue);
		if (filteredProf) {
			//Check if the user is permitted to visit this shop
			updateProfile(filteredProf);
			setTimeout(() => {
				router.replace("/(protected)/(tabs)");
			}, 100);
		}
	};
	return (
		<>
			{/* <View style={{ ...settingsStyles.heading, gap: 10 }}>
				<Text
					variant='titleMedium'
					style={{ textAlign: "center" }}>
					Pick a shop to over see
				</Text>
				<HillFreshPicker
					style={settingsStyles.picker}
					selectedValue={profile ? profile.customer : ""}
					items={items ?? [{ label: "None", value: "none" }]}
					setSelectedValue={handlePickerUpdates}
				/>
			</View> */}
			<View style={{ ...settingsStyles.heading, gap: 8, elevation: 1 }}>
				<Text
					variant='titleMedium'
					style={{ textAlign: "center" }}>
					Pick a shop to oversee
				</Text>
				<HillFreshSelectorWSearch
					setValue={(item: SelectedItem): void => {
						throw new Error("Function not implemented.");
					}}
					hideSearchBox={true}
					label={"Pick a shop to oversee"}
					arrayList={shops.list}
					selectedArrayList={shops.selectedList}
					multiEnable={false}
					value={shops.value}
					onSelection={(value: SelectedItem): void => {
						setShops({
							...shops,
							value: value.text,
							selectedList: value.selectedList,
							error: "",
						});
						handlePickerUpdates(value.selectedList[0]._id);
					}}
				/>
				<Text
					variant='bodyMedium'
					style={{ textAlign: "center" }}>
					If you see{" "}
					{
						<Icon
							size={14}
							source={"minus-box"}
						/>
					}{" "}
					, then you are not permitted to oversee that shop
				</Text>
			</View>
		</>
	);
}
