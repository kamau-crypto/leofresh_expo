import { HillFreshFieldForm, useSnackbar } from "@/components";
import { userForgotPassword } from "@/hooks/password";
import { hideKeyboard } from "@/utils/keyboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, ToastAndroid } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import { z, ZodType } from "zod";

interface ResetUserPassword {
	email: string;
}

export function ForgotPassword() {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const schema: ZodType<ResetUserPassword> = z.object({
		email: z
			.email({
				error: "A valid email is required reset your password",
			}),
	});
	const { show } = useSnackbar();
	const router = useRouter();
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ResetUserPassword>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
		},
		mode: "onTouched",
	});

	const handleResetPassword = async (data: ResetUserPassword) => {
		hideKeyboard();
		setIsSubmitting(prev => !prev);
		const { message, success_key } = await userForgotPassword({
			email: data.email,
		});
		if (success_key === 1) {
			setIsSubmitting(prev => !prev);
			show({
				message:
					"Password reset successfully, Login and change the password to a memorable one.",
			});
			ToastAndroid.show("Logging you out so that you can login again", 1000);
			router.replace("/login");
		}
	};

	return (
		<ScrollView
			contentContainerStyle={{
				width: "auto",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				height: "80%",
				rowGap: 20,
				paddingHorizontal: 10,
			}}>
			<Text
				style={{ textAlign: "center", padding: 8 }}
				variant='bodyLarge'>
				To Reset your password, use your login email. {"\n"} The password will
				be sent to the phone number
				{
					<Icon
						source={"inbox-arrow-down"}
						size={20}
					/>
				}{" "}
				linked to your account.{"\n"} After receiving the password, change the
				password to a memorable one.
			</Text>
			<HillFreshFieldForm
				left='email'
				labelText='Email'
				control={control}
				name='email'
				error={errors.email}
			/>
			<Button
				loading={isSubmitting}
				onPress={handleSubmit(handleResetPassword)}
				mode='contained'>
				Reset Password
			</Button>
		</ScrollView>
	);
}
