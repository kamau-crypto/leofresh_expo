export interface SnackBarActionProps {
	label?: string;
	onPress?: () => void;
}

export interface SnackBarProps {
	message: string;
	action?: SnackBarActionProps;
}
