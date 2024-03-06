import Product from "../../domain/entity/product";

export default class ProductService {
    
    static increasePrice(products: Product[], percentage: number): Product[] {
        return products.map(product => {
            product.changePrice((product.getPrice() * percentage)/100 + product.getPrice())
            return product
        })
    }
}