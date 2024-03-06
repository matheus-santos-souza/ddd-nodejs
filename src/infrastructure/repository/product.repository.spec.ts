import { Sequelize } from "sequelize-typescript"
import ProductModel from "../database/sequelize/model/product.model";
import Product from "../../domain/entity/product";
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
        const productModel = await ProductModel.findOne({ where: { id: product.getId() } })

        expect(productModel.toJSON()).toStrictEqual({ 
            id: product.getId(), 
            name: product.getName(), 
            price: product.getPrice() 
        })
    })

    it("Deve atualizar um product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product({ name: "Product 1", price: 100 })

        await productRepository.create(product)

        product.changeName("Product 2")
        product.changePrice(200)

        await productRepository.update(product)

        const productModel = await ProductModel.findOne({ where: { id: product.getId() } })

        expect(productModel.toJSON()).toStrictEqual({ 
            id: product.getId(), 
            name: product.getName(), 
            price: product.getPrice() 
        })
    })

    it("Deve buscar um product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product({ name: "Product 1", price: 100 })

        await productRepository.create(product)

        const productModel = await ProductModel.findOne({ where: { id: product.getId() } })

        const findProduct = await productRepository.find(product.getId())

        expect(productModel.toJSON()).toStrictEqual({ 
            id: findProduct.getId(), 
            name: findProduct.getName(), 
            price: findProduct.getPrice() 
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
            { id: product.getId(), name: product.getName(), price: product.getPrice() },
            { id: product2.getId(), name: product2.getName(), price: product2.getPrice() }
        ];

        const resultProducts = products.map(product => {
            return {
                id: product.getId(),
                name: product.getName(),
                price: product.getPrice()
            }
        })

        expect(resultProducts).toStrictEqual(expectedProducts)
    })
})