import React from "react";
import {
	Control,
	Controller,
	FieldError,
	FieldValues,
	Path,
	PathValue,
} from "react-hook-form";
import { Text, View } from "react-native";
import { PaperSelect } from "react-native-paper-select";
import { useHillFreshTheme } from "../context";
import { HillFreshPickerWithSearchProps } from "./HillFreshSelectorWSearch";

export interface HillFreshPickerFeldFormProps<T extends FieldValues>
	extends Omit<
		HillFreshPickerWithSearchProps,
		"setSelectedValue" | "selectedValue"
	> {
	name: Path<T>;
	error: FieldError | undefined;
	control: Control<T, any>;
	placeholder?: string;
	defaultValue?: PathValue<T, Path<T>>;
}

export function HillFreshPickerSearchFormField<T extends FieldValues>({
	control,
	name,
	error,
	defaultValue,
	arrayList,
	selectedArrayList,
	searchText,
	setValue,
}: HillFreshPickerFeldFormProps<T>) {
	const { theme } = useHillFreshTheme();
	return (
		<View
			style={{
				margin: "2%",
				borderColor: theme.colors.outline,
				borderStyle: "solid",
				borderWidth: 1,
				padding: 2,
				borderRadius: 10,
			}}>
			<Controller
				defaultValue={defaultValue}
				control={control}
				render={({ field: { onChange, value } }) => (
					<PaperSelect
						label='Select Values'
						value={value}
						onSelection={(_value: any) => {
							// onChange();
							// setValue;
						}}
						arrayList={[...arrayList]}
						selectedArrayList={selectedArrayList}
						errorText={error?.message}
						multiEnable={false}
						theme={theme}
						textInputMode='outlined'
						searchText={searchText}
						textInputOutlineStyle={{
							borderRadius: 10,
							outlineColor: theme.colors.outlineVariant,
						}}
						textInputStyle={{ borderRadius: 10 }}
						containerStyle={{
							borderColor: theme.colors.outline,
							borderRadius: 10,
						}}
						dialogCloseButtonText='close'
						dialogDoneButtonText='save'
					/>
				)}
				name={name}
			/>
			{error && error.message && (
				<Text style={{ color: "red" }}>{error.message}</Text>
			)}
		</View>
	);
}
