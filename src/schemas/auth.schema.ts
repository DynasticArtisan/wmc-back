import { object, string, TypeOf } from "zod";
import {
  UserContactsSchema,
  UserEmailSchema,
  UserPasswordSchema,
} from "./users.schema";

export const AuthorizeReqSchema = object({
  body: object({
    login: string(),
    password: string(),
  }),
});
export type AuthorizeReqType = TypeOf<typeof AuthorizeReqSchema>;

export const ForgotPasswordReqSchema = object({
  body: object({
    identity: string(),
  }),
});
export type ForgotPasswordReqType = TypeOf<typeof ForgotPasswordReqSchema>;

export const ResetPasswordReqSchema = object({
  body: object({
    resetToken: string(),
    password: UserPasswordSchema,
  }),
});
export type ResetPasswordReqType = TypeOf<typeof ResetPasswordReqSchema>;

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
