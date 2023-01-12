import { Router } from "express";
import ordersController from "../controllers/orders.controller";
import SecureMiddleware from "../middlewares/secure.middleware";
import validate from "../middlewares/zod.middleware";
import {
  createOrderReqSchema,
  getOrderReqSchema,
} from "../schemas/orders.schema";

const ordersRouter = Router();

ordersRouter.post(
  "/",
  validate(createOrderReqSchema),
  ordersController.createOrder
);

ordersRouter.get("/", ordersController.getOrders);

ordersRouter.delete(
  "/:orderId",
  SecureMiddleware,
  validate(getOrderReqSchema),
  ordersController.deleteOrder
);

export default ordersRouter;
