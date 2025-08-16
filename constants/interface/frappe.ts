export interface FrappeCreateRequirement {
	retrieveNamingSeries: () => Promise<{ naming_series: string }>;
}
