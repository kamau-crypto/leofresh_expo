import {
	HillFreshFieldForm,
	useHillFreshTheme,
	useSnackbar,
} from "@/components";
import { userChangePassword } from "@/hooks/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { ToastAndroid, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { z, ZodType } from "zod";

interface ChangePassword {
	email: string;
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export function ChangePassword() {
	const schema: ZodType<ChangePassword> = z
		.object({
			email: z.email(),
			oldPassword: z.string().min(4),
			newPassword: z.string().min(4),
			confirmPassword: z.string().min(4),
		})
		.superRefine(({ oldPassword, newPassword, confirmPassword }, ctx) => {
			if (newPassword !== confirmPassword) {
				ctx.addIssue({
					code: "custom",
					message: "The passwords did not match",
					path: ["oldPassword", "confirmPassword"],
				});
			}
			if (oldPassword === newPassword) {
				ctx.addIssue({
					code: "custom",
					message: "The oldPassword cannot be the new Password",
					path: ["newPassword"],
				});
			}
		});
	const router = useRouter();
	const { show } = useSnackbar();
	const { theme } = useHillFreshTheme();
	const defaultValues: ChangePassword = {
		email: "",
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	};
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<ChangePassword>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const handleChangePassword = async ({
		email,
		oldPassword,
		newPassword,
	}: ChangePassword) => {
		const { message, success_key } = await userChangePassword({
			email,
			new_password: newPassword,
			old_password: oldPassword,
		});
		if (success_key === 1) {
			show({ message: message });
			ToastAndroid.show("Logging you out so that you can login again", 1000);
			return router.replace("/login");
		}
	};
	return (
		<View
			style={{
				width: "auto",
				display: "flex",
				flexDirection: "column",
				paddingTop: 40,
				paddingHorizontal: 15,
				rowGap: 20,
			}}>
			<Text
				variant='titleLarge'
				style={{ textAlign: "center" }}>
				Change Password
			</Text>
			<HillFreshFieldForm
				control={control}
				labelText='Email'
				error={errors.email}
				name='email'
			/>
			<HillFreshFieldForm
				control={control}
				error={errors.oldPassword}
				labelText='Old Password'
				name='oldPassword'
			/>
			<HillFreshFieldForm
				control={control}
				error={errors.newPassword}
				labelText='New Password'
				name='newPassword'
			/>
			<HillFreshFieldForm
				control={control}
				error={errors.confirmPassword}
				labelText='Confirm Password'
				name='confirmPassword'
			/>
			{errors && (
				<View
					style={{ padding: 2, backgroundColor: theme.colors.errorContainer }}>
					{errors.confirmPassword && (
						<Text style={{ color: theme.colors.error }}>
							{errors.confirmPassword.message}
						</Text>
					)}
					{errors.newPassword && (
						<Text style={{ color: theme.colors.error }}>
							{errors.newPassword.message}
						</Text>
					)}
					{errors.oldPassword && (
						<Text style={{ color: theme.colors.error }}>
							{errors.oldPassword.message}
						</Text>
					)}
				</View>
			)}

			<Button
				// loading= {}
				onPress={handleSubmit(handleChangePassword)}
				mode='contained'>
				Change Password
			</Button>
		</View>
	);
}
