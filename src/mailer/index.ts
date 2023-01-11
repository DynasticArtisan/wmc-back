import { createTransport } from "nodemailer";
import config from "config";
import newUserTemplate, { NewUserData } from "./temlates/newUserTemplate";

class Mailer {
  transport;
  constructor() {
    this.transport = createTransport(config.get("smtp"), {
      from: 'приложение "МАРТ" <kpavel_wrk@mail.ru>',
    });
  }

  async sendNewUserMail(to: string, maildata: NewUserData) {
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
}
export default new Mailer();
