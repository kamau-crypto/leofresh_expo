import { HillFreshModalHeader } from "@/components";
import { ForgotPassword } from "@/screens/ForgotPassword";
import React from "react";
import { KeyboardAvoidingView } from "react-native";

export default function forgotPassword() {
	return (
		<KeyboardAvoidingView >
			<HillFreshModalHeader heading='Forgot Password' />
			<ForgotPassword />
		</KeyboardAvoidingView>
	);
}
