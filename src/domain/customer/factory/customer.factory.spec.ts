import Address from "../value-object/address"
import { CustomerFactory } from "./customer.factory"

describe("Customer Factory test unit", () => {
    
    it("Deve criar um novo cutomer", () => {
        const customer = CustomerFactory.create("Matheus")

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("Matheus")
        expect(customer.address).not.toBeDefined()
    })

    it("Deve criar um novo cutomer com address", () => {
        const address = new Address({
            city: 'City 1',
            number: 1,
            street: 'Street 1',
            zip: '1234567'
        })
        const customer = CustomerFactory.createWithAddress("Matheus", address)

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("Matheus")
        expect(customer.address).toBeDefined()
    })
})