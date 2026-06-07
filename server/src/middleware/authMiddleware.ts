import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import User from "../models/User";

export interface AuthRequest extends Request {
   user?: User;
}

export const protect = async (
   req: AuthRequest,
   res: Response,
   next: NextFunction,
) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      token = req.headers.authorization.split(" ")[1];
   }

   if (!token) {
      return res
         .status(401)
         .json({ message: "Не авторизован. Токен отсутствует" });
   }

   try {
      const decoded = jwt.verify(token, jwtConfig.secret) as { id: number };
      const user = await User.findByPk(decoded.id, {
         attributes: { exclude: ["password_hash"] },
      });

      if (!user) {
         return res.status(401).json({ message: "Пользователь не найден" });
      }

      req.user = user;
      next();
   } catch (error) {
      return res.status(401).json({ message: "Невалидный токен" });
   }
};

export const adminOnly = (
   req: AuthRequest,
   res: Response,
   next: NextFunction,
) => {
   if (req.user && req.user.role === "admin") {
      next();
   } else {
      return res
         .status(403)
         .json({ message: "Доступ запрещен. Только для администраторов" });
   }
};
