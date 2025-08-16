

import { FrappeCreateRequirement } from "@/constants";
import { HillFreshError } from "@/utils/customError";
import { useEffect, useState } from "react";

//
//This hook will be used to retrieve the naming series needed for the isolated docTypes
//affected by the Create Operation. This way, if a docType naming_field is changed,
//we are able to retrieve the data.
//All classes must implement the retrieve naming series field.

export function useNamingSeries({ classObject }: { classObject: any }) {
	const [namingSeries, setNamingSeries] = useState<string>("");
	//
	if (classObject satisfies FrappeCreateRequirement) {
		useEffect(() => {
			const getNamingSeries = async () => {
				const obj = await classObject.retrieveNamingSeries();
				return setNamingSeries(obj.naming_series);
			};

			getNamingSeries();
		}, [classObject]);
	} else {
		throw new HillFreshError({ message: "Missing Class Implementation" });
	}

	return namingSeries;
}
