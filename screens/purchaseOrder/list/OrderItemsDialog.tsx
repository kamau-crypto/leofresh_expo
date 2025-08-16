import * as React from "react";
import { ScrollView, StyleProp, ViewStyle } from "react-native";
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
				style={{ display: "flex", maxHeight: "95%" }}
				visible={visible}
				onDismiss={hideDialog}>
				<Dialog.Content style={style}>
					<ScrollView>
						<Component />
					</ScrollView>
				</Dialog.Content>
			</Dialog>
		</Portal>
	);
};
