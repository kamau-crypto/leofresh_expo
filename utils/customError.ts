//
//This React class was created to help handle error that might occur within the system. I.e server
//side errors. So if on mobile we want to throw an error, yes we throw an error, but to let
//the user know of the next step, we create a handler that is isolated for reporting the error.

import { showSnackBar } from "@/components/context/SnackBarContext";
import { SnackBarActionProps } from "@/constants";

//The other thing it does is helping the problem of dependecy injection.
//Without this, we would need to add pass the error reporting mechanism with each method as
//a parameter. such that each method has a parameter for error handling. This approach is tedious

export class HillFreshError extends Error {
	constructor({
		message,
		action,
	}: {
		message: string;
		action?: SnackBarActionProps;
	}) {
		super();
		this.message = message;
		showSnackBar({ message: this.message, action: action });
	}
}
