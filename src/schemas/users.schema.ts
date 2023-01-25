import { isValidObjectId } from "mongoose";
import { date, object, string, TypeOf } from "zod";
import { UserRegion, UserRole } from "../models/users.model";

export const UserIdSchema = string().refine(
  (userId) => isValidObjectId(userId),
  {
    message: "Некорректный ID пользователя",
  }
);
const UserRoleShema = string().refine(
  (role) => Object.values<string>(UserRole).includes(role),
  {
    message: "Некорректная роль",
  }
);
const UserRegionShema = string().refine(
  (region) => Object.values<string>(UserRegion).includes(region),
  {
    message: "Некорректный регион",
  }
);
const UserContactsSchema = object({
  email: string().optional(),
  fullname: string().optional(),
  phone: string().optional(),
  birthday: string().optional(),
});
const UserPasswordSchema = string().refine(
  (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/.test(pass),
  "Пароль слишком простой"
);
export type UserContactsType = TypeOf<typeof UserContactsSchema>;

export const GetUserReqSchema = object({
  params: object({
    userId: UserIdSchema,
  }),
});
export type GetUserReqType = TypeOf<typeof GetUserReqSchema>;

export const CreateUserSchema = object({
  email: string(),
  login: string(),
  role: UserRoleShema,
  region: UserRegionShema,
  fullname: string(),
  phone: string(),
});
export type CreateUserType = TypeOf<typeof CreateUserSchema>;
export const CreateUserReqSchema = object({
  body: CreateUserSchema,
});
export type CreateUserReqType = TypeOf<typeof CreateUserReqSchema>;

export const AuthorizeUserSchema = object({
  login: string(),
  password: string(),
});
export type AuthorizeUserType = TypeOf<typeof AuthorizeUserSchema>;
export const AuthorizeUserReqSchema = object({
  body: AuthorizeUserSchema,
});
export type AuthorizeUserReqType = TypeOf<typeof AuthorizeUserReqSchema>;

export const UpdateUserRoleReqSchema = object({
  params: object({
    userId: UserIdSchema,
  }),
  body: object({
    role: UserRoleShema,
  }),
});
export type UpdateUserRoleReqType = TypeOf<typeof UpdateUserRoleReqSchema>;

export const UpdateUserRegionReqSchema = object({
  params: object({
    userId: UserIdSchema,
  }),
  body: object({
    region: UserRegionShema,
  }),
});
export type UpdateUserRegionReqType = TypeOf<typeof UpdateUserRegionReqSchema>;

export const UpdateContactsReqSchema = object({
  body: UserContactsSchema,
});
export type UpdateContactsReqType = TypeOf<typeof UpdateContactsReqSchema>;

export const UpdateMyPasswordReqSchema = object({
  body: object({
    password: string(),
    newPassword: UserPasswordSchema,
  }),
});
export type UpdateMyPasswordReqType = TypeOf<typeof UpdateMyPasswordReqSchema>;
