import { UUID, randomUUID } from "node:crypto";
import { OrderItemInterface } from "./order-item.interface";

export default class OrderItem implements OrderItemInterface {
    private readonly _id: UUID
    private _name: string
    private _price: number
    private _productId: UUID
    private _quantity: number
    
    constructor(props: Omit<OrderItemInterface, 'id'>, id?: UUID) {
        this._name = props.name
        this._price = props.price
        this._productId = props.productId
        this._quantity = props.quantity

        if (!id) {
            this._id = randomUUID()
        } else {
            this._id = id
        }

        this.validate()
    }

    public validate(): void {
        this.validateName(this._name)
        this.validatePrice(this._price)
        this.validateQuantity(this._quantity)
    }

    get id(): UUID {
        return this._id
    }

    get name(): string {
        return this._name
    }
    get price(): number {
        return this._price
    }

    get productId(): UUID {
        return this._productId
    }

    get quantity(): number {
        return this._quantity
    }

    set quantity(quantity: number) {
        this.validateQuantity(quantity)
        this._quantity = quantity
    }

    public orderItemTotal(): number {
        return this._price * this._quantity;
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