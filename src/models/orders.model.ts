import mongoose, { ObjectId } from "mongoose";
import { UserRegion } from "./users.model";

export enum OrderStatus {
  active = "В работе",
  done = "Выполнен",
}

export enum OrderType {
  graveImprovement = "Благоустройство могил",
}

export enum PaymentMeasure {
  percent = "%",
  currency = "руб",
}

export enum PrepaymentType {
  prepayment = "авансовый платёж",
  fullPrepayment = "полный расчёт",
  withoutPrepayment = "без предоплаты",
}

export enum PaymentMethod {
  card = "банковской картой",
  cash = "наличными",
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
  dates: OrderDates;
  price: OrderPrice;
  payments: OrderPayment[];
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
  quantity: number;
  cost: number;
  price: number;
}

interface OrderPrice {
  total: number;
  discountValue: number;
  discountMeasure: PaymentMeasure;
  discount: number;
  final: number;
}

export interface OrderPayment {
  amount: number;
  method: PaymentMethod;
  date: Date;
}

interface OrderDates {
  startAt: string;
  endAt: string;
}

const schema = new mongoose.Schema<OrderDocument>(
  {
    index: { type: Number, require: true },
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
        quantity: { type: Number, require: true },
        cost: { type: Number, require: true },
        price: { type: Number, require: true },
      },
    ],
    moreServices: { type: String },
    price: {
      total: { type: Number, require: true },
      discountValue: { type: Number, require: true },
      discountMeasure: { type: String, require: true },
      discount: { type: Number, require: true },
      final: { type: Number, require: true },
    },
    payments: [
      {
        amount: { type: Number },
        method: { type: String },
        date: { type: Date },
      },
    ],
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
