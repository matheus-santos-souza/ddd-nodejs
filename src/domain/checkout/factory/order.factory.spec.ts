import { randomUUID } from "crypto"
import { OrderFactory } from "./order.factory"

describe("Order Factory test unit", () => {

    it("Deve criar um nova order", () => {
        const orderProps = {
            id: randomUUID(),
            customerId: randomUUID(),
            items: [
                {
                    id: randomUUID(),
                    name: "Product 1",
                    productId: randomUUID(),
                    quantity: 1,
                    price: 100
                }
            ]
        }

        const order = OrderFactory.create(orderProps)

        expect(order.id).toEqual(orderProps.id)
        expect(order.customerId).toEqual(orderProps.customerId)
        expect(order.items.length).toEqual(orderProps.items.length)
    })
})