import mongoose, { Date, Document, ObjectId } from "mongoose";

export interface ContactsDocument extends Document {
  userId: ObjectId;
  email: string;
  fullname: string;
  phone: string;
  birthday: string;
}

const schema = new mongoose.Schema<ContactsDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  birthday: { type: String, default: "" },
});

const Contacts = mongoose.model<ContactsDocument>("Contacts", schema);

export default Contacts;
