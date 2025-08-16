//

import { Keyboard } from "react-native";

export function hideKeyboard() {
	if (Keyboard.isVisible()) {
		return Keyboard.dismiss();
	}
}
