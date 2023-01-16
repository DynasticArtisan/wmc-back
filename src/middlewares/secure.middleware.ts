import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions";
import { Auth, UserRole } from "../models/users.model";

export default function SecureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = res.locals.auth as Auth;
    if (!auth || auth.role !== UserRole.ADMIN) {
      throw ApiError.Forbiden("Недостаточно прав");
    }
    next();
  } catch (e) {
    next(e);
  }
}
