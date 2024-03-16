import { randomUUID } from "crypto"
import Order from "../entity/order"
import OrderItem from "../entity/order-item"
import OrderService from "./order.service"
import Customer from "../../customer/entity/customer"

describe("OrderService unit tests", () => {

    it("Deve estourar um erro ao fazer um pedido sem items", () => {
        const customer = new Customer({ name: "Customer 1" })

        expect(() => OrderService.placeOrder(customer, []))
            .toThrow(new Error("Items is required!"))
    })

    it("Deve fazer um pedido", () => {
        const customer = new Customer({ name: "Customer 1" })
        const item1 = new OrderItem({ name: "Item 1", price: 10, productId: randomUUID(), quantity: 1 })
       
        const order = OrderService.placeOrder(customer, [item1])

        expect(customer.rewardPoints).toBe(5)
        expect(order.total).toBe(10)
    })

    it("Deve somar o total de todas as Orders", () => {
        const item1 = new OrderItem({ name: "Item 1", price: 10, productId: randomUUID(), quantity: 2 })
        const item2 = new OrderItem({ name: "Item 2", price: 15, productId: randomUUID(), quantity: 2 })
        const item3 = new OrderItem({ name: "Item 3", price: 30, productId: randomUUID(), quantity: 3 })
        const order1 = new Order({ customerId: randomUUID(), items: [item1, item2] })
        const order2 = new Order({ customerId: randomUUID(), items: [item3] })
        const orders = [order1, order2]

        const total = OrderService.totalOrders(orders)

        expect(total).toBe(140)
    })
})