import ApiError from "../exceptions";
import Orders, { OrderPayment, OrderStatus } from "../models/orders.model";
import { Auth, UserRole } from "../models/users.model";
import { CreateOrderType, UpdateOrderType } from "../schemas/orders.schema";
import sheetsService from "./sheets.service";
import usersServices from "./users.services";

class OrdersService {
  async createOrder(
    userId: string,
    region: string,
    { prepayment, ...orderData }: CreateOrderType
  ) {
    const lastOrder = await Orders.findOne({ region }).sort("-index");
    const index = lastOrder ? lastOrder.index + 1 : 1;
    const order = await Orders.create({ userId, region, index, ...orderData });
    if (prepayment) {
      order.payments.push(prepayment);
      await order.save();
    }
    const contacts = await usersServices.getUserContacts(userId);
    await sheetsService.createOrder(order, contacts);
    return order;
  }
  async createOrderPayment(
    orderId: string,
    payload: OrderPayment,
    { role, region }: Auth
  ) {
    switch (role) {
      case UserRole.ADMIN:
        const order = await Orders.findById(orderId);
        if (!order) {
          throw ApiError.BadRequest("Заказ не найден");
        }
        order.payments.push(payload);
        await order.save();
        return true;
      case UserRole.MANAGER:
        const regionOrder = await Orders.findOne({ _id: orderId, region });
        if (!regionOrder) {
          throw ApiError.BadRequest("Заказ не найден");
        }
        regionOrder.payments.push(payload);
        await regionOrder.save();
        return true;
      default:
        throw ApiError.Forbiden("Недостаточно прав");
    }
  }

  async getOrders({ userId, role, region }: Auth) {
    switch (role) {
      case UserRole.ADMIN:
        return await Orders.find();
      case UserRole.MANAGER:
        return await Orders.find({ region });
      default:
        return await Orders.find({ userId });
    }
  }

  async getOrder(orderId: string) {
    const order = await Orders.findById(orderId);
    if (!order) {
      throw ApiError.NotFound("Заказ не найден");
    }
    return order;
  }

  async updateOrder(
    orderId: string,
    orderData: UpdateOrderType,
    { role, region }: Auth
  ) {
    switch (role) {
      case UserRole.ADMIN:
        const order = await Orders.findByIdAndUpdate(orderId, orderData, {
          new: true,
        });
        if (!order) {
          throw ApiError.NotFound("Заказ не найден");
        }
        await sheetsService.updateOrder(order);
        return order;
      case UserRole.MANAGER:
        const regionOrder = await Orders.findOneAndUpdate(
          { _id: orderId, region },
          orderData,
          { new: true }
        );
        if (!regionOrder) {
          throw ApiError.NotFound("Заказ не найден");
        }
        await sheetsService.updateOrder(regionOrder);
        return regionOrder;
      default:
        throw ApiError.Forbiden("Недостаточно прав");
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    { role, region }: Auth
  ) {
    switch (role) {
      case UserRole.ADMIN:
        const order = await Orders.findByIdAndUpdate(
          orderId,
          { status },
          {
            new: true,
          }
        );
        if (!order) {
          throw ApiError.NotFound("Заказ не найден");
        }
        return order;
      case UserRole.MANAGER:
        const regionOrder = await Orders.findOneAndUpdate(
          { _id: orderId, region },
          { status },
          { new: true }
        );
        if (!regionOrder) {
          throw ApiError.NotFound("Заказ не найден");
        }
        return regionOrder;
      default:
        throw ApiError.Forbiden("Недостаточно прав");
    }
  }

  async deleteOrder(orderId: string) {
    const order = await Orders.findByIdAndDelete(orderId);
    if (!order) {
      throw ApiError.NotFound("Заказ не найден");
    }
    await sheetsService.deleteOrder(order);
    return order;
  }
}
export default new OrdersService();
