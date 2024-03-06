import { UUID } from "node:crypto";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Product from "../../domain/entity/product";
import CustomerRepositoryInterface from "../../domain/repository/customer.repository.interface";
import CustomerModel from "../database/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.getId(), 
            name: entity.getName(), 
            active: entity.getActive(),
            rewardPoints: entity.getRewardPoints(),
            city: entity.getAddress().getCity(),
            number: entity.getAddress().getNumber(),
            street: entity.getAddress().getStreet(),
            zipcode: entity.getAddress().getZip()
        })
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.getName(), 
                active: entity.getActive(),
                rewardPoints: entity.getRewardPoints(),
                city: entity.getAddress().getCity(),
                number: entity.getAddress().getNumber(),
                street: entity.getAddress().getStreet(),
                zipcode: entity.getAddress().getZip()
            },
            {
                where: {
                    id: entity.getId()
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