interface FrappeErrorResponse {
	_server_messages?: string; // Often contains the primary error
	exception?: string; // Full exception trace
	exc_type?: string; // Error type (ValidationError, PermissionError, etc.)
	exc?: string[]; // Raw exception trace
	message?: string; // Sometimes contains simple message
	error?: {
		// Some errors nest here
		message?: string;
		exc?: string[];
	};
	httpStatus?: number; // HTTP status code
	_error_message?: string; // Alternative message location
}

export function extractFrappeErrorMessage(error: any): string {
	// Handle Axios errors
	if (isAxiosError(error)) {
		return extractFrappeErrorMessage(error.response?.data);
	}

	// Handle Frappe error response objects
	if (typeof error === "object" && error !== null) {
		const frappeError = error as FrappeErrorResponse;

		// Check _server_messages (most common for user-friendly messages)
		if (frappeError._server_messages) {
			try {
				const messages = JSON.parse(frappeError._server_messages);
				if (Array.isArray(messages) && messages.length > 0) {
					const firstMessage = JSON.parse(messages[0]);
					if (firstMessage.message) {
						return firstMessage.message.replace(/<[^>]*>/g, "").trim();
					}
				}
			} catch (e) {
				console.log("Failed to parse _server_messages", e);
			}
		}

		// Check exception field (contains full exception string)
		if (frappeError.exception) {
			const parts = frappeError.exception.split(":");
			if (parts.length > 1) {
				return parts.slice(1).join(":").trim();
			}
		}

		// Check nested error object
		if (frappeError.error?.message) {
			return frappeError.error.message;
		}

		// Check direct message fields
		if (frappeError.message) {
			return frappeError.message;
		}

		// Check exc array (raw traceback)
		if (frappeError.exc?.[0]) {
			const excStr = frappeError.exc[0];
			const match = excStr.match(/frappe\.exceptions\.\w+Error: (.+)/);
			if (match) {
				return match[1];
			}
		}
	}

	// Fallback to string conversion
	if (typeof error === "string") return error;
	if (error?.toString) return error.toString();

	return "An unknown error occurred";
}

function isAxiosError(
	error: any
): error is { isAxiosError: boolean; response?: any } {
	return error?.isAxiosError === true;
}
