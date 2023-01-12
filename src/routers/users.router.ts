import { Router } from "express";
import usersController from "../controllers/users.controller";
import validate from "../middlewares/zod.middleware";
import { createUserReqSchema, getUserReqSchema } from "../schemas/users.schema";

const usersRouter = Router();

usersRouter.post(
  "/",
  validate(createUserReqSchema),
  usersController.createUserHandler
);

usersRouter.get("/", usersController.getUsersHandler);

usersRouter.get(
  "/:userId",
  validate(getUserReqSchema),
  usersController.getUserHandler
);

usersRouter.get(
  "/:userId/contacts",
  validate(getUserReqSchema),
  usersController.getUserContactsHandler
);

usersRouter.delete(
  "/:userId",
  validate(getUserReqSchema),
  usersController.deleteUserHandler
);

export default usersRouter;
