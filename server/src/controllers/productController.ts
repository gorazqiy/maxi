import { Request, Response } from "express";
import { Op } from "sequelize";
import Product from "../models/Product";
import Category from "../models/Category";
import ProductImage from "../models/ProductImage";

export const getAll = async (req: Request, res: Response) => {
   try {
      const {
         categoryId,
         minPrice,
         maxPrice,
         sort,
         search,
         page = "1",
         limit = "12",
      } = req.query;

      const where: any = {};
      const offset = (Number(page) - 1) * Number(limit);

      if (categoryId) {
         where.category_id = Number(categoryId);
      }

      if (minPrice || maxPrice) {
         where.price = {};
         if (minPrice) where.price[Op.gte] = Number(minPrice);
         if (maxPrice) where.price[Op.lte] = Number(maxPrice);
      }

      if (search) {
         where.name = { [Op.iLike]: `%${search}%` };
      }

      let order: any = [["created_at", "DESC"]];
      if (sort === "price_asc") order = [["price", "ASC"]];
      if (sort === "price_desc") order = [["price", "DESC"]];
      if (sort === "name") order = [["name", "ASC"]];

      const { rows: products, count: total } = await Product.findAndCountAll({
         where,
         distinct: true,
         include: [
            {
               model: Category,
               as: "category",
               attributes: ["id", "name"],
            },
            {
               model: ProductImage,
               as: "images",
               attributes: ["id", "image_url", "sort_order"],
            },
         ],
         order,
         limit: Number(limit),
         offset,
      });

      // Сортировка изображений по sort_order
      const sortedProducts = products.map((product) => {
         const data = product.toJSON();
         if (data.images) {
            data.images.sort((a, b) => a.sort_order - b.sort_order);
         }
         return data;
      });

      res.json({
         products: sortedProducts,
         total,
         page: Number(page),
         totalPages: Math.ceil(total / Number(limit)),
      });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товаров", error });
   }
};

export const getById = async (req: Request, res: Response) => {
   try {
      const product = await Product.findByPk(req.params.id, {
         include: [
            {
               model: Category,
               as: "category",
               attributes: ["id", "name"],
            },
            {
               model: ProductImage,
               as: "images",
               attributes: ["id", "image_url", "sort_order"],
            },
         ],
      });

      if (!product) {
         return res.status(404).json({ message: "Товар не найден" });
      }

      // Сортировка изображений по sort_order
      const data = product.toJSON();
      if (data.images) {
         data.images.sort((a, b) => a.sort_order - b.sort_order);
      }

      res.json(data);
   } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товара", error });
   }
};

export const create = async (req: Request, res: Response) => {
   try {
      const { name, description, composition, price, category_id } = req.body;

      const product = await Product.create({
         name,
         description,
         composition,
         price,
         category_id,
      });

      res.status(201).json(product);
   } catch (error) {
      res.status(500).json({ message: "Ошибка при создании товара", error });
   }
};

export const update = async (req: Request, res: Response) => {
   try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
         return res.status(404).json({ message: "Товар не найден" });
      }

      const { name, description, composition, price, category_id } = req.body;
      await product.update({
         name,
         description,
         composition,
         price,
         category_id,
      });

      res.json(product);
   } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении товара", error });
   }
};

export const remove = async (req: Request, res: Response) => {
   try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
         return res.status(404).json({ message: "Товар не найден" });
      }

      await product.destroy();
      res.json({ message: "Товар удален" });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении товара", error });
   }
};
