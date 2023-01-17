import { NextFunction, Request, Response } from "express";
import { UserRegion, UserRole } from "../models/users.model";
import {
  CreateUserType,
  GetUserReqType,
  UpdateUserRegionReqType,
  UpdateUserRoleReqType,
} from "../schemas/users.schema";
import usersServices from "../services/users.services";

class UsersController {
  async createUserHandler(
    req: Request<{}, {}, CreateUserType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await usersServices.createUser(req.body);
      return res.status(201).json({ message: "Пользователь создан" });
    } catch (e) {
      next(e);
    }
  }

  async getUsersHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersServices.getUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUserHandler(
    req: Request<GetUserReqType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const user = await usersServices.getUser(userId);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async getUserContactsHandler(
    req: Request<GetUserReqType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const contacts = await usersServices.getUserContacts(userId);
      return res.json(contacts);
    } catch (e) {
      next(e);
    }
  }

  async updateUserRoleHandler(
    req: Request<
      UpdateUserRoleReqType["params"],
      {},
      UpdateUserRoleReqType["body"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      await usersServices.updateUserRole(userId, role as UserRole);
      return res.json({ message: "Роль пользователя изменена" });
    } catch (e) {
      next(e);
    }
  }

  async updateUserRegionHandler(
    req: Request<
      UpdateUserRegionReqType["params"],
      {},
      UpdateUserRegionReqType["body"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const { region } = req.body;
      await usersServices.updateUserRegion(userId, region as UserRegion);
      return res.json({ message: "Регион пользователя изменен" });
    } catch (e) {
      next(e);
    }
  }

  async deleteUserHandler(
    req: Request<GetUserReqType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      await usersServices.deleteUser(userId);
      return res.json({ message: "Пользователь удален" });
    } catch (e) {
      next(e);
    }
  }
}
export default new UsersController();
