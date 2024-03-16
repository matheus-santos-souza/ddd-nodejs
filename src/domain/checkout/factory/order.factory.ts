import { UUID } from "crypto";
import { OrderInterface } from "../entity/order.interface";
import Order from "../entity/order";
import OrderItem from "../entity/order-item";

interface OrderFactoryProps {
    id: UUID,
    customerId: UUID,
    items: {
        id: UUID,
        name: string,
        productId: UUID,
        quantity: number,
        price: number
    }[]
}

export class OrderFactory {

    public static create(props: OrderFactoryProps): OrderInterface {
        const items = props.items.map(item => {
            return new OrderItem({
                name: item.name,
                price: item.price,
                productId: item.productId,
                quantity: item.quantity
            }, item.id)
        })

        return new Order({
            customerId: props.customerId,
            items
        }, props.id)
    }
}