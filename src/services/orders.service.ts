import ApiError from "../exceptions";
import Orders from "../models/orders.model";

class OrdersService {
  async createOrder() {}

  async getOrders() {
    return await Orders.find();
  }

  async getOrder(orderId: string) {
    const order = await Orders.findById(orderId);
    if (!order) {
      throw ApiError.NotFound("Заказ не найден");
    }
    return order;
  }

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
