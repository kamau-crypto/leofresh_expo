import React, { ComponentType } from "react";
import { GestureResponderEvent } from "react-native";
import { Menu } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export interface MenuItemProps {
	leadingIcon?: IconSource;
	onPress?: (e: GestureResponderEvent) => void;
	title: string;
	disabled?: boolean;
}

interface AnchorProps {
	onPress?: () => void;
}

interface HillFreshMenuOptionsProps {
	Anchor: ComponentType<AnchorProps>;
	menuItems: MenuItemProps[] | null;
	visible: boolean;
	closeMenu: () => void;
}

export function HillFreshMenuOptions({
	Anchor,
	menuItems,
	visible,
	closeMenu,
}: HillFreshMenuOptionsProps) {
	if (!menuItems) {
		return null;
	}
	return (
		<Menu
			style={{
				paddingTop: 10,
				flexDirection: "row",
				justifyContent: "center",
				zIndex: 10,
			}}
			visible={visible}
			onDismiss={closeMenu}
			anchor={<Anchor />}>
			{menuItems.map(m => (
				<Menu.Item
					disabled={m.disabled}
					key={m.title}
					title={m.title}
					titleStyle={{ fontFamily: "SpaceMono" }}
					onPress={m.onPress}
					leadingIcon={m.leadingIcon}
				/>
			))}
		</Menu>
	);
}
