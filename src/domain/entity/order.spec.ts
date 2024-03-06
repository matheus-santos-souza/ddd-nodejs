import { randomUUID } from "node:crypto";
import Order from "./order";
import OrderItem from "./order-item";

describe("Order unit tests", () => {
    const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const item1 = new OrderItem({ name: "item 1", price: 10, productId: randomUUID(), quantity: 2 })
    const item2 = new OrderItem({ name: "item 2", price: 15, productId: randomUUID(), quantity: 2 })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("Deve criar UUID por default ao criar Order", () => {
        const order = new Order({ customerId: randomUUID(), items: [item1, item2] })
        const result = order.getId()
        expect(result).toMatch(regexUUID); 
    })

    it("Deve passar UUID ao criar Order", () => {
        const orderSetId = new Order({ customerId: randomUUID(), items: [item1, item2] }, randomUUID())
        const result = orderSetId.getId()
        expect(result).toMatch(regexUUID); 
    })

    it("Deve validar items vazio ao criar uma Order", () => {
        expect(() => new Order({ customerId: randomUUID(), items: [] }))
            .toThrow(new Error('Items are required!')); 
    })

    it("Deve validar a soma total de items", () => {
        const orderUnitItem = new Order({ customerId: randomUUID(), items: [item2] })
        const expectedUnitItem = 30
        expect(orderUnitItem.getTotal()).toBe(expectedUnitItem); 

        const orderMultiItems = new Order({ customerId: randomUUID(), items: [item1, item2] })
        const expectedMultiItems = 50
        expect(orderMultiItems.getTotal()).toBe(expectedMultiItems); 
    })

    it("Deve validar buscar items", () => {
        const items = [item1, item2]
        const order = new Order({ customerId: randomUUID(), items })
        expect(order.getItems()).toStrictEqual(items); 
    })

    it("Deve validar buscar customerId", () => {
        const customerId = randomUUID()
        const order = new Order({ customerId, items: [item1, item2] })
        expect(order.getCustomerId()).toBe(customerId); 
    })

    it("Deve validar ao adicionar um novo item", () => {
        const order = new Order({ customerId: randomUUID(), items: [item1] })
        order.addItem(item2)
        const expectedItems = [item1, item2]
        const expectedSum = 50
        expect(order.getItems()).toStrictEqual(expectedItems); 
        expect(order.getTotal()).toBe(expectedSum); 
    })

})