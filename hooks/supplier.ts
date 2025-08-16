import { Supplier, TypedSupplier } from "@/services";
import { useResultStore } from "@/store/result";
import { useEffect, useState } from "react";

export function useGetSuppliers() {
	const supplier = new Supplier({ docType: "Supplier" });
	const { limit } = useResultStore();
	const [allSuppliers, setAllSuppliers] = useState<TypedSupplier[]>([]);
	useEffect(() => {
		const retrieveSuppliers = async () => {
			const suppliers = await supplier.getAllSuppliers({ limit });
			if (suppliers) {
				setAllSuppliers(suppliers);
			}
		};
		retrieveSuppliers();
	}, [limit]);

	return { suppliers: allSuppliers };
}
