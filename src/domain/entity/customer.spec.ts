import { randomUUID } from "node:crypto"
import Customer from "./customer"
import Address from "./address";

describe("Customer unit tests", () => {
    const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    it("Deve criar UUID por default ao criar Customer", () => {
        const customer = new Customer({ name: "Matheus" })
        const result = customer.getId()
        expect(result).toMatch(regexUUID); 
    })

    it("Deve passar UUID ao criar Customer", () => {
        const customerSetId = new Customer({ name: "Matheus" }, randomUUID())
        const result = customerSetId.getId()
        expect(result).toMatch(regexUUID); 
    })

    it("Deve validar nome Vazio ao Criar Customer", () => {
        expect(() => new Customer({ name: "" }))
            .toThrow(Error("Name is required!")); 
    })

    it("Deve validar active sem Address ao criar Customer", () => {
        expect(() => new Customer({ name: "Matheus", active: true }))
            .toThrow(Error("Address is mandatory to activate a customer!")); 
    })

    it("Deve validar ativação do Customer sem Address", () => {
        const customer = new Customer({ name: "Matheus" })

        expect(() => customer.activate())
            .toThrow(Error("Address is mandatory to activate a customer!")); 
    })

    it("Deve validar ativação do Customer com Address", () => {
        const customer = new Customer({ name: "Matheus" })
        const address = new Address({ 
            city: "CG",
            number: 1,
            zip: "12345-678",
            street: "Rua 1"
        })
        customer.changeAddress(address)

        expect(customer.getActive()).toBe(false)
        expect(() => customer.activate())
            .not
            .toThrow(Error("Address is mandatory to activate a customer!")); 
        expect(customer.getActive()).toBe(true)
    })

    it("Deve validar adicionar Address", () => {
        const customer = new Customer({ name: "Matheus" })
        const address = new Address({ 
            city: "CG",
            number: 1,
            zip: "12345-678",
            street: "Rua 1"
        })
        customer.changeAddress(address)

        expect(customer.getAddress()).toStrictEqual(address)
    })

    it("Deve validar buscar nome", () => {
        const customer = new Customer({ name: "Matheus" })

        expect(customer.getName()).toContain("Matheus")
    })

    it("Deve validar a desativação do Customer", () => {
        const customer = new Customer({ name: "Matheus" })
        expect(customer.getActive()).toBe(false)
        const address = new Address({ 
            city: "CG",
            number: 1,
            zip: "12345-678",
            street: "Rua 1"
        })
        customer.changeAddress(address)

        customer.activate()
        customer.deactivate()

        expect(customer.getActive()).toBe(false)
    })

    it("Deve validar a troca de nome do Customer por um vazio ", () => {
        const customer = new Customer({ name: "Matheus" })
        
        expect(() => customer.changeName(""))
            .toThrow(Error("Name is required!"));  
    })

    it("Deve validar a troca de nome do Customer", () => {
        const customer = new Customer({ name: "Matheus" })
        customer.changeName("Matheus Santos")
        
        expect(customer.getName()).toBe("Matheus Santos")
    })

    it("Deve adicionar rewards points", () => {
        const customer = new Customer({ name: "Matheus" })
        expect(customer.getRewardPoints()).toBe(0)
        
        customer.addRewardPoints(10)
        expect(customer.getRewardPoints()).toBe(10)

        customer.addRewardPoints(10)
        expect(customer.getRewardPoints()).toBe(20)
    })
})