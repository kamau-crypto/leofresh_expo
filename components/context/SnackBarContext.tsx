import { SnackBarActionProps, SnackBarProps } from "@/constants";
import React, { ReactNode, createContext, useContext } from "react";
import { Snackbar } from "react-native-paper";

class SnackBarManager {
	private static instance: SnackBarManager;
	private listeners: ((props: SnackBarProps) => void)[] = [];

	private constructor() {}

	public static getInstance(): SnackBarManager {
		if (!SnackBarManager.instance) {
			SnackBarManager.instance = new SnackBarManager();
		}
		return SnackBarManager.instance;
	}

	public addListener(listener: (props: SnackBarProps) => void): () => void {
		this.listeners.push(listener);

		return () => {
			this.listeners = this.listeners.filter(l => l !== listener);
		};
	}

	public show(props: SnackBarProps): void {
		this.listeners.forEach(listener => listener(props));
	}
}

const snackBarManager = SnackBarManager.getInstance();

export const showSnackBar = (props: SnackBarProps): void => {
	snackBarManager.show(props);
};

const HillFreshSnackBar: React.FC = () => {
	const [visible, setVisible] = React.useState(false);
	const [message, setMessage] = React.useState<string | undefined>("");
	const [action, setAction] = React.useState<SnackBarActionProps | undefined>(
		undefined
	);

	React.useEffect(() => {
		const unsubscribe = snackBarManager.addListener(props => {
			setMessage(props.message);
			setAction(props.action);
			setVisible(true);
		});

		return unsubscribe;
	}, []);

	const onDismissSnackBar = () => setVisible(false);

	return (
		<Snackbar
			duration={Snackbar.DURATION_LONG + 30000}
			visible={visible}
			onDismiss={onDismissSnackBar}
			action={{
				label: action?.label ?? "Cancel",
				onPress: action?.onPress ?? onDismissSnackBar,
			}}>
			{message}
		</Snackbar>
	);
};

const SnackBarContext = createContext<SnackBarManager | undefined>(undefined);

export function SnackBarProvider({ children }: { children: ReactNode }) {
	return (
		<SnackBarContext.Provider value={snackBarManager}>
			{children}
			<HillFreshSnackBar />
		</SnackBarContext.Provider>
	);
}

export const useSnackbar = () => {
	const context = useContext(SnackBarContext);
	if (!context) {
		throw new Error("useSnackbar must be used within a SnackbarProvider");
	}
	return {
		show: (props: SnackBarProps) => context.show(props),
	};
};
