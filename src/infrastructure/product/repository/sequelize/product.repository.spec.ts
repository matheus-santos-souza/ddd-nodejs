import { Sequelize } from "sequelize-typescript"
import ProductModel from "./product.model";
import Product from "../../../../domain/product/entity/product";
import ProductRepository from "./product.repository";

describe("Product repository test", () => {
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

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("Deve criar um novo product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product({ name: "Product 1", price: 100 })

        await productRepository.create(product)
        const productModel = await ProductModel.findOne({ where: { id: product.id } })

        expect(productModel.toJSON()).toStrictEqual({ 
            id: product.id, 
            name: product.name, 
            price: product.price 
        })
    })

    it("Deve atualizar um product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product({ name: "Product 1", price: 100 })

        await productRepository.create(product)

        product.name = "Product 2"
        product.price = 200

        await productRepository.update(product)

        const productModel = await ProductModel.findOne({ where: { id: product.id } })

        expect(productModel.toJSON()).toStrictEqual({ 
            id: product.id, 
            name: product.name, 
            price: product.price 
        })
    })

    it("Deve buscar um product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product({ name: "Product 1", price: 100 })

        await productRepository.create(product)

        const productModel = await ProductModel.findOne({ where: { id: product.id } })

        const findProduct = await productRepository.find(product.id)

        expect(productModel.toJSON()).toStrictEqual({ 
            id: findProduct.id, 
            name: findProduct.name, 
            price: findProduct.price 
        })
    })

    it("Deve buscar todos os product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product({ name: "Product 1", price: 100 })
        await productRepository.create(product)

        const product2 = new Product({ name: "Product 2", price: 200 })
        await productRepository.create(product2)

        const products = await productRepository.findAll()
        
        const expectedProducts = [
            { id: product.id, name: product.name, price: product.price },
            { id: product2.id, name: product2.name, price: product2.price }
        ];

        const resultProducts = products.map(product => {
            return {
                id: product.id,
                name: product.name,
                price: product.price
            }
        })

        expect(resultProducts).toStrictEqual(expectedProducts)
    })
})