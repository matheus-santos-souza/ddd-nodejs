import { ProductFactory } from "./product.factory"

describe("Product Factory unit test", () => {

    it("Deve criar um Product do tipo A", () => {
        const product = ProductFactory.create("a", "Product A", 1)

        expect(product.id).toBeDefined()
        expect(product.name).toBe("Product A")
        expect(product.price).toBe(1)
        expect(product.constructor.name).toBe("Product")
    })

    it("Deve criar um Product do tipo B", () => {
        const product = ProductFactory.create("b", "Product B", 1)

        expect(product.id).toBeDefined()
        expect(product.name).toBe("Product B")
        expect(product.price).toBe(2)
        expect(product.constructor.name).toBe("ProductB")
    })

    it("Deve dar uma exceção de Product tipo não suportado", () => {
        expect(() => ProductFactory.create("c", "Product B", 1))
            .toThrow(new Error("Product type not supported!"))
    })
})