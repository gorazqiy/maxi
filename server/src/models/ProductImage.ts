import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IProductImageAttributes {
   id: number;
   product_id: number;
   image_url: string;
   sort_order: number;
}

interface IProductImageCreationAttributes extends Optional<
   IProductImageAttributes,
   "id"
> {}

class ProductImage
   extends Model<IProductImageAttributes, IProductImageCreationAttributes>
   implements IProductImageAttributes
{
   public id!: number;
   public product_id!: number;
   public image_url!: string;
   public sort_order!: number;
}

ProductImage.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      product_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "products",
            key: "id",
         },
      },
      image_url: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      sort_order: {
         type: DataTypes.INTEGER,
         defaultValue: 0,
      },
   },
   {
      sequelize,
      tableName: "product_images",
      timestamps: false,
   },
);

export default ProductImage;
