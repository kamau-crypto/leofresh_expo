export interface ReadUserDetails {
	message: ReadUserDetailsMessage;
	home_page: string;
	full_name: string;
}

export interface ReadUserDetailsMessage {
	success_key: number;
	message: string;
	sid: string;
	api_key: string;
	api_secret: string;
	username: string;
	email: string;
	enabled: number;
	role_profiles: RoleProfile[];
	roles: ReadUserRoles[];
}

export interface RoleProfile {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	role_profile: string;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
}
export interface ReadUserRoles {
	name: string;
	owner: string;
	creation: Date;
	modified: Date;
	modified_by: string;
	docstatus: number;
	idx: number;
	role: string;
	parent: string;
	parentfield: string;
	parenttype: string;
	doctype: string;
}
