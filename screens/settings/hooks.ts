import { ReadPOSProfile } from "@/constants";

export interface GroupedPOSProfile extends Omit<ReadPOSProfile, "user_email"> {
	user_emails: string[];
}

export function groupPOSProfiles(data: ReadPOSProfile[]): GroupedPOSProfile[] {
	// Create a map to group profiles by their unique key (excluding user_email)
	const profileMap = new Map<string, GroupedPOSProfile>();

	for (const item of data) {
		// Create a unique key based on all properties except user_email
		const key = JSON.stringify({
			bank_account: item.bank_account,
			company: item.company,
			cost_center: item.cost_center,
			currency: item.currency,
			customer: item.customer,
			debtor_account: item.debtor_account,
			expense_account: item.expense_account,
			income_account: item.income_account,
			lnmo: item.lnmo,
			project: item.project,
			selling_price_list: item.selling_price_list,
			source_warehouse: item.source_warehouse,
			unrealized_profit: item.unrealized_profit,
			warehouse_name: item.warehouse_name,
			waste_water: item.waste_water,
			write_off_account: item.write_off_account,
		});

		// If the profile doesn't exist in the map, add it
		if (!profileMap.has(key)) {
			const { user_email, ...rest } = item;
			profileMap.set(key, {
				...rest,
				user_emails: [],
			});
		}

		// Add the user email to the profile if it exists
		const profile = profileMap.get(key);
		if (
			item.user_email &&
			profile &&
			!profile.user_emails.includes(item.user_email)
		) {
			profile.user_emails.push(item.user_email);
		}
	}

	// Convert the map values to an array
	return Array.from(profileMap.values());
}
