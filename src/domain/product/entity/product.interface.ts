import { UUID } from "crypto";

export interface ProductInterface {
    readonly id: UUID;
    name: string;
    price: number;
}