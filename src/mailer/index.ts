import { createTransport } from "nodemailer";
import config from "config";
import newUserTemplate, { NewUserData } from "./temlates/newUserTemplate";
import recoverPasswordTemplate from "./temlates/recoverPasswordTemplate";

class Mailer {
  transport;
  constructor() {
    this.transport = createTransport(config.get("smtp"), {
      from: 'приложение "МАРТ" <kpavel_wrk@mail.ru>',
    });
  }

  async createUserMail(to: string, maildata: NewUserData) {
    try {
      await this.transport.sendMail({
        to,
        subject: 'Данные о вашем аккаунте для приложения "МАРТ"',
        html: newUserTemplate(maildata),
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async recoverPasswordMail(to: string, resetLink: string) {
    try {
      await this.transport.sendMail({
        to,
        subject: "Восстановление пароля",
        html: recoverPasswordTemplate(resetLink),
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
export default new Mailer();
