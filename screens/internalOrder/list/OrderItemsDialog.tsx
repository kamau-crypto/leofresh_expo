import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Dialog, Portal } from "react-native-paper";

export const OrderItemsDialog = ({
	Component,
	hideDialog,
	visible,
	style,
}: {
	Component: React.ComponentType;
	hideDialog: () => void;
	visible: boolean;
	style: StyleProp<ViewStyle>;
}) => {
	return (
		<Portal>
			<Dialog
				style={{ display: "flex", height: "auto", maxHeight: "90%" }}
				visible={visible}
				onDismiss={hideDialog}>
				<Dialog.Content style={style}>
					<Component />
				</Dialog.Content>
			</Dialog>
		</Portal>
	);
};
