import React from "react";
import {
	Control,
	Controller,
	FieldError,
	FieldValues,
	Path,
	PathValue,
} from "react-hook-form";
import {
	KeyboardTypeOptions,
	StyleProp,
	Text,
	TextStyle,
	View,
} from "react-native";
import { HillFreshInput } from "./HillFreshInput";

export interface HillFreshFeldFormProps<T extends FieldValues> {
	labelText?: string;
	control: Control<T, any>;
	name: Path<T>;
	error: FieldError | undefined;
	valueAsNumber?: boolean;
	style?: StyleProp<TextStyle>;
	right?: string;
	left?: string;
	dense?: boolean;
	keyBoardType?: KeyboardTypeOptions;
	multiline?: boolean;
	defaultValue?: PathValue<T, Path<T>>;
	disabled?: boolean;
}

export function HillFreshFieldForm<T extends FieldValues>({
	control,
	labelText,
	style,
	name,
	keyBoardType,
	multiline,
	error,
	dense,
	defaultValue,
	disabled,
	...rest
}: HillFreshFeldFormProps<T>) {
	return (
		<View style={{ margin: "2%" }}>
			<Controller
				control={control}
				defaultValue={defaultValue as PathValue<T, Path<T>>}
				render={({ field: { onChange, value } }) => (
					<HillFreshInput
						keyBoardType={keyBoardType}
						style={style}
						multiline={multiline}
						disabled={disabled}
						label={labelText}
						dense={dense}
						onChangeText={onChange}
						value={String(value)}
						{...rest}
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
