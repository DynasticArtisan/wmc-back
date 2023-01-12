import { NextFunction, Request, Response } from "express";
import { createUserType, getUserReqType } from "../schemas/users.schema";
import usersServices from "../services/users.services";

class UsersController {
  async createUserHandler(
    req: Request<{}, {}, createUserType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await usersServices.createUser(req.body);
      return res.status(201).json({ message: "Пользователь создан" });
    } catch (e) {
      next(e);
    }
  }

  async getUsersHandler(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(res.locals);
      const users = await usersServices.getUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUserHandler(
    req: Request<getUserReqType["params"]>,
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
    req: Request<getUserReqType["params"]>,
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

  async deleteUserHandler(
    req: Request<getUserReqType["params"]>,
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
