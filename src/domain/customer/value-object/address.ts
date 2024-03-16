import { AddressInterface } from "./address.interface";

export default class Address {
    private readonly _street: string;
    private readonly _number: number;
    private readonly _zip: string;
    private readonly _city: string;

    constructor(props: AddressInterface) {
        this._street = props.street
        this._number = props.number
        this._zip = props.zip
        this._city = props.city
    }

    get street(): string {
        return this._street 
    }
    get number(): number {
        return this._number 
    }
    get zip(): string {
        return this._zip 
    }
    get city(): string {
        return this._city 
    }
}