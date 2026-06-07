import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import ProductImage from "../models/ProductImage";
import path from "path";
import fs from "fs";

export const uploadProductImages = async (req: AuthRequest, res: Response) => {
   try {
      const { product_id } = req.body;

      if (!req.files || !Array.isArray(req.files)) {
         return res.status(400).json({ message: "Файлы не загружены" });
      }

      const files = req.files as Express.Multer.File[];
      const images = [];

      for (let i = 0; i < files.length; i++) {
         const image = await ProductImage.create({
            product_id: Number(product_id),
            image_url: `/uploads/${files[i].filename}`,
            sort_order: i,
         });
         images.push(image);
      }

      res.status(201).json(images);
   } catch (error) {
      res.status(500).json({
         message: "Ошибка при загрузке изображений",
         error,
      });
   }
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
   try {
      const image = await ProductImage.findByPk(req.params.id);

      if (!image) {
         return res.status(404).json({ message: "Изображение не найдено" });
      }

      const filePath = path.join(__dirname, "../../", image.image_url);
      if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath);
      }

      await image.destroy();
      res.json({ message: "Изображение удалено" });
   } catch (error) {
      res.status(500).json({
         message: "Ошибка при удалении изображения",
         error,
      });
   }
};
