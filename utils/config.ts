//Config credentials for the app. These are end point credentials for the application that allow for the development of app environments within my application. They are placed here for future environment safety.
// const URL = "https://test.hillfresh.co.ke";
const URL = "http://192.168.100.16:8000";
const API = `${URL}/api`;

export const appConfig = {
	PUBLIC_URL: URL,
	API: API,
	FRAPPE_URL: `${API}/resource`,
	CLIENT: `${API}/method/frappe.client.submit`,
	CANCEL: `${API}/method/frappe.client.cancel`,
	LOGIN_URL: `${API}/method/icrm.api.login`,
	FORGOT_PASSWORD: `${API}/method/icrm.api.forgot_password`,
	CHANGE_PASSWORD: `${API}/method/icrm.api.change_password`,
	WAREHOUSE_URL: `${API}/method/icrm.api.get_warehouses`,
	BUYING_URL: `${API}/method/icrm.api.buying_item_prices`,
	SELLING_URL: `${API}/method/icrm.api.selling_item_prices`,
	GET_INVOICE_DATA: `${API}/method/icrm.api.get_purchase_invoice_data`,
	EXPENSES_URL: `${API}/method/icrm.api.retrieve_expenses`,
};
