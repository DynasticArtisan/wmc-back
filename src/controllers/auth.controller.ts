import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions";
import { TokenDTO } from "../models/users.model";
import { loginUserType } from "../schemas/users.schema";
import sessionsService from "../services/sessions.service";
import usersServices from "../services/users.services";

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

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.session as TokenDTO;
      const contacts = await usersServices.getUserContacts(userId);
      return res.json(contacts);
    } catch (e) {
      next(e);
    }
  }
}
export default new AuthController();
