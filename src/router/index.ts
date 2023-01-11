import { Router } from "express";
import usersController from "../controllers/users.controller";
import validate from "../middlewares/zod.middleware";
import { createUserReqSchema, getUserReqSchema } from "../schemas/users.schema";

const router = Router();

router.post(
  "/users/",
  validate(createUserReqSchema),
  usersController.createUserHandler
);

router.get("/users/", usersController.getUsersHandler);

router.get(
  "/users/:userId",
  validate(getUserReqSchema),
  usersController.getUserHandler
);

router.get(
  "/users/:userId/contacts",
  validate(getUserReqSchema),
  usersController.getUserContactsHandler
);
router.delete(
  "/users/:userId",
  validate(getUserReqSchema),
  usersController.deleteUserHandler
);

export default router;
