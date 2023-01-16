import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions";
import { Auth } from "../models/users.model";
import sessionsService from "../services/sessions.service";

export default async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = (req.headers.authorization || "").replace(
      /^Bearer\s/,
      ""
    );
    if (!accessToken) {
      return next(ApiError.Unauthorized("Требуется авторизация"));
    }
    const Auth = (await sessionsService.validateAccessToken(
      accessToken
    )) as Auth;
    if (!Auth) {
      return res
        .status(401)
        .json({ message: "Токен доступа устарел", expired: true });
    }
    res.locals.auth = Auth;
    next();
  } catch (e) {
    next(e);
  }
}
