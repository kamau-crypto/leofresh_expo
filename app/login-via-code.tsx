import { HillFreshModalHeader } from "@/components";
import React from "react";
import { KeyboardAvoidingView } from "react-native";

export default function loginViaCode() {
	return (
		<KeyboardAvoidingView>
			<HillFreshModalHeader heading='Login With Code' />
			
		</KeyboardAvoidingView>
	);
}
