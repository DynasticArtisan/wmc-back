import mongoose from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  USER = "Пользователь",
  MANAGER = "Менеджер",
  ADMIN = "Администратор",
}

export enum UserRegion {
  VN = "Великий Новгород",
}

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  return next();
});

schema.virtual("contacts", {
  ref: "Contacts",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

const Users = mongoose.model("User", schema);

export default Users;
