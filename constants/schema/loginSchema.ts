import { z, ZodType } from "zod";
import { Login } from "../interface/user";

export const LoginSchema: ZodType<Login> = z.object({
	username: z
		.string({
			error: "Username is required",
		})
		.describe("Username is Invalid")
		.min(1, { message: "Your username must be provided" })
		.nonempty(),
	password: z
		.string({
			error: "Password is required",
		})
		.describe("Invalid Password Provided")
		.min(5, { message: "password is too short" })
		.max(15, { message: "Password is too long" })
		.nonempty(),
});
