import { isValidObjectId } from "mongoose";
import { date, object, string, TypeOf } from "zod";
import { UserRegion, UserRole } from "../models/users.model";

export const UserIdSchema = string().refine(
  (userId) => isValidObjectId(userId),
  {
    message: "Некорректный ID пользователя",
  }
);
export const UserEmailSchema = string().email();
export const UserRoleShema = string().refine(
  (role) => Object.values<string>(UserRole).includes(role),
  {
    message: "Некорректная роль",
  }
);
export const UserRegionShema = string().refine(
  (region) => Object.values<string>(UserRegion).includes(region),
  {
    message: "Некорректный регион",
  }
);
export const UserContactsSchema = object({
  email: string().optional(),
  fullname: string().optional(),
  phone: string().optional(),
  birthday: string().optional(),
});
export const UserPasswordSchema = string().refine(
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
  email: UserEmailSchema,
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

export const ReplacePasswordReqSchema = object({
  body: object({
    password: string(),
    newPassword: UserPasswordSchema,
  }),
});
export type ReplacePasswordReqType = TypeOf<typeof ReplacePasswordReqSchema>;

export const ReplaceEmailReqSchema = object({
  body: object({
    email: UserEmailSchema,
    password: UserPasswordSchema,
  }),
});
export type ReplaceEmailReqType = TypeOf<typeof ReplaceEmailReqSchema>;
