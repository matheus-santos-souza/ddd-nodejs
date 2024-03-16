import { UUID } from "node:crypto";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order.repository.interface";
import OrderModel from "./order.model";
import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderItem from "../../../../domain/checkout/entity/order-item";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id, 
                customer_id: entity.customerId,
                total: entity.total,
                items: entity.items.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        product_id: item.productId,
                        quantity: item.quantity
                    }
                })
            },
            {
                include: [{ model: OrderItemModel }]
            }
        )
    }

    async update(entity: Order): Promise<void> {
        const createOrUpdateOrderItems = entity.items.map(orderItem => {
            return OrderItemModel.upsert(
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    product_id: orderItem.productId,
                    quantity: orderItem.quantity,
                    order_id: entity.id
                }
            )
        })

        await Promise.allSettled(createOrUpdateOrderItems)

        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total
            },
            {
                where: {
                    id: entity.id
                },
            }
        )
    }

    async find(id: UUID): Promise<Order> {
        try {
            const orderModel = await OrderModel.findOne({ 
                where: { id },
                include: [OrderItemModel],
            }) 
            return orderModel.toJSON()
        } catch (error) {
            throw new Error("Order not found!")
        }  
    }

    async findAll(): Promise<Order[]> {
        const orderModel = await OrderModel.findAll({ include: [OrderItemModel] })

        return orderModel.map(orderModel => {
            const orderToJson = orderModel.toJSON()
            return new Order(
                {
                    customerId: orderToJson.customer_id,
                    items: orderToJson.items.map(item => {
                        return new OrderItem({
                            name: item.name,
                            price: item.price,
                            productId: item.product_id,
                            quantity: item.quantity
                        },
                            item.id
                        )
                    })
                },
                orderToJson.id
            )
        })
    }
    
}