import mongoose, { Document, ObjectId } from "mongoose";

export interface ContactsDoc extends Document {
  userId: ObjectId;
  email: string;
  fullname: string;
  phone: string;
  birthday: string;
}

const schema = new mongoose.Schema<ContactsDoc>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  email: { type: String, default: "" },
  fullname: { type: String, default: "" },
  phone: { type: String, default: "" },
  birthday: { type: String, default: "" },
});

const Contacts = mongoose.model<ContactsDoc>("Contacts", schema);

export default Contacts;
