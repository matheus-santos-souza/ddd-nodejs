import { UUID, randomUUID } from "node:crypto";
import { ProductInterface } from "./product.interface";

export default class ProductB implements ProductInterface {
    private readonly _id: UUID;
    private _name: string;
    private _price: number;

    constructor(props: Omit<ProductInterface, 'id'>, id?: UUID) {
        this._name = props.name
        this._price = props.price

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
    }

    get id(): UUID {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get price(): number {
        return this._price * 2
    }

    set name(newName: string) {
        this.validateName(newName)
        this._name = newName
    }

    set price(newPrice: number) {
        this.validatePrice(newPrice)
        this._price = newPrice
    }

    private validateName(name: string) {
        if (!name) {
            throw new Error('Name is required!')
        }
    }

    private validatePrice(price: number) {
        if (price < 0) {
            throw new Error('price cannot be less than 0!')
        }
    }
}