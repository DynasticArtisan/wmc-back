import ApiError from "../exceptions";
import generatePassword from "password-generator";
import Users, { UserRegion, UserRole } from "../models/users.model";
import { CreateUserType, UserContactsType } from "../schemas/users.schema";
import Contacts, { ContactsDocument } from "../models/contacts.model";
import mailer from "../mailer";

class UsersService {
  async identify(identity: string) {
    const userWithEmail = await Users.findOne({ email: identity });
    if (userWithEmail) {
      return userWithEmail;
    }
    const userWithLogin = await Users.findOne({ login: identity });
    if (userWithLogin) {
      return userWithLogin;
    }
    throw ApiError.BadRequest("Пользователь не найден");
  }
  async authorize(login: string, password: string) {
    const user = await Users.findOne({ login });
    if (!user) {
      throw ApiError.BadRequest("Неверные логин или пароль");
    }
    const isEqual = await user.comparePassword(password);
    if (!isEqual) {
      throw ApiError.BadRequest("Неверные логин или пароль");
    }
    return user;
  }

  async createUser({
    email,
    login,
    region,
    role,
    fullname,
    phone,
  }: CreateUserType) {
    const sameEmailUser = await Users.findOne({ email });
    if (sameEmailUser) {
      throw ApiError.BadRequest("Пользователь с такой почтой уже существует.");
    }
    const sameLoginUser = await Users.findOne({ login });
    if (sameLoginUser) {
      throw ApiError.BadRequest("Пользователь с таким именем уже существует.");
    }
    const password = generatePassword(8, false, /[\w\W\d\p]/);
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
      .populate<{ contacts: ContactsDocument }>({
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

  async updateUserPassword(userId: string, password: string) {
    const user = await Users.findById(userId);
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    user.password = password;
    await user.save();
    return;
  }
  async replaceUserPassword(
    userId: string,
    password: string,
    newPassword: string
  ) {
    const user = await Users.findById(userId);
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    const isEqual = await user.comparePassword(password);
    if (!isEqual) {
      throw ApiError.Forbiden("Неверный пароль");
    }
    user.password = newPassword;
    await user.save();
    return true;
  }
  async replaceUserEmail(userId: string, email: string, password: string) {
    const user = await Users.findById(userId);
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    const isEqual = await user.comparePassword(password);
    if (!isEqual) {
      throw ApiError.Forbiden("Неверный пароль");
    }
    user.email = email;
    await user.save();
    return true;
  }

  async updateUserRole(userId: string, role: UserRole) {
    const user = await Users.findByIdAndUpdate(userId, { role });
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    return;
  }
  async updateUserRegion(userId: string, region: UserRegion) {
    const user = await Users.findByIdAndUpdate(userId, { region });
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    return;
  }
  async updateUserContacts(userId: string, userContacts: UserContactsType) {
    const contacts = await Contacts.findOneAndUpdate({ userId }, userContacts);
    if (!contacts) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    return;
  }
  async deleteUser(userId: string) {
    const user = await Users.findByIdAndDelete(userId);
    if (!user) {
      throw ApiError.NotFound("Пользователь не найден");
    }
    // await Contacts.deleteOne({ userId }); что будет с заказом без контактов?
    return true;
  }
}

export default new UsersService();
