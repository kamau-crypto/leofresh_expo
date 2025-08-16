import {
	IWarehouse,
	ReadWarehousesList,
	ReadWarehouseStockLevel,
	WarehouseEnum,
} from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { extractFrappeErrorMessage } from "@/utils/error_handler";
import { AxiosInstance, AxiosResponse } from "axios";
import { FrappeInstance } from "./frappe";

export class Warehouse extends FrappeInstance {
	private warehouseInstance: AxiosInstance;
	private DocType: string;
	constructor({ docType }: { docType: string }) {
		super();
		this.DocType = docType;
		this.warehouseInstance = this.getFrappeClient();
	}

	async retrieveCompanyWarehouses({ company }: { company: string }) {
		return await this.frappeGetWarehouses({ company });
	}

	async retrieveWarehouses({ page_length }: { page_length: number }) {
		try {
			const whses: AxiosResponse<{ data: ReadWarehousesList[] }> =
				await this.warehouseInstance.get(this.DocType, {
					params: {
						fields: JSON.stringify(["name", "is_group", "parent_warehouse"]),
						limit_page_length: page_length,
					},
				});
			return whses.data.data;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({
				message: `Failed to fetch HillFresh Errors ${msg}`,
			});
		}
	}

	async retrieveStockQuantities({ warehouse }: { warehouse: string }) {
		try {
			const stockQuantities: AxiosResponse<{
				data: ReadWarehouseStockLevel[];
			}> = await this.warehouseInstance.get(this.DocType, {
				params: {
					fields: JSON.stringify([
						"item_code",
						"warehouse",
						"actual_qty",
						"stock_uom",
					]),
					filters: JSON.stringify([["warehouse", "=", `${warehouse}`]]),
				},
			});
			return stockQuantities.data.data;
		} catch (e: any) {
			const msg = extractFrappeErrorMessage(e);
			throw new HillFreshError({
				message: `Failed to retrieve the stock at warehouse ${msg}`,
			});
		}
	}

	async retrive_customer_warehouse({
		page_length,
		customer,
	}: {
		page_length: number;
		customer: string;
	}) {
		try {
			const warehouseSimilarity = customer.replace(/\w+/, "");
			const warehouses: AxiosResponse<IWarehouse> =
				await this.warehouseInstance.get(this.DocType, {
					params: {
						fields: JSON.stringify(Object.values(WarehouseEnum)),
						limit_page_length: page_length,
						filters: JSON.stringify([
							["warehouse_name", "Like", `%${warehouseSimilarity}%`],
						]),
					},
				});
			return warehouses.data;
		} catch (error: any) {
			const msg = extractFrappeErrorMessage(error);
			throw new HillFreshError({ message: msg });
		}
	}
}
