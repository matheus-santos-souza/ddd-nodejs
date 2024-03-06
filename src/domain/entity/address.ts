interface IPropsAddress {
    readonly street: string;
    readonly number: number;
    readonly zip: string;
    readonly city: string;
}

export default class Address {
    private readonly street: string;
    private readonly number: number;
    private readonly zip: string;
    private readonly city: string;

    constructor(props: IPropsAddress) {
        Object.assign(this, props)
    }

    public getStreet = (): string => this.street
    public getNumber = (): number => this.number
    public getZip = (): string => this.zip
    public getCity = (): string => this.city
}