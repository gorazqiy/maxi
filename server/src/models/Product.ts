import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IProductAttributes {
   id: number;
   name: string;
   description: string;
   composition: string;
   price: number;
   category_id: number;
   created_at: Date;
   updated_at: Date;
}

interface IProductCreationAttributes extends Optional<
   IProductAttributes,
   "id" | "created_at" | "updated_at"
> {}

class Product
   extends Model<IProductAttributes, IProductCreationAttributes>
   implements IProductAttributes
{
   public id!: number;
   public name!: string;
   public description!: string;
   public composition!: string;
   public price!: number;
   public category_id!: number;
   public created_at!: Date;
   public updated_at!: Date;
}

Product.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      name: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      description: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      composition: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      price: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      category_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "categories",
            key: "id",
         },
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
      tableName: "products",
   },
);

export default Product;
