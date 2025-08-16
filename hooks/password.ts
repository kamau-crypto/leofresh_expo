import { appConfig } from "@/utils/config";
import { HillFreshError } from "@/utils/customError";
import axios, { AxiosResponse } from "axios";

interface PasswordResetResponse {
	message: string;
	success_key: number;
}

export async function userForgotPassword({ email }: { email: string }) {
	try {
		const response: AxiosResponse<{ message: PasswordResetResponse }> =
			await axios.post(appConfig.FORGOT_PASSWORD, {
				email,
			});
		if (response.data.message.success_key === 1) {
			return response.data.message;
		} else {
			throw new HillFreshError({ message: response.data.message.message });
		}
	} catch (e: any) {
		throw new HillFreshError({ message: e.message });
	}
}

export async function userChangePassword({
	email,
	old_password,
	new_password,
}: {
	email: string;
	old_password: string;
	new_password: string;
}) {
	try {
		const response: AxiosResponse<{ message: PasswordResetResponse }> =
			await axios.post(appConfig.CHANGE_PASSWORD, {
				email,
				old_pwd: old_password,
				new_pwd: new_password,
			});
		if (response.data.message.success_key === 1) {
			return response.data.message;
		} else {
			throw new HillFreshError({ message: response.data.message.message });
		}
	} catch (e: any) {
		throw new HillFreshError({ message: e.message });
	}
}
