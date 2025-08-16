import { z, ZodType } from "zod";
import { Login } from "../interface/user";

export const LoginSchema: ZodType<Login> = z.object({
	username: z
		.string({
			description: "Username is Invalid",
			required_error: "Username is required",
		})
		.min(1, { message: "Your username must be provided" })
		.nonempty(),
	password: z
		.string({
			description: "Invalid Password Provided",
			required_error: "Password is required",
		})
		.min(5, { message: "password is too short" })
		.max(15, { message: "Password is too long" })
		.nonempty(),
});
