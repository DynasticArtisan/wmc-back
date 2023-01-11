import ApiError from "../exceptions";
import generatePassword from "password-generator";
import Users, { UserRole } from "../models/users.model";
import { createUserType } from "../schemas/users.schema";
import Contacts, { ContactsDoc } from "../models/contacts.model";
import mailer from "../mailer";

class UsersService {
  async createUser({
    email,
    login,
    region,
    role,
    fullname,
    phone,
  }: createUserType) {
    const sameEmailUser = await Users.findOne({ email });
    if (sameEmailUser) {
      throw ApiError.BadRequest("Пользователь с такой почтой уже существует.");
    }
    const sameLoginUser = await Users.findOne({ login });
    if (sameLoginUser) {
      throw ApiError.BadRequest("Пользователь с таким именем уже существует.");
    }
    const password = this.createPassword();
    const mailStatus = await mailer.sendNewUserMail(email, { login, password });
    if (!mailStatus) {
      throw ApiError.BadRequest(
        "Некорректный email, не удалось отправить письмо"
      );
    }
    const user = await Users.create({
      email,
      login,
      region,
      role,
      password,
    });
    const contacts = await Contacts.create({
      userId: user._id,
      email,
      fullname,
      phone,
    });
    return { ...user, contacts };
  }
  async getUsers() {
    return await Users.find()
      .select("-password -__v")
      .populate<{ contacts: ContactsDoc }>({
        path: "contacts",
        select: "-_id -__v",
      })
      .lean();
  }

  async getUser(userId: string) {
    const user = await Users.findById(userId).select("-password -__v");
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    return user;
  }
  async getUserContacts(userId: string) {
    const contacts = await Contacts.findOne({ userId }).select(
      "-_id -userId -__v"
    );
    if (!contacts) {
      throw ApiError.NotFound("Контакты пользователя не найдены");
    }
    return contacts;
  }

  async updateUserEmail(userId: string, email: string) {
    const user = await Users.findByIdAndUpdate(userId, { email });
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    return true;
  }
  async updateUserPassword(userId: string) {
    const user = await Users.findById(userId);
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    user.password = this.createPassword();
    await user.save();
    return true;
  }
  async updateUserRole(userId: string, role: UserRole) {
    const user = await Users.findByIdAndUpdate(userId, { role });
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    return true;
  }
  async updateUserRegion(userId: string, region: string) {
    const user = await Users.findByIdAndUpdate(userId, { region });
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    return true;
  }
  async updateUserContacts(userId: string, contacts: any) {
    const user = await Contacts.findOneAndUpdate({ userId }, contacts);
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    return true;
  }

  async deleteUser(userId: string) {
    const user = await Users.findByIdAndDelete(userId);
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    await Contacts.deleteOne({ userId });
    return true;
  }

  createPassword() {
    return generatePassword(8, false, /[\w\W\d\p]/);
  }
  async validatePassword() {}
}

export default new UsersService();
