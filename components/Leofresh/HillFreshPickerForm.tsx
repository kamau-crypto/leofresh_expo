import { Picker } from "@react-native-picker/picker";
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
import { useHillFreshTheme } from "../context";
import { HillFreshPickerProps } from "./HillFreshPicker";

export interface HillFreshPickerFeldFormProps<T extends FieldValues>
	extends Omit<HillFreshPickerProps, "setSelectedValue" | "selectedValue"> {
	name: Path<T>;
	error: FieldError | undefined;
	control: Control<T, any>;
	placeholder?: string;
	defaultValue?: PathValue<T, Path<T>>;
}

export function HillFreshPickerFormField<T extends FieldValues>({
	control,
	items,
	style,
	name,
	error,
	placeholder,
	defaultValue,
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
					<Picker
						style={{
							...(style as object),
							backgroundColor: theme.colors.primaryContainer,
							paddingHorizontal: 2,
							borderRadius: 20,
						}}
						selectedValue={value}
						onValueChange={itemValue => onChange(itemValue)}>
						{placeholder && (
							<Picker.Item
								label={placeholder}
								value=''
							/>
						)}
						{items.map(item => (
							<Picker.Item
								style={{ fontFamily: "SpaceMono" }}
								key={item.label}
								label={item.label}
								value={item.value}
							/>
						))}
					</Picker>
				)}
				name={name}
			/>
			{error && error.message && (
				<Text style={{ color: "red" }}>{error.message}</Text>
			)}
		</View>
	);
}
