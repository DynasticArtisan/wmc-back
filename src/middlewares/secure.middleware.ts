import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions";
import { TokenDTO, UserRole } from "../models/users.model";

export default function SecureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = res.locals.session as TokenDTO;
    if (!auth || auth.role !== UserRole.ADMIN) {
      throw ApiError.Forbiden("Недостаточно прав");
    }
    next();
  } catch (e) {
    next(e);
  }
}
