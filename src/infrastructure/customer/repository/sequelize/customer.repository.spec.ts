import { Sequelize } from "sequelize-typescript"
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import { randomUUID } from "crypto";

describe("Customer repository test", () => {
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

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close()
    })

     it("Deve criar um novo customer", async () => {
        const customerRepository = new CustomerRepository()
        const address = new Address({
            city: "CITY 1",
            number: 10,
            street: "Street 1",
            zip: "12345-678"
        })
        const customer = new Customer({
            name: "Customer 1",
            address: address
        })

        await customerRepository.create(customer)
        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } })

        expect(customerModel.toJSON()).toStrictEqual({ 
            id: customer.id, 
            name: customer.name, 
            active: customer.active,
            rewardPoints: customer.rewardPoints,
            city: address.city,
            number: address.number,
            street: address.street,
            zipcode: address.zip
        })
    })

    
    it("Deve atualizar um customer", async () => {
        const customerRepository = new CustomerRepository()
        const address = new Address({
            city: "CITY 1",
            number: 10,
            street: "Street 1",
            zip: "12345-678"
        })
        const customer = new Customer({
            name: "Customer 1",
            address: address
        })

        await customerRepository.create(customer)

        customer.changeName("Customer 2")
        const address2 = new Address({
            city: "CITY 2",
            number: 20,
            street: "Street 2",
            zip: "87654-321"
        })
        
        customer.changeAddress(address2)

        await customerRepository.update(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } })

        expect(customerModel.toJSON()).toStrictEqual({ 
            id: customer.id, 
            name: customer.name, 
            active: customer.active,
            rewardPoints: customer.rewardPoints,
            city: address2.city,
            number: address2.number,
            street: address2.street,
            zipcode: address2.zip
        })
    })

    it("Deve buscar um customer", async () => {
        const customerRepository = new CustomerRepository()
        const address = new Address({
            city: "CITY 1",
            number: 10,
            street: "Street 1",
            zip: "12345-678"
        })
        const customer = new Customer({
            name: "Customer 1",
            address: address
        })

        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } })
        const findCustomer = await customerRepository.find(customer.id)

        expect(customerModel.toJSON()).toStrictEqual({ 
            id: findCustomer.id, 
            name: findCustomer.name, 
            active: findCustomer.active,
            rewardPoints: findCustomer.rewardPoints,
            city: findCustomer.address.city,
            number: findCustomer.address.number,
            street: findCustomer.address.street,
            zipcode: findCustomer.address.zip
        })
    })

    it("Deve rejeitar um customer que não existe", async () => {
        const customerRepository = new CustomerRepository()
        
        expect(async () => await customerRepository.find(randomUUID()))
            .rejects.toThrow("Customer not found!")
    })



    it("Deve buscar todos os customers", async () => {
        const customerRepository = new CustomerRepository()
        const address = new Address({
            city: "CITY 1",
            number: 10,
            street: "Street 1",
            zip: "12345-678"
        })
        const customer = new Customer({
            name: "Customer 1",
            address: address
        })

        const address2 = new Address({
            city: "CITY 2",
            number: 20,
            street: "Street 2",
            zip: "87654-321"
        })
        const customer2 = new Customer({
            name: "Customer 2",
            address: address
        })

        await customerRepository.create(customer)
        await customerRepository.create(customer2)

        const findAllCustomer = await customerRepository.findAll()

        const expected = [customer, customer2].map(customer => {
            return {
                id: customer.id,
                name: customer.name, 
                active: customer.active,
                rewardPoints: customer.rewardPoints,
                address: {
                    city: customer.address.city,
                    number: customer.address.number,
                    street: customer.address.street,
                    zip: customer.address.zip,
                }
            }
        })

        const result = findAllCustomer.map(customer => {
            return {
                id: customer.id,
                name: customer.name, 
                active: customer.active,
                rewardPoints: customer.rewardPoints,
                address: {
                    city: customer.address.city,
                    number: customer.address.number,
                    street: customer.address.street,
                    zip: customer.address.zip,
                }
            }
        })

        expect(findAllCustomer).toHaveLength(2)
        expect(expected).toStrictEqual(result)
    }) 
})