import { ReadUserRoles } from "./read";

export interface Login {
	username: string;
	password: string;
}

export interface UserDetails {
	full_name: string;
	username: string;
	email: string;
	type: string;
	autosubmit: boolean;
	roles: ReadUserRoles[];
}
