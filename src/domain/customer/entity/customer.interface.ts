import { UUID } from "node:crypto";
import Address from "../value-object/address";

export interface CustomerInterface {
    id: UUID;
    name: string;
    address?: Address;
    active?: boolean;
    rewardPoints?: number;
}