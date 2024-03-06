import { UUID } from "crypto";
import { Model, Column, PrimaryKey, Table, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import ProductModel from "./product.model";
import OrderModel from "./order.model";

@Table({
    tableName: "order-items",
    timestamps: false
})
export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    declare id: UUID

    @Column({ allowNull: false })
    @ForeignKey(() => ProductModel)
    declare product_id: string

    @BelongsTo(() => ProductModel)
    declare product: ProductModel

    @Column({ allowNull: false })
    @ForeignKey(() => OrderModel)
    declare order_id: string

    @BelongsTo(() => OrderModel)
    declare order: OrderModel

    @Column({ allowNull: false })
    declare quantity: number

    @Column({ allowNull: false })
    declare name: string

    @Column({ allowNull: false })
    declare price: number
}