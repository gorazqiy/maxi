import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

export interface IUserAttributes {
   id: number;
   name: string;
   email: string;
   password_hash: string;
   phone: string;
   address: string;
   role: "user" | "admin";
   created_at: Date;
   updated_at: Date;
}

interface IUserCreationAttributes extends Optional<
   IUserAttributes,
   "id" | "created_at" | "updated_at"
> {}

class User
   extends Model<IUserAttributes, IUserCreationAttributes>
   implements IUserAttributes
{
   public id!: number;
   public name!: string;
   public email!: string;
   public password_hash!: string;
   public phone!: string;
   public address!: string;
   public role!: "user" | "admin";
   public created_at!: Date;
   public updated_at!: Date;

   public async comparePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password_hash);
   }
}

User.init(
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
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
      },
      password_hash: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      phone: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      address: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      role: {
         type: DataTypes.ENUM("user", "admin"),
         defaultValue: "user",
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
      tableName: "users",
      hooks: {
         beforeCreate: async (user: User) => {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
         },
         beforeUpdate: async (user: User) => {
            if (user.changed("password_hash")) {
               user.password_hash = await bcrypt.hash(user.password_hash, 10);
            }
         },
      },
   },
);

export default User;
