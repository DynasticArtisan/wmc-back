import { NextFunction, Request, Response } from "express";
import { Auth } from "../models/users.model";
import {
  AuthorizeUserType,
  UpdateMyPasswordReqType,
  UserContactsType,
} from "../schemas/users.schema";
import sessionsService from "../services/sessions.service";
import usersServices from "../services/users.services";

class AuthController {
  async loginHandler(
    req: Request<{}, {}, AuthorizeUserType>,
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

  async getContactsHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = res.locals.auth as Auth;
      const contacts = await usersServices.getUserContacts(userId);
      return res.json(contacts);
    } catch (e) {
      next(e);
    }
  }

  async updatePasswordHandler(
    req: Request<{}, {}, UpdateMyPasswordReqType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.auth as Auth;
      const { password, newPassword } = req.body;
      await usersServices.updateUserPassword(userId, password, newPassword);
      return res.json({ message: "Пароль обновлен" });
    } catch (e) {
      next(e);
    }
  }

  async updateContactsHandler(
    req: Request<{}, {}, UserContactsType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.auth as Auth;
      const contacts = req.body;
      await usersServices.updateUserContacts(userId, contacts);
      res.json({ message: "Контакты обновлены" });
    } catch (e) {
      next(e);
    }
  }
}
export default new AuthController();
