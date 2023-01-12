import { isValidObjectId } from "mongoose";
import { array, object, string, TypeOf } from "zod";

export const orderIdSchema = string().refine(
  (orderId) => isValidObjectId(orderId),
  {
    message: "Некорректный ID заказа",
  }
);
export const getOrderReqSchema = object({
  params: object({
    orderId: orderIdSchema,
  }),
});
export type getOrderReqType = TypeOf<typeof getOrderReqSchema>;

export const createOrderSchema = object({
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
    type: string(),
    totalPrice: string(),
    discount: string(),
    discountType: string(),
    prepayment: string(),
    prepaymentType: string(),
    finalPrice: string(),
    paymentMethod: string(),
  }),
  dates: object({
    startAt: string(),
    endAt: string(),
  }),
  comment: string().optional(),
  uploadImage: string().optional(),
  signImage: string(),
});
export type createOrderType = TypeOf<typeof createOrderSchema>;

export const createOrderReqSchema = object({
  body: createOrderSchema,
});
