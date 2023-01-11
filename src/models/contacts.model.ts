import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  fullName: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  phone: { type: String, default: "" },
  dateBirth: { type: String, default: "" },
});

const Contacts = mongoose.model("Contacts", schema);

export default Contacts;
