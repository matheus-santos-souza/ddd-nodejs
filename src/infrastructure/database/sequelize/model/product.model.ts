import { UUID } from "crypto";
import { Model, Column, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "products",
    timestamps: false
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column('string')
    declare id: UUID

    @Column({ allowNull: false })
    declare name: string

    @Column({ allowNull: false })
    declare price: number
}