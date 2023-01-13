import ApiError from "../exceptions";
import Orders from "../models/orders.model";
import { TokenDTO, UserRole } from "../models/users.model";
import { createOrderType } from "../schemas/orders.schema";
import sheetsService from "./sheets.service";
import usersServices from "./users.services";

class OrdersService {
  async createOrder(userId: string, region: string, data: createOrderType) {
    const count = await Orders.find({ region }).count();
    const index = count + 1;
    const order = await Orders.create({ userId, region, index, ...data });
    const contacts = await usersServices.getUserContacts(userId);
    await sheetsService.writeOrder(order, contacts);
    return order;
  }

  async getOrders({ userId, role, region }: TokenDTO) {
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

  // TODO:
  async updateOrder() {}

  async deleteOrder(orderId: string) {
    const order = await Orders.findByIdAndDelete(orderId);
    if (!order) {
      throw ApiError.NotFound("Заказ не найден");
    }
    return order;
  }
}
export default new OrdersService();
