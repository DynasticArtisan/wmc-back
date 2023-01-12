import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions";
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
    const tokenDTO = await sessionsService.validateAccessToken(accessToken);
    if (!tokenDTO) {
      return res
        .status(401)
        .json({ message: "Токен доступа устарел", expired: true });
    }
    res.locals.auth = tokenDTO;
    next();
  } catch (e) {
    next(e);
  }
}
