import User from "./User";
import Category from "./Category";
import Product from "./Product";
import ProductImage from "./ProductImage";
import CartItem from "./CartItem";
import Order from "./Order";
import OrderItem from "./OrderItem";

// Category -> Products
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Product -> Images
Product.hasMany(ProductImage, {
   foreignKey: "product_id",
   as: "images",
   onDelete: "CASCADE",
});
ProductImage.belongsTo(Product, { foreignKey: "product_id" });

// User -> CartItems
User.hasMany(CartItem, { foreignKey: "user_id", as: "cartItems" });
CartItem.belongsTo(User, { foreignKey: "user_id" });

// Product -> CartItems
Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// User -> Orders
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id" });

// Order -> Items
Order.hasMany(OrderItem, {
   foreignKey: "order_id",
   as: "items",
   onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// Product -> OrderItems
Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

export { User, Category, Product, ProductImage, CartItem, Order, OrderItem };
