import * as React from "react";
import { View } from "react-native";
import {
	Button,
	Dialog,
	PaperProvider,
	Portal,
	Text,
} from "react-native-paper";

interface HillFreshDialogProps {
	showDialog?: () => void;
	hideDialog: () => void;
	isOpen: boolean;
}

export function HillFreshDialog({
	hideDialog,
	showDialog,
	isOpen,
}: HillFreshDialogProps) {
	return (
		<PaperProvider>
			<View>
				<Portal>
					<Dialog
						visible={isOpen}
						onDismiss={hideDialog}>
						<Dialog.Title>Alert</Dialog.Title>
						<Dialog.Content>
							<Text variant='bodyMedium'>This is simple dialog</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={hideDialog}>Done</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
			</View>
		</PaperProvider>
	);
}
