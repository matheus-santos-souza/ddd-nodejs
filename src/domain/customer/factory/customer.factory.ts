import Customer from "../entity/customer";
import { CustomerInterface } from "../entity/customer.interface";
import Address from "../value-object/address";

export class CustomerFactory {
    public static create(name: string): CustomerInterface {
        return new Customer({ name })
    }

    public static createWithAddress(name: string, address: Address): CustomerInterface {
        return new Customer({ name, address })
    }
}