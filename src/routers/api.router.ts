import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import SecureMiddleware from "../middlewares/secure.middleware";
import authRouter from "./auth.router";
import ordersRouter from "./orders.router";
import userRouter from "./users.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/orders", AuthMiddleware, ordersRouter);
apiRouter.use("/users", AuthMiddleware, SecureMiddleware, userRouter);

export default apiRouter;
