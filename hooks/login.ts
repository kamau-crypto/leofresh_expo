import { ReadUserDetails, RoleProfile, UserRoles } from "@/constants";
import { appConfig } from "@/utils/config";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import axios, { AxiosResponse } from "axios";

export interface User {
	message: Message;
	home_page: string;
	full_name: string;
}

export interface Message {
	success_key: number;
	message: string;
	sid: string;
	api_key: string;
	api_secret: string;
	username: string;
	email: string;
}

export async function loginUser({
	password,
	username,
}: {
	username: string;
	password: string;
}) {
	try {
		const response: AxiosResponse<ReadUserDetails> = await axios.post(
			appConfig.LOGIN_URL,
			{
				usr: username,
				pwd: password,
			}
		);
		if (response.data.message.success_key === 1) {
			return {
				success: 0,
				message: `${response.data.message.api_key}:${response.data.message.api_secret}`,
				user: {
					full_name: response.data.full_name,
					username: response.data.message.username,
					email: response.data.message.email,
					type: compileUserRoles({
						role_profiles: response.data.message.role_profiles,
					}),
					roles: response.data.message.roles,
				},
			};
		} else {
			const msg = extractFrappeErrorMessage(response.data.message.message);
			throw new HillFreshError({ message: msg });
		}
	} catch (e: any) {
		const message = extractFrappeErrorMessage(e);
		throw new HillFreshError({ message });
	}
}

function compileUserRoles({ role_profiles }: { role_profiles: RoleProfile[] }) {
	switch (true) {
		case role_profiles.length >= 1:
			return UserRoles.AGENT;
		case role_profiles.length >= 4:
			return UserRoles.SALES;
		default:
			return UserRoles.ADMIN;
	}
}
