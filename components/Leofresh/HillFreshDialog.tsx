import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";

interface HillFreshDialogProps {
	showDialog?: () => void;
	hideDialog: () => void;
	isOpen: boolean;
	content: React.JSX.Element;
	contentStyle?: StyleProp<ViewStyle>;
	dialogHeader: string;
}

export function HillFreshDialog({
	hideDialog,
	showDialog,
	isOpen,
	content,
	contentStyle,
	dialogHeader,
}: HillFreshDialogProps) {
	const style: StyleProp<ViewStyle> = !contentStyle
		? { padding: 10, width: "100%" }
		: contentStyle;

	return (
		<Portal>
			<Dialog
				style={{ display: "flex", maxHeight: "95%" }}
				visible={isOpen}
				onDismiss={hideDialog}>
				<Dialog.Title>{dialogHeader}</Dialog.Title>
				<Dialog.Content style={style}>{content}</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={hideDialog}>Close</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}
