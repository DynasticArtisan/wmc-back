import mongoose from "mongoose";

export enum OrderStatus {
  active = "В работе",
}

const schema = new mongoose.Schema(
  {
    index: { type: Number, require: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
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
      type: { type: String, require: true },
      totalPrice: { type: String, require: true },
      discount: { type: String, require: true },
      discountType: { type: String, require: true },
      prepayment: { type: String, require: true },
      prepaymentType: { type: String, require: true },
      finalPrice: { type: String, require: true },
      paymentMethod: { type: String, require: true },
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

const Orders = mongoose.model("Orders", schema);

export default Orders;
