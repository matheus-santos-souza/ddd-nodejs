import { UUID, randomUUID } from "node:crypto";
import Address from '../value-object/address';
import { CustomerInterface } from "./customer.interface";

export default class Customer implements CustomerInterface {
    private readonly _id: UUID;
    private _name: string;
    private _address?: Address;
    private _active?: boolean = false;
    private _rewardPoints?: number = 0;

    constructor(props: Omit<CustomerInterface, 'id'>, id?: UUID) {
        this._name = props.name
        this._address = props.address
        this._active = props.active || false
        this._rewardPoints = props.rewardPoints || 0

        if (!id) {
            this._id = randomUUID()
        } else {
            this._id = id
        }

        this.validate()
    }

    public validate() {
        this.validName(this._name)
        this.validActivate(this._address, this._active)
    }

    get id(): UUID {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get address(): Address {
        return this._address
    }

    get active(): boolean {
        return this._active
    }

    get rewardPoints(): number {
        return this._rewardPoints
    }

    public changeName(name: string): void {
        this.validName(name)
        this._name = name
    }

    public activate(): void {
        this.validActivate(this._address, true)
        this._active = true
    }

    public deactivate(): void {
        this._active = false
    }

    public changeAddress(address: Address) {
        this._address = address
    }

    public addRewardPoints(points: number): void {
        this._rewardPoints += points
    }

    private validName(name: string) {
        if (!name) {
            throw new Error("Name is required!")
        } 
    }

    private validActivate(address: Address, active: boolean) {
        if (!address && active === true) {
            throw new Error("Address is mandatory to activate a customer!")
        }
    }
}