import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Product from "./Product";

export interface ICartItemAttributes {
   id: number;
   user_id: number;
   product_id: number;
   quantity: number;
   created_at: Date;
   updated_at: Date;
}

interface ICartItemCreationAttributes extends Optional<
   ICartItemAttributes,
   "id" | "created_at" | "updated_at"
> {}

class CartItem
   extends Model<ICartItemAttributes, ICartItemCreationAttributes>
   implements ICartItemAttributes
{
   public id!: number;
   public user_id!: number;
   public product_id!: number;
   public quantity!: number;
   public created_at!: Date;
   public updated_at!: Date;

   public readonly product?: Product;
}

CartItem.init(
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
         defaultValue: 1,
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
      tableName: "cart_items",
   },
);

export default CartItem;
