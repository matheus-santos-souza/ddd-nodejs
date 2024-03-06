import { UUID, randomUUID } from "node:crypto";
import OrderItem from "./order-item";

interface IPropsOrder {
    readonly id: UUID;
    customerId: UUID;
    items: OrderItem[];
}

export default class Order {
    private readonly id: UUID;
    private customerId: UUID;
    private items: OrderItem[];
    private total: number
   
    constructor(props: Omit<IPropsOrder, 'id'>, id?: UUID) {
        Object.assign(this, props)
        this.sumTotal()

        if (!id) {
            this.id = randomUUID()
        } else {
            this.id = id
        }

        this.validate()
    }

    validate() {
        if (!this.items.length) {
            throw new Error('Items are required!')
        }
    }

    public getId = (): UUID => this.id
    public getCustomerId = (): UUID => this.customerId
    public getItems = (): OrderItem[] => this.items
    public getTotal = (): number => this.total

    public sumTotal(): void {
        this.total = this.items.reduce((acc, item) => acc + item.orderItemTotal(), 0)
    }

    public addItem(item: OrderItem): void {
        this.items.push(item)
        this.sumTotal()
    }

}