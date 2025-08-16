interface FieldMetadata {
	fieldname: string;
	label: string;
	fieldtype: string; // 'Data', 'Select', 'Date', 'Number', 'Link'
	required?: boolean;
	options?: string; // For 'Select' or 'Link' fields
	targetDoctype?: string; // For 'Link' fields
}

export interface DocTypeMetadata {
	name: string;
	fields: FieldMetadata[];
}

