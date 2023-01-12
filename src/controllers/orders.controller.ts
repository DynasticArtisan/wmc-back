import { NextFunction, Request, Response } from "express";
import { TokenDTO } from "../models/users.model";
import { createOrderType, getOrderReqType } from "../schemas/orders.schema";
import ordersService from "../services/orders.service";

class OrdersController {
  async createOrder(
    req: Request<{}, {}, createOrderType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, region } = res.locals.auth as TokenDTO;
      const orderData = req.body;
      const order = await ordersService.createOrder(userId, region, orderData);
      return res.json(order);
    } catch (e) {
      next(e);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = res.locals.auth as TokenDTO;
      const orders = await ordersService.getOrders(auth);
      res.json(orders);
    } catch (e) {
      next(e);
    }
  }

  async getOrder(
    req: Request<getOrderReqType["params"]>,
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

  async deleteOrder(
    req: Request<getOrderReqType["params"]>,
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
