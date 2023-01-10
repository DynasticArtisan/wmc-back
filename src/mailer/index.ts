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

  async sendNewUserMail(to: string, data: NewUserData) {
    try {
      return await this.transport.sendMail({
        to,
        subject: 'Данные о вашем аккаунте для приложения "МАРТ"',
        html: newUserTemplate(data),
      });
    } catch (e) {
      console.log(e);
    }
  }
}
export default new Mailer();
