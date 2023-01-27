import { NextFunction, Request, Response } from "express";
import { Auth } from "../models/users.model";
import {
  AuthorizeReqType,
  ForgotPasswordReqType,
  ResetPasswordReqType,
} from "../schemas/auth.schema";
import {
  ReplaceEmailReqType,
  ReplacePasswordReqType,
  UserContactsType,
} from "../schemas/users.schema";
import sessionsService from "../services/sessions.service";
import usersServices from "../services/users.services";

class AuthController {
  async loginHandler(
    req: Request<{}, {}, AuthorizeReqType["body"]>,
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
      const { newRefreshToken, ...session } =
        await sessionsService.updateSession(req.cookies.refreshToken);
      return res
        .cookie("refreshToken", newRefreshToken, { httpOnly: true })
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

  async forgotPasswordHandler(
    req: Request<{}, {}, ForgotPasswordReqType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { identity } = req.body;
      await sessionsService.createRecoverSession(identity);
      res.json({
        message:
          "Ссылка для восстановления пароля отправлена на электронную почту пользователя",
      });
    } catch (e) {
      next(e);
    }
  }

  async resetPasswordHandler(
    req: Request<ResetPasswordReqType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { resetToken, password } = req.body;
      await sessionsService.useRecoverSession(resetToken, password);
      res.json({
        message:
          "Пароль успешно оновлен, для входа в приложение пройдите авторизацию",
      });
    } catch (e) {
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

  async replaceEmailHandler(
    req: Request<{}, {}, ReplaceEmailReqType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.auth as Auth;
      const { email, password } = req.body;
      await usersServices.replaceUserEmail(userId, email, password);
      res.json({ message: "Адрес электронной почты обновлен" });
    } catch (e) {
      next(e);
    }
  }

  async replacePasswordHandler(
    req: Request<{}, {}, ReplacePasswordReqType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = res.locals.auth as Auth;
      const { password, newPassword } = req.body;
      await usersServices.replaceUserPassword(userId, password, newPassword);
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
