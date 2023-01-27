import { Router } from "express";
import validate from "../middlewares/zod.middleware";
import {
  ReplaceEmailReqSchema,
  ReplacePasswordReqSchema,
  UpdateContactsReqSchema,
} from "../schemas/users.schema";
import authController from "../controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import {
  AuthorizeReqSchema,
  ForgotPasswordReqSchema,
  ResetPasswordReqSchema,
} from "../schemas/auth.schema";

const authRouter = Router();

authRouter.post("/", validate(AuthorizeReqSchema), authController.loginHandler);

authRouter.get("/", authController.refreshHandler);

authRouter.delete("/", authController.logoutHandler);

authRouter.post(
  "/forgot-password",
  validate(ForgotPasswordReqSchema),
  authController.forgotPasswordHandler
);

authRouter.post(
  "/reset-password",
  validate(ResetPasswordReqSchema),
  authController.resetPasswordHandler
);

authRouter.get("/contacts", AuthMiddleware, authController.getContactsHandler);

authRouter.patch(
  "/contacts",
  AuthMiddleware,
  validate(UpdateContactsReqSchema),
  authController.updateContactsHandler
);

authRouter.patch(
  "/password",
  AuthMiddleware,
  validate(ReplacePasswordReqSchema),
  authController.replacePasswordHandler
);

authRouter.patch(
  "/email",
  AuthMiddleware,
  validate(ReplaceEmailReqSchema),
  authController.replaceEmailHandler
);

export default authRouter;
