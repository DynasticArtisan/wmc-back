import { isValidObjectId } from "mongoose";
import { array, number, object, string, TypeOf } from "zod";
import {
  OrderStatus,
  OrderType,
  PaymentMeasure,
  PaymentMethod,
  PrepaymentType,
} from "../models/orders.model";

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
    "Некорректный тип заказа"
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
      quantity: number(),
      cost: number(),
      price: number(),
    })
  ),
  moreServices: string().optional(),
  payment: object({
    totalPrice: number(),
    discountValue: number(),
    discountMeasure: string().refine(
      (measure) => Object.values<string>(PaymentMeasure).includes(measure),
      "Некорректные еденицы измерения"
    ),
    discount: number(),
    finalPrice: number(),
    prepaymentType: string().refine(
      (type) => Object.values<string>(PrepaymentType).includes(type),
      "Некорректный тип предолаты"
    ),
    prepaymentValue: number(),
    prepaymentMeasure: string().refine(
      (measure) => Object.values<string>(PaymentMeasure).includes(measure),
      "Некорректные еденицы измерения"
    ),
    prepayment: number(),
    method: string().refine(
      (method) => Object.values<string>(PaymentMethod).includes(method),
      "Некорректный метод оплаты"
    ),
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

export const UpdateOrderSchema = CreateOrderSchema.omit({
  type: true,
  signImage: true,
});
export type UpdateOrderType = TypeOf<typeof UpdateOrderSchema>;

export const CreateOrderReqSchema = object({
  body: CreateOrderSchema,
});

export const UpdateOrderReqSchema = object({
  params: object({
    orderId: OrderIdSchema,
  }),
  body: UpdateOrderSchema,
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
