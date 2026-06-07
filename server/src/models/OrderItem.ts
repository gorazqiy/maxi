import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IOrderItemAttributes {
   id: number;
   order_id: number;
   product_id: number;
   quantity: number;
   price: number;
}

interface IOrderItemCreationAttributes extends Optional<
   IOrderItemAttributes,
   "id"
> {}

class OrderItem
   extends Model<IOrderItemAttributes, IOrderItemCreationAttributes>
   implements IOrderItemAttributes
{
   public id!: number;
   public order_id!: number;
   public product_id!: number;
   public quantity!: number;
   public price!: number;
}

OrderItem.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      order_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "orders",
            key: "id",
         },
      },
      product_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "products",
            key: "id",
         },
      },
      quantity: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      price: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
   },
   {
      sequelize,
      tableName: "order_items",
      timestamps: false,
   },
);

export default OrderItem;
