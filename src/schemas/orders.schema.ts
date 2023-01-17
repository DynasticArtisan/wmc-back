import { isValidObjectId } from "mongoose";
import { array, object, string, TypeOf } from "zod";
import { OrderStatus, OrderType } from "../models/orders.model";

export const OrderIdSchema = string().refine(
  (orderId) => isValidObjectId(orderId),
  {
    message: "Некорректный ID заказа",
  }
);
export const GetOrderReqSchema = object({
  params: object({
    orderId: OrderIdSchema,
  }),
});
export type GetOrderReqType = TypeOf<typeof GetOrderReqSchema>;

export const CreateOrderSchema = object({
  type: string().refine(
    (type) => Object.values<string>(OrderType).includes(type),
    {
      message: "Некорректный тип заказа",
    }
  ),
  information: object({
    client: string(),
    clientEmail: string().optional(),
    clientPhone: string(),
    clientAddress: string().optional(),
    deceased: string(),
    cemetery: string(),
    graveDistrict: string(),
    graveRow: string(),
    gravePlace: string(),
  }),
  services: array(
    object({
      title: string(),
      measurement: string(),
      quantity: string(),
      cost: string(),
      price: string(),
    })
  ),
  moreServices: string().optional(),
  payment: object({
    totalPrice: string(),
    discountValue: string(),
    discountMeasure: string(),
    discount: string(),
    finalPrice: string(),
    prepaymentType: string(),
    prepaymentValue: string(),
    prepaymentMeasure: string(),
    prepayment: string(),
    method: string(),
  }),
  dates: object({
    startAt: string(),
    endAt: string(),
  }),
  comment: string().optional(),
  uploadImage: string().optional(),
  signImage: string(),
});
export type CreateOrderType = TypeOf<typeof CreateOrderSchema>;

export const CreateOrderReqSchema = object({
  body: CreateOrderSchema,
});

export const UpdateOrderReqSchema = object({
  params: object({
    orderId: OrderIdSchema,
  }),
  body: CreateOrderSchema,
});
export type UpdateOrderReqType = TypeOf<typeof UpdateOrderReqSchema>;

export const UpdateOrderStatusReqSchema = object({
  params: object({
    orderId: OrderIdSchema,
  }),
  body: object({
    status: string().refine(
      (status) => Object.values<string>(OrderStatus).includes(status),
      "Некорректный статус"
    ),
  }),
});
export type UpdateOrderStatusReqType = TypeOf<
  typeof UpdateOrderStatusReqSchema
>;
