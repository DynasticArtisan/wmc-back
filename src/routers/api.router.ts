import { Router } from "express";
import authController from "../controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import SecureMiddleware from "../middlewares/secure.middleware";
import validate from "../middlewares/zod.middleware";
import {
  AuthorizeUserReqSchema,
  UpdateMyContactsReqSchema,
  UpdateMyPasswordReqSchema,
} from "../schemas/users.schema";
import ordersRouter from "./orders.router";
import userRouter from "./users.router";

const apiRouter = Router();

apiRouter.post(
  "/login",
  validate(AuthorizeUserReqSchema),
  authController.loginHandler
);
apiRouter.get("/refresh", authController.refreshHandler);
apiRouter.delete("/logout", authController.logoutHandler);

apiRouter.get("/contacts", AuthMiddleware, authController.getContactsHandler);
apiRouter.patch(
  "/contacts",
  AuthMiddleware,
  validate(UpdateMyContactsReqSchema),
  authController.updateContactsHandler
);

apiRouter.patch(
  "/password",
  AuthMiddleware,
  validate(UpdateMyPasswordReqSchema),
  authController.updatePasswordHandler
);

apiRouter.use("/users", AuthMiddleware, SecureMiddleware, userRouter);
apiRouter.use("/orders", AuthMiddleware, ordersRouter);

export default apiRouter;
