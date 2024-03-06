import { UUID, randomUUID } from "node:crypto";

interface IPropsProduct {
    readonly id: UUID;
    name: string;
    price: number;
}

export default class Product {
    private readonly id: UUID
    private name: string
    private price: number

    constructor(props: Omit<IPropsProduct, 'id'>, id?: UUID) {
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
    }

    public getId = (): UUID => this.id
    public getName = (): string => this.name
    public getPrice = (): number => this.price

    public changeName(newName: string): void {
        this.validateName(newName)
        this.name = newName
    }

    public changePrice(newPrice: number): void {
        this.validatePrice(newPrice)
        this.price = newPrice
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