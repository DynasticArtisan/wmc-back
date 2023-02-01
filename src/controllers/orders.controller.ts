import { NextFunction, Request, Response } from "express";
import { OrderStatus } from "../models/orders.model";
import { Auth } from "../models/users.model";
import {
  CreateOrderPaymentReqType,
  CreateOrderType,
  GetOrderReqType,
  UpdateOrderReqType,
  UpdateOrderStatusReqType,
} from "../schemas/orders.schema";
import ordersService from "../services/orders.service";

class OrdersController {
  async createOrder(
    req: Request<{}, {}, CreateOrderType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, region } = res.locals.auth as Auth;
      const orderData = req.body;
      const order = await ordersService.createOrder(userId, region, orderData);
      return res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = res.locals.auth as Auth;
      const orders = await ordersService.getOrders(auth);
      res.json(orders);
    } catch (e) {
      next(e);
    }
  }

  async getOrder(
    req: Request<GetOrderReqType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.params;
      const order = await ordersService.getOrder(orderId);
      res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async updateOrder(
    req: Request<UpdateOrderReqType["params"], {}, UpdateOrderReqType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.params;
      const orderData = req.body;
      const auth = res.locals.auth as Auth;
      const order = await ordersService.updateOrder(orderId, orderData, auth);
      res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async updateOrderStatus(
    req: Request<
      UpdateOrderStatusReqType["params"],
      {},
      UpdateOrderStatusReqType["body"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const auth = res.locals.auth as Auth;
      const order = await ordersService.updateOrderStatus(
        orderId,
        status as OrderStatus,
        auth
      );
      return res.json({ message: "Статус заказа обновлен" });
    } catch (e) {
      next(e);
    }
  }

  async createOrderPayment(
    req: Request<
      CreateOrderPaymentReqType["params"],
      {},
      CreateOrderPaymentReqType["body"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.params;
      const payload = req.body;
      const auth = res.locals.auth as Auth;
      const order = await ordersService.createOrderPayment(
        orderId,
        payload,
        auth
      );
      res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async deleteOrder(
    req: Request<GetOrderReqType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.params;
      await ordersService.deleteOrder(orderId);
      res.json({ message: "Заказ удален" });
    } catch (e) {
      next(e);
    }
  }
}
export default new OrdersController();
