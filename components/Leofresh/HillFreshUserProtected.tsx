import { UserDetails } from "@/constants";
import React, { ComponentType } from "react";
import { View } from "react-native";

//
//Create a guard component for the user based on their type. If a user is an agent, some components do not render, but incase they are an agent, some components can render.
interface UserProtectedComponent {
	user: UserDetails;
	Component: ComponentType;
}
export function HillFreshSalesProtected({
	Component,
	user,
}: UserProtectedComponent) {
	return <View>{user.type === "Agent" ? <Component /> : null}</View>;
}
