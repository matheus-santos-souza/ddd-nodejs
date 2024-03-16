import { UUID, randomUUID } from "node:crypto";
import OrderItem from "./order-item";
import { OrderInterface } from "./order.interface";

export default class Order implements OrderInterface {
    private readonly _id: UUID;
    private _customerId: UUID;
    private _items: OrderItem[];
    private _total: number

    constructor(props: Omit<OrderInterface, 'id'>, id?: UUID) {
        this._customerId = props.customerId
        this._items = props.items

        this.sumTotal()

        if (!id) {
            this._id = randomUUID()
        } else {
            this._id = id
        }

        this.validate()
    }

    get id(): UUID {
        return this._id
    }

    get customerId(): UUID {
        return this._customerId
    }

    get items(): OrderItem[] {
        return this._items
    }

    get total(): number {
        return this._total
    }

    public validate() {
        if (!this._items.length) {
            throw new Error('Items are required!')
        }
    }

    public sumTotal(): void {
        this._total = this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0)
    }

    public addItem(item: OrderItem): void {
        this._items.push(item)
        this.sumTotal()
    }

}