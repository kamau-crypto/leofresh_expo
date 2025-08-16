import {
	HillFreshFieldForm,
	useHillFreshTheme,
	useSession,
} from "@/components";
import { appColors, Login, LoginSchema } from "@/constants";
import { useKeyStore } from "@/store/token";
import { appConfig } from "@/utils/config";
import { hideKeyboard } from "@/utils/keyboard";
import { zodResolver } from "@hookform/resolvers/zod";
import Constants from "expo-constants";
import { Link, useRouter } from "expo-router";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Platform, StyleSheet, View } from "react-native";
import { Badge, Button, Text } from "react-native-paper";

const defaultValues: Login = {
	username: "",
	password: "",
};
export function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { signIn, session } = useSession();
	const { theme } = useHillFreshTheme();
	const { key } = useKeyStore();

	const version = Constants.expoConfig?.version;
	const {
		control,
		formState: { errors },
		setError,
		handleSubmit,
	} = useForm<Login>({
		resolver: zodResolver(LoginSchema),
		defaultValues,
	});

	const handleLogin = async (data: Login) => {
		hideKeyboard();
		try {
			setIsLoading(true);
			await signIn({
				password: data.password,
				username: data.username,
			});
			router.replace("/");
		} catch (error) {
			setError("username", { message: "Invalid Credentials Provided" });
			setError("password", { message: "Invalid Credentials Provided" });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View
			style={{
				...styles.form,
				backgroundColor: theme.colors.background,
				flex: 1,
			}}>
			<Image
				style={styles.image}
				source={require("@/assets/leofresh/logo.png")}
			/>
			<Badge
				style={{ padding: 2 }}
				visible={true}
				size={30}>
				{process.env.NODE_ENV}
			</Badge>
			<HillFreshFieldForm
				left='account'
				style={styles.input}
				name='username'
				control={control}
				error={errors.username}
				labelText='User Name'
			/>
			<HillFreshFieldForm
				left='lock'
				name='password'
				style={styles.input}
				control={control}
				error={errors.password}
				labelText='Password'
				right='eye'
			/>
			<Button
				style={{ padding: 4, marginTop: 10 }}
				contentStyle={{ flexDirection: "row-reverse" }}
				loading={isLoading}
				icon='login'
				mode='contained'
				onPress={handleSubmit(handleLogin)}>
				Login
			</Button>
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 10,
					alignItems: "center",
				}}>
				<Link
					href='/forgot-password'
					asChild
					style={styles.links}>
					<Text variant='titleMedium'>Forgot password</Text>
				</Link>
				{/* <Text variant='bodyLarge'>OR</Text>
				<Link
					href='/login-via-code'
					asChild
					style={styles.links}>
					<Text variant='titleMedium'>Login with Code</Text>
				</Link> */}
				<Text>version : {version}</Text>
				<Text>Server : {appConfig.PUBLIC_URL}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	form: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignContent: "center",
		padding: "10%",
		rowGap: "4%",
	},
	image: {
		margin: "auto",
		height: Platform.OS === "web" ? 300 : 150,
		width: Platform.OS === "web" ? "70%" : "100%",
		objectFit: "contain",
	},
	input: {
		borderRadius: 10,
		width: "100%",
		margin: "auto",
	},
	links: {
		color: appColors.colors.tertiary,
		textDecorationLine: "underline",
		fontWeight: "bold",
	},
});
