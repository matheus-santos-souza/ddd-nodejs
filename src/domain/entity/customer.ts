import { UUID, randomUUID } from "node:crypto";
import Address from './address';

interface IPropsCustomer {
    id: UUID;
    name: string;
    address?: Address;
    active?: boolean;
    rewardPoints?: number;
}

export default class Customer {
    private readonly id: UUID;
    private name: string;
    private address?: Address;
    private active?: boolean = false;
    private rewardPoints?: number = 0;

    constructor(props: Omit<IPropsCustomer, 'id'>, id?: UUID) {
        Object.assign(this, props)

        if (!id) {
            this.id = randomUUID()
        } else {
            this.id = id
        }

        this.validate()
    }

    public getId = (): UUID => this.id
    public getName = (): string => this.name
    public getAddress = (): Address => this.address
    public getActive = (): boolean => this.active
    public getRewardPoints = (): number => this.rewardPoints

    public validate() {
        this.validName(this.name)
        this.validActivate(this.address, this.active)
    }

    public changeName(name: string) {
        this.validName(name)
        this.name = name
    }

    public activate(): void {
        this.validActivate(this.address, true)
        this.active = true
    }

    public deactivate(): void {
        this.active = false
    }

    public changeAddress(address: Address) {
        this.address = address
    }

    public addRewardPoints(points: number): void {
        this.rewardPoints += points
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