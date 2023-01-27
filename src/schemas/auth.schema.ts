import { object, string, TypeOf } from "zod";
import { UserPasswordSchema } from "./users.schema";

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
