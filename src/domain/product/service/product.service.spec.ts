import Product from "../entity/product"
import ProductService from "./product.service"

describe("Product Service unit tests", () => {
    it("Deve alterar o preço de todos os produtos", () => {
        const product1 = new Product({ name: "Product 1", price: 10 })
        const product2 = new Product({ name: "Product 2", price: 15 })
        const product3 = new Product({ name: "Product 3", price: 18 })
        const products = [product1, product2, product3]

        ProductService.increasePrice(products, 100)

        expect(product1.price).toBe(20)
        expect(product2.price).toBe(30)
        expect(product3.price).toBe(36)
    })
})