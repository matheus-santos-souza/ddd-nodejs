import Product from "../entity/product";

export default class ProductService {
    
    static increasePrice(products: Product[], percentage: number): Product[] {
        return products.map(product => {
            product.price = (product.price * percentage)/100 + product.price
            return product
        })
    }
}