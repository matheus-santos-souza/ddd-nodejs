import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order-item";

export default class OrderService {
    static totalOrders(orders: Order[]): number {
        return orders.reduce((acc, order) => acc + order.total, 0)
    }

    static placeOrder(customer: Customer, items: OrderItem[]): Order {
        if (!items.length) {
            throw new Error("Items is required!")
        }

        const order = new Order({ items, customerId: customer.id })
        customer.addRewardPoints(order.total/2)
        return order
    }
}