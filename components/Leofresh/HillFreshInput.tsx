import React, { useState } from "react";
import { KeyboardTypeOptions, StyleProp, TextStyle } from "react-native";
import { TextInput } from "react-native-paper";
import { useHillFreshTheme } from "../context";

interface HillFreshInputProps {
	left?: string;
	label?: string;
	value?: string;
	onChangeText: (text: string) => void;
	mode?: "flat" | "outlined";
	style?: StyleProp<TextStyle>;
	right?: string;
	defaultValue?: string;
	dense?: boolean;
	keyBoardType?: KeyboardTypeOptions;
	multiline?: boolean;
	disabled?: boolean;
}

export function HillFreshInput({
	style,
	value,
	onChangeText,
	label,
	mode = "outlined",
	left,
	right,
	defaultValue,
	keyBoardType,
	dense = false,
	multiline = false,
	disabled = false,
}: HillFreshInputProps) {
	const [isSecure, setIsSecure] = useState<boolean>(() =>
		right ? true : false
	);
	const { theme } = useHillFreshTheme();

	const handleEndIconPress = () => {
		setIsSecure(prev => !prev);
	};
	return (
		<TextInput
			theme={{
				roundness: 20,
				mode: "adaptive",
			}}
			style={{
				backgroundColor: theme.colors.background,
				fontWeight: "700",
				...(style as object),
			}}
			left={left ? <TextInput.Icon icon={left} /> : null}
			mode={mode}
			label={label}
			dense={dense}
			disabled={disabled}
			value={value}
			defaultValue={defaultValue}
			keyboardType={keyBoardType}
			secureTextEntry={isSecure}
			multiline={multiline}
			onChangeText={onChangeText}
			right={
				right ? (
					<TextInput.Icon
						icon={right}
						onPress={handleEndIconPress}
					/>
				) : null
			}
		/>
	);
}
