import { randomUUID } from "node:crypto"
import Customer from "./customer"
import Address from "../value-object/address";

describe("Customer unit tests", () => {
    const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    it("Deve criar UUID por default ao criar Customer", () => {
        const customer = new Customer({ name: "Matheus" })
        const result = customer.id
        expect(result).toMatch(regexUUID); 
    })

    it("Deve passar UUID ao criar Customer", () => {
        const customerSetId = new Customer({ name: "Matheus" }, randomUUID())
        const result = customerSetId.id
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

        expect(customer.active).toBe(false)
        expect(() => customer.activate())
            .not
            .toThrow(Error("Address is mandatory to activate a customer!")); 
        expect(customer.active).toBe(true)
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

        expect(customer.address).toStrictEqual(address)
    })

    it("Deve validar buscar nome", () => {
        const customer = new Customer({ name: "Matheus" })

        expect(customer.name).toContain("Matheus")
    })

    it("Deve validar a desativação do Customer", () => {
        const customer = new Customer({ name: "Matheus" })
        expect(customer.active).toBe(false)
        const address = new Address({ 
            city: "CG",
            number: 1,
            zip: "12345-678",
            street: "Rua 1"
        })
        customer.changeAddress(address)

        customer.activate()
        customer.deactivate()

        expect(customer.active).toBe(false)
    })

    it("Deve validar a troca de nome do Customer por um vazio ", () => {
        const customer = new Customer({ name: "Matheus" })
        
        expect(() => customer.changeName(""))
            .toThrow(Error("Name is required!"));  
    })

    it("Deve validar a troca de nome do Customer", () => {
        const customer = new Customer({ name: "Matheus" })
        customer.changeName("Matheus Santos")
        
        expect(customer.name).toBe("Matheus Santos")
    })

    it("Deve adicionar rewards points", () => {
        const customer = new Customer({ name: "Matheus" })
        expect(customer.rewardPoints).toBe(0)
        
        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(10)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(20)
    })
})