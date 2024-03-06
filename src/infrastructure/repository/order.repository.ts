import { UUID } from "node:crypto";
import OrderRepositoryInterface from "../../domain/repository/customer.repository.interface copy";
import OrderModel from "../database/sequelize/model/order.model";
import Order from "../../domain/entity/order";
import OrderItemModel from "../database/sequelize/model/order-item.model";
import OrderItem from "../../domain/entity/order-item";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.getId(), 
                customer_id: entity.getCustomerId(),
                total: entity.getTotal(),
                items: entity.getItems().map(item => {
                    return {
                        id: item.getId(),
                        name: item.getName(),
                        price: item.getPrice(),
                        product_id: item.getProductId(),
                        quantity: item.getQuantity()
                    }
                })
            },
            {
                include: [{ model: OrderItemModel }]
            }
        )
    }

    async update(entity: Order): Promise<void> {
        const createOrUpdateOrderItems = entity.getItems().map(orderItem => {
            return OrderItemModel.upsert(
                {
                    id: orderItem.getId(),
                    name: orderItem.getName(),
                    price: orderItem.getPrice(),
                    product_id: orderItem.getProductId(),
                    quantity: orderItem.getQuantity(),
                    order_id: entity.getId()
                }
            )
        })

        await Promise.allSettled(createOrUpdateOrderItems)

        await OrderModel.update(
            {
                customer_id: entity.getCustomerId(),
                total: entity.getTotal()
            },
            {
                where: {
                    id: entity.getId()
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