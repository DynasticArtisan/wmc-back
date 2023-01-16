import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  USER = "Пользователь",
  MANAGER = "Менеджер",
  ADMIN = "Администратор",
}

export enum UserRegion {
  VN = "ВН",
  PS = "ПСК",
  TV = "ТРЬ",
  VG = "ВГДА",
  HP = "ЧПЦ",
  SPB = "СПБ",
}

interface UserDoc extends Document {
  email: string;
  login: string;
  password: string;
  region: UserRegion;
  role: UserRole;
  comparePassword(password: string): Promise<boolean>;
  AuthDTO(): Auth;
}

export type Auth = {
  userId: string;
  login: string;
  region: string;
  role: UserRole;
};

const schema = new mongoose.Schema<UserDoc>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    login: {
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

schema.method(
  "comparePassword",
  async function (trypassword: string): Promise<boolean> {
    const { password } = this as UserDoc;
    return await bcrypt.compare(trypassword, password).catch((e) => false);
  }
);

schema.method("AuthDTO", function (): Auth {
  const { _id: userId, login, region, role } = this as UserDoc;
  return { userId, login, region, role };
});

const Users = mongoose.model<UserDoc>("Users", schema);

export default Users;
