import { UUID } from "crypto";
import { Model, Column, PrimaryKey, Table, DataType } from "sequelize-typescript";

@Table({
    tableName: "customers",
    timestamps: false
})
export default class CustomerModel extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    declare id: UUID

    @Column({ allowNull: false })
    declare name: string

    @Column(DataType.BOOLEAN)
    declare active: boolean

    @Column(DataType.NUMBER)
    declare rewardPoints: number

    @Column
    declare street: string

    @Column
    declare number: number

    @Column
    declare zipcode: string

    @Column
    declare city: string
}