import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IOrderAttributes {
   id: number;
   user_id: number;
   total: number;
   status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
   payment_url: string | null;
   yookassa_payment_id: string | null;
   created_at: Date;
   updated_at: Date;
}

interface IOrderCreationAttributes extends Optional<
   IOrderAttributes,
   "id" | "payment_url" | "yookassa_payment_id" | "created_at" | "updated_at"
> {}

class Order
   extends Model<IOrderAttributes, IOrderCreationAttributes>
   implements IOrderAttributes
{
   public id!: number;
   public user_id!: number;
   public total!: number;
   public status!: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
   public payment_url!: string | null;
   public yookassa_payment_id!: string | null;
   public created_at!: Date;
   public updated_at!: Date;
}

Order.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "users",
            key: "id",
         },
      },
      total: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM(
            "pending",
            "paid",
            "shipped",
            "delivered",
            "cancelled",
         ),
         defaultValue: "pending",
      },
      payment_url: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      yookassa_payment_id: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      },
      updated_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      },
   },
   {
      sequelize,
      tableName: "orders",
   },
);

export default Order;
