import { UUID } from "node:crypto";
import Product from "../../domain/entity/product";
import ProductRepositoryInterface from "../../domain/repository/product.repository.interface";
import ProductModel from "../database/sequelize/model/product.model";

export default class ProductRepository implements ProductRepositoryInterface {
    async create(entity: Product): Promise<void> {
        await ProductModel.create({
            id: entity.getId(),
            name: entity.getName(),
            price: entity.getPrice()
        })
    }

    async update(entity: Product): Promise<void> {
        await ProductModel.update(
            {
                name: entity.getName(),
                price: entity.getPrice()
            },
            {
                where: {
                    id: entity.getId()
                }
            }
        )
    }

    async find(id: UUID): Promise<Product> {
        const productModel = await ProductModel.findOne({ where: { id }}) 

        return new Product(
            {
                name: productModel.name,
                price: productModel.price
            }, 
            productModel.id
        )
    }

    async findAll(): Promise<Product[]> {
        const productsModel = await ProductModel.findAll()

        return productsModel.map(productModel => {
            return new Product(
                {
                    name: productModel.name,
                    price: productModel.price
                },
                productModel.id
            )
        })
    }
    
}