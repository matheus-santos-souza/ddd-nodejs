import Product from "../entity/product";
import ProductB from "../entity/product-b";
import { ProductInterface } from "../entity/product.interface";

type TypeProduct = 'a' | 'b' | 'c'

export class ProductFactory {
    public static create(type: TypeProduct, name: string, price: number): ProductInterface {
        if (type === 'a') {
            return new Product({ name, price })
        }

        if (type === 'b') {
            return new ProductB({ name, price })
        }

        throw new Error("Product type not supported!")
    }
}