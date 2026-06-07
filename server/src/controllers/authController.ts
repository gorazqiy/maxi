import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { jwtConfig } from "../config/jwt";
import { AuthRequest } from "../middleware/authMiddleware";

const generateToken = (id: number): string => {
   return jwt.sign({ id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn as any,
   });
};

export const register = async (req: AuthRequest, res: Response) => {
   try {
      const { name, email, password, phone, address } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
         return res
            .status(400)
            .json({ message: "Пользователь с таким email уже существует" });
      }

      const user = await User.create({
         name,
         email,
         password_hash: password,
         phone: phone || "",
         address: address || "",
         role: "user",
      });

      const token = generateToken(user.id);

      res.status(201).json({
         token,
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
         },
      });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при регистрации", error });
   }
};

export const login = async (req: AuthRequest, res: Response) => {
   try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
         return res.status(401).json({ message: "Неверный email или пароль" });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
         return res.status(401).json({ message: "Неверный email или пароль" });
      }

      const token = generateToken(user.id);

      res.json({
         token,
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
         },
      });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при авторизации", error });
   }
};

export const getMe = async (req: AuthRequest, res: Response) => {
   try {
      const user = await User.findByPk(req.user!.id, {
         attributes: { exclude: ["password_hash"] },
      });
      res.json(user);
   } catch (error) {
      res.status(500).json({ message: "Ошибка при получении профиля", error });
   }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
   try {
      const { name, phone, address } = req.body;
      const user = await User.findByPk(req.user!.id);

      if (!user) {
         return res.status(404).json({ message: "Пользователь не найден" });
      }

      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      await user.save();

      res.json({
         id: user.id,
         name: user.name,
         email: user.email,
         phone: user.phone,
         address: user.address,
         role: user.role,
      });
   } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении профиля", error });
   }
};
