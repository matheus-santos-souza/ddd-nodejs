import { UUID } from "crypto";
import OrderItem from "./order-item";

export interface OrderInterface {
    readonly id: UUID;
    customerId: UUID;
    items: OrderItem[];
}