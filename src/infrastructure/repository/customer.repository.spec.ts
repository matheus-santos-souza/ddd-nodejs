import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../database/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
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
        const customerModel = await CustomerModel.findOne({ where: { id: customer.getId() } })

        expect(customerModel.toJSON()).toStrictEqual({ 
            id: customer.getId(), 
            name: customer.getName(), 
            active: customer.getActive(),
            rewardPoints: customer.getRewardPoints(),
            city: address.getCity(),
            number: address.getNumber(),
            street: address.getStreet(),
            zipcode: address.getZip()
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

        const customerModel = await CustomerModel.findOne({ where: { id: customer.getId() } })

        expect(customerModel.toJSON()).toStrictEqual({ 
            id: customer.getId(), 
            name: customer.getName(), 
            active: customer.getActive(),
            rewardPoints: customer.getRewardPoints(),
            city: address2.getCity(),
            number: address2.getNumber(),
            street: address2.getStreet(),
            zipcode: address2.getZip()
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

        const customerModel = await CustomerModel.findOne({ where: { id: customer.getId() } })
        const findCustomer = await customerRepository.find(customer.getId())

        expect(customerModel.toJSON()).toStrictEqual({ 
            id: findCustomer.getId(), 
            name: findCustomer.getName(), 
            active: findCustomer.getActive(),
            rewardPoints: findCustomer.getRewardPoints(),
            city: findCustomer.getAddress().getCity(),
            number: findCustomer.getAddress().getNumber(),
            street: findCustomer.getAddress().getStreet(),
            zipcode: findCustomer.getAddress().getZip()
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
                id: customer.getId(),
                name: customer.getName(), 
                active: customer.getActive(),
                rewardPoints: customer.getRewardPoints(),
                address: {
                    city: customer.getAddress().getCity(),
                    number: customer.getAddress().getNumber(),
                    street: customer.getAddress().getStreet(),
                    zip: customer.getAddress().getZip(),
                }
            }
        })

        const result = findAllCustomer.map(customer => {
            return {
                id: customer.getId(),
                name: customer.getName(), 
                active: customer.getActive(),
                rewardPoints: customer.getRewardPoints(),
                address: {
                    city: customer.getAddress().getCity(),
                    number: customer.getAddress().getNumber(),
                    street: customer.getAddress().getStreet(),
                    zip: customer.getAddress().getZip(),
                }
            }
        })

        expect(findAllCustomer).toHaveLength(2)
        expect(expected).toStrictEqual(result)
    }) 
})