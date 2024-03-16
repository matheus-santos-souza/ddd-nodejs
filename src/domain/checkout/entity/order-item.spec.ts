import { randomUUID } from "node:crypto";
import OrderItem from "./order-item";

describe("Order Item unit tests", () => {
    const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    it("Deve criar UUID por default ao criar Order Item", () => {
        const item = new OrderItem({ name: "item 1", price: 10, productId: randomUUID(), quantity: 2 })
        const result = item.id
        expect(result).toMatch(regexUUID); 
    })

    it("Deve passar UUID ao criar Order Item", () => {
        const item = new OrderItem({ name: "item 1", price: 10, productId: randomUUID(), quantity: 2 }, randomUUID())
        const result = item.id
        expect(result).toMatch(regexUUID); 
    })

    it("Deve validar nome vazio", () => {
        expect(() => new OrderItem({ name: "", price: 10, productId: randomUUID(), quantity: 2 }))
            .toThrow(new Error('Name is required!')); 
    })

    it("Deve validar preço menor que 0", () => {
        expect(() => new OrderItem({ name: "Item 1", price: -1, productId: randomUUID(), quantity: 2 }))
            .toThrow(new Error('price cannot be less than 0!'))
    })

    it("Deve validar quantity menor ou igual a 0", () => {
        expect(() => new OrderItem({ name: "Item 1", price: 10, productId: randomUUID(), quantity: 0 }))
            .toThrow(new Error('Quantity cannot be less than 0!'))
    })

    it("Deve validar buscar customerId", () => {
        const productId = randomUUID()
        const order = new OrderItem({ name: "Item 1", price: 10, productId, quantity: 2 })
        expect(order.productId).toBe(productId); 
    })

    it("Deve validar buscar quantity", () => {
        const quantity = 2
        const order = new OrderItem({ name: "Item 1", price: 10, productId: randomUUID(), quantity })
        expect(order.quantity).toBe(quantity); 
    })

    it("Deve validar buscar o price", () => {
        const order = new OrderItem({ name: "Item 1", price: 10, productId: randomUUID(), quantity: 2 })
        expect(order.price).toBe(10); 
    })

    it("Deve validar buscar o nome", () => {
        const order = new OrderItem({ name: "Item 1", price: 10, productId: randomUUID(), quantity: 2 })
        expect(order.name).toBe("Item 1"); 
    })

})