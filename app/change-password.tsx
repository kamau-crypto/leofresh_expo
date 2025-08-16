import { HillFreshModalHeader } from "@/components";
import { ChangePassword } from "@/screens/ChangePassword";
import React from "react";
import { KeyboardAvoidingView } from "react-native";

export default function changePassword() {
	return (
		<KeyboardAvoidingView>
			<HillFreshModalHeader heading='Change Password' />
			<ChangePassword />
		</KeyboardAvoidingView>
	);
}
