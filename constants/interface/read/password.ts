export interface ForgotPassword {
	message: ForgotPasswordMessage;
}

export interface ForgotPasswordMessage {
	message: string;
	success_key: number;
}
