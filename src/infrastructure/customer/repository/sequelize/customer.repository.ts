import { UUID } from "node:crypto";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import Product from "../../../../domain/product/entity/product";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer.repository.interface";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id, 
            name: entity.name, 
            active: entity.active,
            rewardPoints: entity.rewardPoints,
            city: entity.address.city,
            number: entity.address.number,
            street: entity.address.street,
            zipcode: entity.address.zip
        })
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name, 
                active: entity.active,
                rewardPoints: entity.rewardPoints,
                city: entity.address.city,
                number: entity.address.number,
                street: entity.address.street,
                zipcode: entity.address.zip
            },
            {
                where: {
                    id: entity.id
                }
            }
        )
    }

    async find(id: UUID): Promise<Customer> {
        try {
            const customerModel = await CustomerModel.findOne({ where: { id }}) 

            return new Customer(
                {
                    name: customerModel.name, 
                    active: customerModel.active,
                    rewardPoints: customerModel.rewardPoints,
                    address: new Address({
                        city: customerModel.city,
                        number: customerModel.number,
                        street: customerModel.street,
                        zip: customerModel.zipcode,
                    })
                }, 
                customerModel.id
            )    
        } catch (error) {
            throw new Error("Customer not found!")
        }  
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll()

        return customerModels.map(customerModel => {
            return new Customer(
                {
                    name: customerModel.name, 
                    active: customerModel.active,
                    rewardPoints: customerModel.rewardPoints,
                    address: new Address({
                        city: customerModel.city,
                        number: customerModel.number,
                        street: customerModel.street,
                        zip: customerModel.zipcode,
                    })
                }, 
                customerModel.id
            )
        })
    }
    
}