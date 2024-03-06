import { randomUUID } from "node:crypto";
import Product from "./product";

describe("Product unit tests", () => {
    const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    it("Deve criar UUID por default ao criar Order", () => {
        const product = new Product({ name: "Product 1", price: 100 })
        const result = product.getId()
        expect(result).toMatch(regexUUID); 
    })

    it("Deve passar UUID ao criar Order", () => {
        const product = new Product({ name: "Product 1", price: 100 }, randomUUID())
        const result = product.getId()
        expect(result).toMatch(regexUUID); 
    })

    it("Deve validar nome vazio", () => {
        expect(() => new Product({ name: "", price: 100 }))
            .toThrow(new Error('Name is required!'))
    })

    it("Deve validar preço menor que 0", () => {
        expect(() => new Product({ name: "Product 1", price: -1 }))
            .toThrow(new Error('price cannot be less than 0!'))
    })

    it("Deve validar trocar nome do produto", () => {
        const product = new Product({ name: "Product 1", price: 100 })
        product.changeName('Product 2')
        expect(product.getName()).toBe("Product 2")

        expect(() => product.changeName(''))
            .toThrow(new Error('Name is required!'))
    })

    it("Deve validar trocar preço do produto", () => {
        const product = new Product({ name: "Product 1", price: 100 })
        product.changePrice(250)
        expect(product.getPrice()).toBe(250)

        expect(() => product.changePrice(-1))
            .toThrow(new Error('price cannot be less than 0!'))
    })

})