import { Router } from "express";
import ordersController from "../controllers/orders.controller";
import SecureMiddleware from "../middlewares/secure.middleware";
import validate from "../middlewares/zod.middleware";
import {
  CreateOrderPaymentReqSchema,
  CreateOrderReqSchema,
  GetOrderReqSchema,
  UpdateOrderReqSchema,
  UpdateOrderStatusReqSchema,
} from "../schemas/orders.schema";

const ordersRouter = Router();

ordersRouter.post(
  "/",
  validate(CreateOrderReqSchema),
  ordersController.createOrder
);

ordersRouter.get("/", ordersController.getOrders);

ordersRouter.get(
  "/:orderId",
  validate(GetOrderReqSchema),
  ordersController.getOrder
);

ordersRouter.put(
  "/:orderId",
  validate(UpdateOrderReqSchema),
  ordersController.updateOrder
);

ordersRouter.patch(
  "/:orderId/status",
  validate(UpdateOrderStatusReqSchema),
  ordersController.updateOrderStatus
);

ordersRouter.post(
  "/:orderId/payments",
  validate(CreateOrderPaymentReqSchema),
  ordersController.createOrderPayment
);

ordersRouter.delete(
  "/:orderId",
  SecureMiddleware,
  validate(GetOrderReqSchema),
  ordersController.deleteOrder
);

export default ordersRouter;
