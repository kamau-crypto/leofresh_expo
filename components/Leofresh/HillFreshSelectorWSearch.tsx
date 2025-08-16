import React from "react";

import { StyleSheet, View } from "react-native";
import { PaperSelect } from "react-native-paper-select";
import {
	PaperSelectProps,
	SelectedItem,
} from "react-native-paper-select/lib/typescript/interface/paperSelect.interface";
import { useHillFreshTheme } from "../context";

export interface HillFreshPickerWithSearchProps extends PaperSelectProps {
	setValue?: (item: SelectedItem) => void;
}

// const [gender, setGender] = useState({
// 	value: "",
// 	list: [
// 		{ _id: "1", value: "MALE" },
// 		{ _id: "2", value: "FEMALE" },
// 		{ _id: "3", value: "OTHERS", disabled: true },
// 	],
// 	selectedList: [],
// 	error: "A choice must be set",
// });
// const [colors, setColors] = useState({
// 	value: "",
// 	list: [
// 		{ _id: "1", value: "BLUE" },
// 		{ _id: "2", value: "RED" },
// 		{ _id: "3", value: "GREEN" },
// 		{ _id: "4", value: "YELLOW" },
// 		{ _id: "5", value: "BROWN" },
// 		{ _id: "6", value: "BLACK" },
// 		{ _id: "7", value: "WHITE" },
// 		{ _id: "8", value: "CYAN" },
// 	],
// 	selectedList: [], //THe Updated array once a value is selected.
// 	error: "", //The error to show upon start up of the application.
// });
//onSelection function pattern
// (value: any) => {
// 	setColors({
// 		...colors,
// 		value: value.text,
// 		selectedList: value.selectedList,
// 		error: "",
// 	});
// };

export function HillFreshSelectorWSearch({
	arrayList,
	errorText,
	selectedArrayList,
	searchText,
	label,
	value,
	onSelection,
	hideSearchBox,
}: HillFreshPickerWithSearchProps) {
	const { theme } = useHillFreshTheme();

	return (
		<View style={styles.container}>
			<PaperSelect
				label={label}
				value={value}
				onSelection={onSelection}
				arrayList={[...arrayList]}
				selectedArrayList={selectedArrayList}
				errorText={errorText}
				multiEnable={false}
				theme={theme}
				textInputMode='outlined'
				searchText={searchText}
				textInputOutlineStyle={{
					borderRadius: 10,
					outlineColor: theme.colors.outlineVariant,
				}}
				hideSearchBox={hideSearchBox}
				textInputStyle={{ borderRadius: 10 }}
				containerStyle={{ borderColor: theme.colors.outline, borderRadius: 10 }}
				dialogCloseButtonText='close'
				dialogDoneButtonText='save'
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 12,
	},
});
