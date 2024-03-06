import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order-item";

export default class OrderService {
    static totalOrders(orders: Order[]): number {
        return orders.reduce((acc, order) => acc + order.getTotal(), 0)
    }

    static placeOrder(customer: Customer, items: OrderItem[]): Order {
        if (!items.length) {
            throw new Error("Items is required!")
        }

        const order = new Order({ items, customerId: customer.getId() })
        customer.addRewardPoints(order.getTotal()/2)
        return order
    }
}