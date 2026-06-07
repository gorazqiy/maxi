import { Request, Response } from "express";
import Category from "../models/Category";
import Product from "../models/Product";
import ProductImage from "../models/ProductImage";

export const getAll = async (req: Request, res: Response) => {
   try {
      const categories = await Category.findAll({
         include: [
            {
               model: Product,
               as: "products",
               attributes: ["id"],
            },
         ],
      });
      res.json(categories);
   } catch (error) {
      res.status(500).json({
         message: "Ошибка при получении категорий",
         error,
      });
   }
};

export const getById = async (req: Request, res: Response) => {
   try {
      const category = await Category.findByPk(req.params.id, {
         include: [
            {
               model: Product,
               as: "products",
               include: [
                  {
                     model: ProductImage,
                     as: "images",
                  },
               ],
            },
         ],
      });

      if (!category) {
         return res.status(404).json({ message: "Категория не найдена" });
      }

      res.json(category);
   } catch (error) {
      res.status(500).json({
         message: "Ошибка при получении категории",
         error,
      });
   }
};

export const create = async (req: Request, res: Response) => {
   try {
      const { name, description, image } = req.body;
      const category = await Category.create({ name, description, image });
      res.status(201).json(category);
   } catch (error) {
      res.status(500).json({ message: "Ошибка при создании категории", error });
   }
};

export const update = async (req: Request, res: Response) => {
   try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
         return res.status(404).json({ message: "Категория не найдена" });
      }

      const { name, description, image } = req.body;
      await category.update({ name, description, image });
      res.json(category);
   } catch (error) {
      res.status(500).json({
         message: "Ошибка при обновлении категории",
         error,
      });
   }
};

export const remove = async (req: Request, res: Response) => {
   try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
         return res.status(404).json({ message: "Категория не найдена" });
      }

      await category.destroy();
      res.json({ message: "Категория удалена" });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении категории", error });
   }
};
