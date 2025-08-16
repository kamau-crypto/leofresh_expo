import { useHeaderHeight } from "@react-navigation/elements";
import { ReactNode } from "react";
import { KeyboardAvoidingView, StyleProp, ViewStyle } from "react-native";

export function HillFreshKeyBoardView({
	children,
	style,
}: {
	children: ReactNode;
	style?: StyleProp<ViewStyle>;
}) {
	const top = useHeaderHeight();
	return (
		<KeyboardAvoidingView
			behavior='height'
			keyboardVerticalOffset={0}
			style={{ paddingTop: top, ...(style as object), flex: 1 }}>
			{children}
		</KeyboardAvoidingView>
	);
}
