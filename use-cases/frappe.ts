import { CreatePurchaseInvoices, ReadWarehouseList } from "@/constants";
import { appConfig } from "@/utils/config";
import { HillFreshError } from "@/utils/customError";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { router } from "expo-router";
import { getItem } from "expo-secure-store";
import { Platform, ToastAndroid } from "react-native";

export class FrappeInstance {
	private request_token?: string;
	private mainClient: AxiosInstance;
	private buyingClient: AxiosInstance;
	private sellingClient: AxiosInstance;

	constructor() {
		// Initialize clients first, then set up token
		this.mainClient = this.createClient(appConfig.FRAPPE_URL);
		this.buyingClient = this.createClient(
			appConfig.BUYING_URL,
			5000,
			"Failed to pull Products to Buy"
		);
		this.sellingClient = this.createClient(
			appConfig.SELLING_URL,
			5000,
			"Failed to pull Products to Sell"
		);

		this.initializeToken();
	}

	/**
	 * Creates an Axios client with interceptors
	 */
	private createClient(
		baseURL: string,
		timeout: number = 10000,
		timeoutErrorMessage?: string
	): AxiosInstance {
		const client = axios.create({
			baseURL,
			timeout,
			timeoutErrorMessage,
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Request interceptor - adds token to all requests
		client.interceptors.request.use(
			config => {
				if (this.request_token) {
					config.headers.Authorization = `token ${this.request_token}`;
				}
				return config;
			},
			error => Promise.reject(error)
		);

		// Response interceptor - handles errors globally
		client.interceptors.response.use(
			response => response,
			(error: AxiosError) => {
				this.handleApiError(error);
				return Promise.reject(error);
			}
		);

		return client;
	}

	/**
	 * Platform-specific error handling
	 */
	private handleApiError(error: AxiosError) {
		const status = error.response?.status;

		switch (status) {
			case 401:
			case 403:
				this.redirectToLogin("Authentication failed. Please login again.");
				break;
			case 404:
				this.showPlatformError("Resource not found");
				break;
			case 500:
				this.showPlatformError("Server error occurred");
				break;
			default:
				if (!error.response) {
					this.showPlatformError("Network error. Check your connection.");
				}
		}
	}

	/**
	 * Platform-specific error display
	 */
	private showPlatformError(message: string) {
		if (Platform.OS === "android") {
			ToastAndroid.show(message, ToastAndroid.SHORT);
		}
		// Add iOS/web specific error handling here if needed
		// For now, we could throw a custom error or use a cross-platform solution
		throw new HillFreshError({ message });
	}

	/**
	 * Get token from platform-specific storage
	 */
	private getTokenFromStorage(): string | null {
		if (Platform.OS === "web") {
			return localStorage.getItem("auth_token");
		}
		return getItem("auth_token");
	}

	/**
	 * Redirect to login with optional message
	 */
	private redirectToLogin(
		message: string = "Cannot proceed with the action. Login and try again"
	) {
		if (Platform.OS === "android") {
			ToastAndroid.show(message, ToastAndroid.SHORT);
		}
		router.replace("/login");
	}

	/**
	 * Initialize token from storage
	 */
	private async initializeToken() {
		const token = this.getTokenFromStorage();
		if (!token) {
			this.redirectToLogin();
			return;
		}
		this.request_token = token;
	}

	/**
	 * Update token and refresh all clients
	 */
	public setToken(token: string) {
		this.request_token = token;
		// Token will be automatically added by interceptors on next request
	}

	/**
	 * Clear token and redirect to login
	 */
	public clearToken() {
		this.request_token = undefined;
		this.redirectToLogin("Session expired. Please login again.");
	}

	// Public API methods using the configured clients
	public getFrappeClient(): AxiosInstance {
		return this.mainClient;
	}

	public getBuyingClient(): AxiosInstance {
		return this.buyingClient;
	}

	public getSellingClient(): AxiosInstance {
		return this.sellingClient;
	}

	/**
	 * Submit document to Frappe
	 */
	public async frappeSubmit({ doc }: { doc: any }): Promise<any> {
		try {
			const response = await axios.post(
				appConfig.CLIENT,
				{ doc },
				{
					headers: {
						Authorization: `token ${this.request_token!}`,
						"Content-Type": "application/json",
					},
					timeout: 5000,
					timeoutErrorMessage: "Failed to Submit",
				}
			);
			return response.data;
		} catch (error) {
			throw new HillFreshError({ message: "Failed to submit document" });
		}
	}

	/**
	 * Cancel/Delete document in Frappe
	 */
	public async frappeCancel({
		name,
		doctype,
	}: {
		name: string;
		doctype: string;
	}): Promise<{ [key: string]: any }> {
		try {
			const response: AxiosResponse<{ message: { [key: string]: any } }> =
				await this.mainClient.post(process.env.EXPO_PUBLIC_FRAPPE_DELETE!, {
					doctype,
					name,
				});
			return response.data.message;
		} catch (error) {
			throw new HillFreshError({ message: "Failed to cancel document" });
		}
	}

	/**
	 * Get warehouses for a company
	 */
	public async frappeGetWarehouses({
		company,
	}: {
		company: string;
	}): Promise<ReadWarehouseList[]> {
		try {
			const response: AxiosResponse<{
				message: { data: ReadWarehouseList[] };
			}> = await this.mainClient.post(appConfig.WAREHOUSE_URL, { company });

			return response.data.message.data;
		} catch (error: any) {
			throw new HillFreshError({
				message: error.message || "Failed to retrieve warehouses",
			});
		}
	}

	/**
	 * Construct invoice data from purchase order
	 */
	public async frappeConstructInvoiceData({
		purchaseOrder,
	}: {
		purchaseOrder: string;
	}): Promise<CreatePurchaseInvoices> {
		try {
			const response: AxiosResponse<{ message: CreatePurchaseInvoices }> =
				await this.mainClient.post(
					appConfig.GET_INVOICE_DATA,
					{ purchase_order: purchaseOrder },
					{
						timeout: 5000,
						timeoutErrorMessage: "Failed to pull invoice data",
					}
				);
			return response.data.message;
		} catch (error) {
			throw new HillFreshError({
				message: "Could not get Purchase Invoice data",
			});
		}
	}
}
