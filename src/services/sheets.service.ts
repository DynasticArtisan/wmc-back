import {
  GoogleSpreadsheet,
  ServiceAccountCredentials,
} from "google-spreadsheet";
import { ContactsDocument } from "../models/contacts.model";
import { OrderDocument } from "../models/orders.model";
import config from "config";

interface SheetConfig {
  sheetId: string;
  credentials: ServiceAccountCredentials;
}
const { sheetId, credentials } = config.get<SheetConfig>("googleSheets");

class SheetsService {
  sheets;
  constructor() {
    this.sheets = new GoogleSpreadsheet(sheetId);
    this.sheets.useServiceAccountAuth(credentials);
  }

  async writeOrder(order: OrderDocument, creator: ContactsDocument) {
    const orderDate = new Date().toLocaleDateString();
    const orderNumber = order.region + order.index;
    const orderClient = `
      ${order.information.client}\n
      ${order.information.clientPhone}\n
      ${order.information.clientAddress}\n
      ${order.information.clientEmail}
    `;
    const orderDeceased = `
      ${order.information.cemetery}\n
      ${order.information.deceased}
    `;
    const orderGrave = `
      Участок: ${order.information.graveDistrict}\n
      Ряд: ${order.information.graveRow}\n
      Место: ${order.information.gravePlace}
    `;
    const orderCreator = `
        ${creator.fullname}\n
        ${creator.email}\n
        ${creator.phone}
      `;
    const orderSumm = order.payment.finalPrice;
    const orderServices = order.services.reduce(
      (string, { title, quantity, measurement, cost, price }) => {
        return (
          string +
          `
            Услуга: "${title}";\n
            Размер: ${quantity} ${measurement}\n
            Цена за ед: ${cost}руб;\n
            Цена: ${price}руб;\n\n
          `
        );
      },
      ""
    );
    const orderPayment = order.payment.prepayment;
    const newRow = {
      "Дата Заказа": orderDate,
      "№ заказа": orderNumber,
      "фио заказчика/ТЕЛЕФОН": orderClient,
      "Адрес Захоронения,ФИО умершего": orderDeceased,
      "УЧАСТОК/РЯД/МЕСТО": orderGrave,
      МАП: orderCreator,
      "Общая сумма заказа": orderSumm,
      "производимые работы": orderServices,
      "Аванс , доплата": orderPayment,
      "Дата внесения денег": orderDate,
    };
    await this.sheets.loadInfo();
    const sheet = this.sheets.sheetsByIndex[0];
    const { rowIndex } = await sheet.addRow(newRow);
    await sheet.loadCells(`A${rowIndex}:S${rowIndex}`);
    // сумма заказа
    sheet.getCellByA1("G" + rowIndex).numberFormat = {
      type: "CURRENCY",
      pattern: "[$р.-419]#,##0",
    };
    // доплата/аванс
    sheet.getCellByA1("L" + rowIndex).numberFormat = {
      type: "CURRENCY",
      pattern: "[$р.-419]#,##0",
    };
    // дата внесения доплата/аванс
    sheet.getCellByA1("M" + rowIndex).numberFormat = {
      type: "DATE",
      pattern: "dd.mm.yyyy",
    };
    // ЦПА+РАСХОДНИК
    sheet.getCellByA1("H" + rowIndex).formula = `=G${rowIndex}*0,125`;
    // Цена Бетонных работ
    sheet.getCellByA1(
      "I" + rowIndex
    ).formula = `=СУММ(G${rowIndex}-H${rowIndex}-J${rowIndex})`;
    // МАП (20%) бетон
    sheet.getCellByA1("N" + rowIndex).formula = `=ПРОИЗВЕД(0,2;I${rowIndex})`;
    // Оплата установщикам (20%)
    sheet.getCellByA1("Q" + rowIndex).formula = `=ПРОИЗВЕД(0,2;I${rowIndex})`;
    // Сумма долга
    sheet.getCellByA1(
      "R" + rowIndex
    ).formula = `=СУММ(G${rowIndex}-L${rowIndex})`;
    // Выручка
    sheet.getCellByA1(
      "S" + rowIndex
    ).formula = `=СУММ(G${rowIndex}-J${rowIndex}-N${rowIndex}-O${rowIndex}-Q${rowIndex})`;
    await sheet.saveUpdatedCells();
    return rowIndex;
  }
}
export default new SheetsService();
