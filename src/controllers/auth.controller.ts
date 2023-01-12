import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions";
import { loginUserType } from "../schemas/users.schema";
import sessionsService from "../services/sessions.service";

class AuthController {
  async loginHandler(
    req: Request<{}, {}, loginUserType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { login, password } = req.body;
      const { refreshToken, ...session } = await sessionsService.createSession(
        login,
        password
      );
      return res
        .cookie("refreshToken", refreshToken, { httpOnly: true })
        .json(session);
    } catch (e) {
      next(e);
    }
  }

  async refreshHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken, ...session } = await sessionsService.updateSession(
        req.cookies.refreshToken
      );
      return res
        .cookie("refreshToken", refreshToken, { httpOnly: true })
        .json(session);
    } catch (e) {
      res.clearCookie("refreshToken");
      next(e);
    }
  }

  async logoutHandler(req: Request, res: Response, next: NextFunction) {
    try {
      await sessionsService.deleteSession(req.cookies.refreshToken);
      return res
        .clearCookie("refreshToken")
        .status(204)
        .json({ message: "Сессия завершена" });
    } catch (e) {
      res.clearCookie("refreshToken");
      next(e);
    }
  }
}
export default new AuthController();
