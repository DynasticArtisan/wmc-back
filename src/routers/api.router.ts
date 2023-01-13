import { Router } from "express";
import authController from "../controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import SecureMiddleware from "../middlewares/secure.middleware";
import validate from "../middlewares/zod.middleware";
import { loginUserReqSchema } from "../schemas/users.schema";
import ordersRouter from "./orders.router";
import userRouter from "./users.router";

const apiRouter = Router();

apiRouter.post(
  "/login",
  validate(loginUserReqSchema),
  authController.loginHandler
);
apiRouter.get("/refresh", authController.refreshHandler);
apiRouter.delete("/logout", authController.logoutHandler);
apiRouter.get("/profile", AuthMiddleware, authController.getProfile);

apiRouter.use("/users", AuthMiddleware, SecureMiddleware, userRouter);
apiRouter.use("/orders", AuthMiddleware, ordersRouter);

export default apiRouter;
