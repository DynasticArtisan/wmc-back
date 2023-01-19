import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import ApiError from "../exceptions";

export default function ErrorMiddleware(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  } else if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Некорректно заполнены поля", errors: err.errors });
  } else {
    console.log(err);
    return res.status(500).json({ message: "Произошла непредвиденная ошибка" });
  }
}
