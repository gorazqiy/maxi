import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import sequelize from "./config/database";
import { errorHandler } from "./middleware/errorMiddleware";
import { upload } from "./config/upload";
import {
   uploadProductImages,
   deleteImage,
} from "./controllers/uploadController";
import { protect, adminOnly } from "./middleware/authMiddleware";

import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";

import "./models";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (загруженные изображения)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Маршруты API
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

// Маршруты загрузки изображений
app.post(
   "/api/upload",
   protect,
   adminOnly,
   upload.array("images", 10),
   uploadProductImages,
);
app.delete("/api/upload/:id", protect, adminOnly, deleteImage);

// Обработчик ошибок
app.use(errorHandler);

const start = async () => {
   try {
      await sequelize.authenticate();
      console.log("База данных PostgreSQL подключена");

      await sequelize.sync({ alter: true });
      console.log("Модели синхронизированы с БД");

      app.listen(PORT, () => {
         console.log(`Сервер запущен на порту ${PORT}`);
      });
   } catch (error) {
      console.error("Ошибка запуска сервера:", error);
   }
};

start();
