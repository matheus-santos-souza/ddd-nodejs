import { UUID, randomUUID } from "node:crypto";

interface IPropsOrderItem {
    readonly id: UUID;
    name: string;
    price: number;
    productId: UUID;
    quantity: number;
}

export default class OrderItem {
    private readonly id: UUID;
    private name: string;
    private price: number;
    private productId: UUID;
    private quantity: number;
    
    constructor(props: Omit<IPropsOrderItem, 'id'>, id?: UUID) {
        Object.assign(this, props)

        if (!id) {
            this.id = randomUUID()
        } else {
            this.id = id
        }

        this.validate()
    }

    public validate(): void {
        this.validateName(this.name)
        this.validatePrice(this.price)
        this.validateQuantity(this.quantity)
    }

    public getId = (): UUID => this.id;
    public getName = (): string => this.name;
    public getPrice = (): number => this.price;
    public getProductId = (): UUID => this.productId;
    public getQuantity = (): number => this.quantity;

    public changeQuantity(quantity: number) {
        this.validateQuantity(quantity)
        this.quantity = quantity
    }

    public orderItemTotal(): number {
        return this.price * this.quantity;
    }

    private validateName(name: string): void {
        if (!name) {
            throw new Error('Name is required!')
        }
    }

    private validatePrice(price: number): void {
        if (price < 0) {
            throw new Error('price cannot be less than 0!')
        }
    }

    private validateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity cannot be less than 0!')
        }
    }
}