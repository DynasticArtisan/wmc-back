import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    index: { type: String, default: "", require: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    region: { type: String, default: "", require: true },
    information: {
      client: { type: String, default: "", require: true },
      clientEmail: { type: String, default: "", require: true },
      clientPhone: { type: String, default: "", require: true },
      clientAddress: { type: String, default: "", require: true },
      deceased: { type: String, default: "", require: true },
      cemetery: { type: String, default: "", require: true },
      graveDistrict: { type: String, default: "", require: true },
      graveRow: { type: String, default: "", require: true },
      gravePlace: { type: String, default: "", require: true },
    },
    services: [
      {
        title: { type: String, default: "", require: true },
        measurement: { type: String, default: "", require: true },
        quantity: { type: String, default: "", require: true },
        cost: { type: String, default: "", require: true },
        price: { type: String, default: "", require: true },
      },
    ],
    moreServices: { type: String, default: "" },
    payment: {
      type: { type: String, default: "", require: true },
      totalPrice: { type: String, default: "", require: true },
      discount: { type: String, default: "", require: true },
      discountType: { type: String, default: "", require: true },
      prepayment: { type: String, default: "", require: true },
      prepaymentType: { type: String, default: "", require: true },
      finalPrice: { type: String, default: "", require: true },
      paymentMethod: { type: String, default: "", require: true },
    },
    dates: {
      startAt: { type: String, default: "", require: true },
      endAt: { type: String, default: "", require: true },
    },
    comment: { type: String, default: "", require: true },
    uploadImage: { type: String, default: "", require: true },
    signImage: { type: String, default: "", require: true },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", schema);

export default Orders;
