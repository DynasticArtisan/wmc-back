import { isValidObjectId } from "mongoose";
import { object, string, TypeOf } from "zod";
import { UserRegion, UserRole } from "../models/users.model";

export const userIdSchema = string().refine(
  (userId) => isValidObjectId(userId),
  {
    message: "Некорректный ID пользователя",
  }
);
export const getUserReqSchema = object({
  params: object({
    userId: userIdSchema,
  }),
});
export type getUserReqType = TypeOf<typeof getUserReqSchema>;

export const createUserSchema = object({
  email: string(),
  login: string(),
  role: string().refine(
    (role) => Object.values<string>(UserRole).includes(role),
    {
      message: "Некорректная роль пользователя",
    }
  ),
  region: string().refine(
    (region) => Object.values<string>(UserRegion).includes(region),
    {
      message: "Некорректный регион пользователя",
    }
  ),
  fullname: string(),
  phone: string(),
});
export type createUserType = TypeOf<typeof createUserSchema>;
export const createUserReqSchema = object({
  body: createUserSchema,
});
export type createUserReqType = TypeOf<typeof createUserReqSchema>;

export const loginUserSchema = object({
  login: string(),
  password: string(),
});
export type loginUserType = TypeOf<typeof loginUserSchema>;
export const loginUserReqSchema = object({
  body: loginUserSchema,
});
export type loginUserReqType = TypeOf<typeof loginUserReqSchema>;
