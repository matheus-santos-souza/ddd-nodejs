import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order-item";
import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import { randomUUID } from "node:crypto";

describe("Order repository test", () => {
    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {
                force: true
            }
        })

        sequelize.addModels([CustomerModel, ProductModel, OrderModel, OrderItemModel]);
        sequelize = await sequelize.sync({ force: true });
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("Deve criar uma nova order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer({ name: 'Customer 1' })
        const address = new Address({
            city: 'city 1',
            number: 1,
            street: 'street 1',
            zip: '12345-678'
        })
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product({ name: 'Product 1', price: 100 })
        await productRepository.create(product)

        const orderItem = new OrderItem({
            name: product.name,
            price: product.price,
            productId: product.id,
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.id, items: [orderItem]})
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({ 
            where: { 
                id: order.id
            },
            include: ["items"]
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            total: order.total,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    product_id: orderItem.productId,
                    quantity: orderItem.quantity,
                    order_id: order.id
                }
            ]
        })

    }) 

    it("Deve atualizar uma order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer({ name: 'Customer 1' })
        const address = new Address({
            city: 'city 1',
            number: 1,
            street: 'street 1',
            zip: '12345-678'
        })
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product({ name: 'Product 1', price: 100 })
        await productRepository.create(product)

        const orderItem = new OrderItem({
            name: product.name,
            price: product.price,
            productId: product.id,
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.id, items: [orderItem]})
        await orderRepository.create(order)

        //atualizando orderItem
        const product2 = new Product({ name: 'Product 2', price: 200 })
        await productRepository.create(product2)

        const orderItem2 = new OrderItem({
            name: product2.name,
            price: product2.price,
            productId: product2.id,
            quantity: 4
        })
        orderItem.quantity = 3
        order.addItem(orderItem2)

        await orderRepository.update(order)

        const orderModel = await OrderModel.findOne({ 
            where: { 
                id: order.id
            },
            include: ["items"]
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            total: order.total,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    product_id: orderItem.productId,
                    quantity: orderItem.quantity,
                    order_id: order.id
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    product_id: orderItem2.productId,
                    quantity: orderItem2.quantity,
                    order_id: order.id
                }
            ]
        })
    }) 

    it("Deve buscar uma order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer({ name: 'Customer 1' })
        const address = new Address({
            city: 'city 1',
            number: 1,
            street: 'street 1',
            zip: '12345-678'
        })
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product({ name: 'Product 1', price: 100 })
        await productRepository.create(product)

        const orderItem = new OrderItem({
            name: product.name,
            price: product.price,
            productId: product.id,
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.id, items: [orderItem]})
        await orderRepository.create(order)

        const findOrder = await orderRepository.find(order.id)

        expect(findOrder).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            total: order.total,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    product_id: orderItem.productId,
                    quantity: orderItem.quantity,
                    order_id: order.id
                }
            ]
        })
    }) 

    it("Deve dar uma exeção ao não encontrar um buscar order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer({ name: 'Customer 1' })
        const address = new Address({
            city: 'city 1',
            number: 1,
            street: 'street 1',
            zip: '12345-678'
        })
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product({ name: 'Product 1', price: 100 })
        await productRepository.create(product)

        const orderItem = new OrderItem({
            name: product.name,
            price: product.price,
            productId: product.id,
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.id, items: [orderItem]})
        await orderRepository.create(order)

        expect(async () => await orderRepository.find(randomUUID()))
            .rejects.toThrow("Order not found!")
    }) 

    it("Deve buscar todos orders", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer({ name: 'Customer 1' })
        const address = new Address({
            city: 'city 1',
            number: 1,
            street: 'street 1',
            zip: '12345-678'
        })
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product({ name: 'Product 1', price: 100 })
        await productRepository.create(product)

        const orderItem = new OrderItem({
            name: product.name,
            price: product.price,
            productId: product.id,
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.id, items: [orderItem]})
        await orderRepository.create(order)

        //Order 2
        const customer2 = new Customer({ name: 'Customer 2' })
        const address2 = new Address({
            city: 'city 2',
            number: 2,
            street: 'street 2',
            zip: '22222-333'
        })
        customer2.changeAddress(address2)
        await customerRepository.create(customer2)

        const product2 = new Product({ name: 'Product 2', price: 200 })
        await productRepository.create(product2)

        const orderItem2 = new OrderItem({
            name: product2.name,
            price: product2.price,
            productId: product2.id,
            quantity: 6
        })

        const order2 = new Order({ customerId: customer2.id, items: [orderItem2]})
        await orderRepository.create(order2)

        const orders = [order, order2].map(order => {
            return {
                id: order.id,
                customerId: order.customerId,
                total: order.id,
                items: order.items.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        orderId: order.id,
                        price: item.price,
                        productId: item.productId,
                        quantity: item.quantity,
                    }
                }),
            }
        })

        const fildAllOrders = await orderRepository.findAll()
        const result = fildAllOrders.map(order => {
            return {
                id: order.id,
                customerId: order.customerId,
                total: order.id,
                items: order.items.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        orderId: order.id,
                        price: item.price,
                        productId: item.productId,
                        quantity: item.quantity,
                    }
                })
            }
        })

        expect(orders).toStrictEqual(result)
    })
})