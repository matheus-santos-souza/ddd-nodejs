import { UUID } from "crypto";
import { Model, Column, PrimaryKey, Table, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";

@Table({
    tableName: "orders",
    timestamps: false
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    declare id: UUID

    @Column({ allowNull: false })
    @ForeignKey(() => CustomerModel)
    declare customer_id: string

    @BelongsTo(() => CustomerModel)
    declare customer: CustomerModel

    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[]

    @Column({ allowNull: false })
    declare total: number

}