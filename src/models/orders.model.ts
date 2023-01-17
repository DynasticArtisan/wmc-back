import mongoose, { ObjectId } from "mongoose";
import { UserRegion } from "./users.model";

export enum OrderStatus {
  active = "В работе",
  done = "Выполнен",
}

export enum OrderType {
  graveImprovement = "Благоустройство могил",
}

export interface OrderDocument extends Document {
  index: number;
  userId: ObjectId;
  region: UserRegion;
  status: OrderStatus;
  type: OrderType;
  information: OrderInformation;
  services: OrderService[];
  moreServices: string;
  payment: OrderPayment;
  dates: OrderDates;
  comment?: string;
  uploadImage?: string;
  signImage: string;
}

interface OrderInformation {
  client: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  deceased: string;
  cemetery: string;
  graveDistrict: string;
  graveRow: string;
  gravePlace: string;
}

interface OrderService {
  title: string;
  measurement: string;
  quantity: string;
  cost: string;
  price: string;
}

interface OrderPayment {
  totalPrice: string;
  discountValue: string;
  discountMeasure: string;
  discount: string;
  finalPrice: string;
  prepaymentType: string;
  prepaymentValue: string;
  prepaymentMeasure: string;
  prepayment: string;
  method: string;
}

interface OrderDates {
  startAt: string;
  endAt: string;
}

const schema = new mongoose.Schema<OrderDocument>(
  {
    index: { type: Number, require: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    type: { type: String, require: true },
    region: { type: String, require: true },
    information: {
      client: { type: String, require: true },
      clientEmail: { type: String, default: "" },
      clientPhone: { type: String, require: true },
      clientAddress: { type: String, default: "" },
      deceased: { type: String, require: true },
      cemetery: { type: String, require: true },
      graveDistrict: { type: String, require: true },
      graveRow: { type: String, require: true },
      gravePlace: { type: String, require: true },
    },
    services: [
      {
        title: { type: String, require: true },
        measurement: { type: String, require: true },
        quantity: { type: String, require: true },
        cost: { type: String, require: true },
        price: { type: String, require: true },
      },
    ],
    moreServices: { type: String },
    payment: {
      totalPrice: { type: String, require: true },

      discountValue: { type: String, require: true },
      discountMeasure: { type: String, require: true },
      discount: { type: String, require: true },

      finalPrice: { type: String, require: true },

      prepaymentType: { type: String, require: true },
      prepaymentValue: { type: String, require: true },
      prepaymentMeasure: { type: String, require: true },
      prepayment: { type: String, require: true },

      method: { type: String, require: true },
    },
    dates: {
      startAt: { type: String, require: true },
      endAt: { type: String, require: true },
    },
    comment: { type: String },
    uploadImage: { type: String },
    signImage: { type: String, require: true },
    status: { type: String, default: OrderStatus.active },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model<OrderDocument>("Orders", schema);

export default Orders;
