import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ICategoryAttributes {
   id: number;
   name: string;
   description: string;
   image: string;
   created_at: Date;
}

interface ICategoryCreationAttributes extends Optional<
   ICategoryAttributes,
   "id" | "created_at"
> {}

class Category
   extends Model<ICategoryAttributes, ICategoryCreationAttributes>
   implements ICategoryAttributes
{
   public id!: number;
   public name!: string;
   public description!: string;
   public image!: string;
   public created_at!: Date;
}

Category.init(
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
      image: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      },
   },
   {
      sequelize,
      tableName: "categories",
      timestamps: false,
   },
);

export default Category;
