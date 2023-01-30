import { isValidObjectId } from "mongoose";
import { array, date, number, object, string, TypeOf, nativeEnum } from "zod";
import {
  OrderStatus,
  OrderType,
  PaymentMeasure,
  PaymentMethod,
} from "../models/orders.model";

export const OrderIdSchema = string().refine(
  (orderId) => isValidObjectId(orderId),
  {
    message: "Некорректный ID заказа",
  }
);

export const CreateOrderSchema = object({
  type: nativeEnum(OrderType),
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
  price: object({
    total: number(),
    discountValue: number(),
    discountMeasure: nativeEnum(PaymentMeasure),
    discount: number(),
    final: number(),
  }),
  prepayment: object({
    amount: number(),
    method: nativeEnum(PaymentMethod),
    date: date(),
  }).optional(),
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
  prepayment: true,
});
export type UpdateOrderType = TypeOf<typeof UpdateOrderSchema>;

export const GetOrderReqSchema = object({
  params: object({
    orderId: OrderIdSchema,
  }),
});
export type GetOrderReqType = TypeOf<typeof GetOrderReqSchema>;

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
    status: nativeEnum(OrderStatus),
  }),
});
export type UpdateOrderStatusReqType = TypeOf<
  typeof UpdateOrderStatusReqSchema
>;
