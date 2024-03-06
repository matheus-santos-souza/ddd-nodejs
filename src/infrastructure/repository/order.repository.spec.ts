import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../database/sequelize/model/customer.model";
import OrderItemModel from "../database/sequelize/model/order-item.model";
import ProductModel from "../database/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order-item";
import Order from "../../domain/entity/order";
import OrderModel from "../database/sequelize/model/order.model";
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
            name: product.getName(),
            price: product.getPrice(),
            productId: product.getId(),
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.getId(), items: [orderItem]})
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({ 
            where: { 
                id: order.getId()
            },
            include: ["items"]
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.getId(),
            customer_id: order.getCustomerId(),
            total: order.getTotal(),
            items: [
                {
                    id: orderItem.getId(),
                    name: orderItem.getName(),
                    price: orderItem.getPrice(),
                    product_id: orderItem.getProductId(),
                    quantity: orderItem.getQuantity(),
                    order_id: order.getId()
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
            name: product.getName(),
            price: product.getPrice(),
            productId: product.getId(),
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.getId(), items: [orderItem]})
        await orderRepository.create(order)

        //atualizando orderItem
        const product2 = new Product({ name: 'Product 2', price: 200 })
        await productRepository.create(product2)

        const orderItem2 = new OrderItem({
            name: product2.getName(),
            price: product2.getPrice(),
            productId: product2.getId(),
            quantity: 4
        })
        orderItem.changeQuantity(3)
        order.addItem(orderItem2)

        await orderRepository.update(order)

        const orderModel = await OrderModel.findOne({ 
            where: { 
                id: order.getId()
            },
            include: ["items"]
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.getId(),
            customer_id: order.getCustomerId(),
            total: order.getTotal(),
            items: [
                {
                    id: orderItem.getId(),
                    name: orderItem.getName(),
                    price: orderItem.getPrice(),
                    product_id: orderItem.getProductId(),
                    quantity: orderItem.getQuantity(),
                    order_id: order.getId()
                },
                {
                    id: orderItem2.getId(),
                    name: orderItem2.getName(),
                    price: orderItem2.getPrice(),
                    product_id: orderItem2.getProductId(),
                    quantity: orderItem2.getQuantity(),
                    order_id: order.getId()
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
            name: product.getName(),
            price: product.getPrice(),
            productId: product.getId(),
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.getId(), items: [orderItem]})
        await orderRepository.create(order)

        const findOrder = await orderRepository.find(order.getId())

        expect(findOrder).toStrictEqual({
            id: order.getId(),
            customer_id: order.getCustomerId(),
            total: order.getTotal(),
            items: [
                {
                    id: orderItem.getId(),
                    name: orderItem.getName(),
                    price: orderItem.getPrice(),
                    product_id: orderItem.getProductId(),
                    quantity: orderItem.getQuantity(),
                    order_id: order.getId()
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
            name: product.getName(),
            price: product.getPrice(),
            productId: product.getId(),
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.getId(), items: [orderItem]})
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
            name: product.getName(),
            price: product.getPrice(),
            productId: product.getId(),
            quantity: 2
        })

        const orderRepository = new OrderRepository()
        const order = new Order({ customerId: customer.getId(), items: [orderItem]})
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
            name: product2.getName(),
            price: product2.getPrice(),
            productId: product2.getId(),
            quantity: 6
        })

        const order2 = new Order({ customerId: customer2.getId(), items: [orderItem2]})
        await orderRepository.create(order2)

        const orders = [order, order2].map(order => {
            return {
                id: order.getId(),
                customerId: order.getCustomerId(),
                total: order.getId(),
                items: order.getItems().map(item => {
                    return {
                        id: item.getId(),
                        name: item.getName(),
                        orderId: order.getId(),
                        price: item.getPrice(),
                        productId: item.getProductId(),
                        quantity: item.getQuantity(),
                    }
                }),
            }
        })

        const fildAllOrders = await orderRepository.findAll()
        const result = fildAllOrders.map(order => {
            return {
                id: order.getId(),
                customerId: order.getCustomerId(),
                total: order.getId(),
                items: order.getItems().map(item => {
                    return {
                        id: item.getId(),
                        name: item.getName(),
                        orderId: order.getId(),
                        price: item.getPrice(),
                        productId: item.getProductId(),
                        quantity: item.getQuantity(),
                    }
                })
            }
        })

        expect(orders).toStrictEqual(result)
    })
})