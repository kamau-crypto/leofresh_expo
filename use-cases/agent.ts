import { HillFreshError } from "@/utils/customError";
import { FrappeInstance } from "./frappe";

export class Agent extends FrappeInstance {
  constructor() {
    super();
  }
  async retrieveCustomerDetails() {
    try {
    } catch (e: any) {
      throw new HillFreshError({
        message: "Customer with such a name does not exist",
      });
    }
  }
}
