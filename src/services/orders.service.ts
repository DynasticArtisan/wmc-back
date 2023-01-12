import ApiError from "../exceptions";
import Orders from "../models/orders.model";
import { TokenDTO, UserRole } from "../models/users.model";
import { createOrderType } from "../schemas/orders.schema";

class OrdersService {
  async createOrder(userId: string, region: string, data: createOrderType) {
    const index = await Orders.find({ region }).count();
    return await Orders.create({ userId, region, index, ...data });
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
