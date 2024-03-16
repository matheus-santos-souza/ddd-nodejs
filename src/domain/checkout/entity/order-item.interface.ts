import { UUID } from "crypto";

export interface OrderItemInterface {
    readonly id: UUID;
    name: string;
    price: number;
    productId: UUID;
    quantity: number;
}