export interface SalesProducts {
	message: SalesMessage;
}

export interface SalesMessage {
	data: SalesItems[];
}

export interface SalesItems {
	item_name: string;
	item_code: string;
	item_group: string;
	standard_selling_uom: null | string;
	image: null | string;
	price_list_rate: number | null;
	price_list: null | string;
	item_tax_template: string | null;
	tax_rate: number | null;
	tax_type: string | null;
}

export interface PurchaseProducts {
	message: PurchaseMessage;
}

export interface PurchaseMessage {
	data: PurchaseItems[];
}

export interface PurchaseItems {
	item_name: string;
	item_code: string;
	item_group: string;
	stock_uom: string;
	standard_buying_uom: string | null;
	uom: string;
	conversion_factor: number;
	image: null | string;
	price_list_rate: number | null;
	price_list: string | null;
}

// export enum ItemGroup {
// 	Products = "Products",
// 	RawMaterial = "Raw Material",
// 	Stationery = "Stationery",
// 	SubAssemblies = "Sub Assemblies",
// }

// export enum PriceList {
// 	StandardBuying = "Standard Buying",
// }

// export enum StandardBuyingUom {
// 	Litre = "Litre",
// 	Packet = "packet",
// 	Piece = "Piece",
// }

// export enum StockUom {
// 	DecigramLitre = "Decigram/Litre",
// 	Litre = "Litre",
// 	NOS = "Nos",
// 	Piece = "Piece",
// }
