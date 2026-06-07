import { Request, Response, NextFunction } from "express";

export const errorHandler = (
   err: Error,
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   console.error(err.stack);

   if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
         message: "Ошибка валидации",
         errors: err.message,
      });
   }

   if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
         message: "Такая запись уже существует",
      });
   }

   res.status(500).json({
      message: "Внутренняя ошибка сервера",
   });
};
