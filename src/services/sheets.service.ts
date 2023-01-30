import {
  GoogleSpreadsheet,
  ServiceAccountCredentials,
} from "google-spreadsheet";
import { ContactsDocument } from "../models/contacts.model";
import { OrderDocument } from "../models/orders.model";
import config from "config";

enum SheetHeaders {
  orderDate = "Дата Заказа",
  orderNumber = "№ заказа",
  orderClient = "фио заказчика/ТЕЛЕФОН",
  orderDeceased = "Адрес Захоронения,ФИО умершего",
  orderGrave = "УЧАСТОК/РЯД/МЕСТО",
  orderCreator = "МАП",
  orderPrice = "Общая сумма заказа",
  orderServices = "производимые работы",
  orderPayments = "Аванс , доплата",
  orderPaydates = "Дата внесения денег",
  orderDept = "Сумма долга",
  rawCost = "ЦПА+РАСХОДНИК",
  materialsCost = "себестоимость ограды+скамейка+стол+плитка+крошка",
  laborCost = "Цена Бетонных работ",
  concreteCost = "МАП (20%) бетон",
  departureCost = "выезд",
  installCost = "Оплата установщикам (20%)",
  orderProfit = "выручка",
}

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

  async createOrder(order: OrderDocument, creator: ContactsDocument) {
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
    const orderPrice = order.price.final;
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
    const orderPayments = order.payments
      .map((payment) => "р." + payment.amount)
      .join("\n");
    const orderPaydates = order.payments
      .map((payment) => payment.date)
      .join("\n");
    const orderDept =
      orderPrice -
      order.payments.reduce((summ, payment) => summ + payment.amount, 0);
    const newRow = {
      [SheetHeaders.orderDate]: orderDate,
      [SheetHeaders.orderNumber]: orderNumber,
      [SheetHeaders.orderClient]: orderClient,
      [SheetHeaders.orderDeceased]: orderDeceased,
      [SheetHeaders.orderGrave]: orderGrave,
      [SheetHeaders.orderCreator]: orderCreator,
      [SheetHeaders.orderPrice]: orderPrice,
      [SheetHeaders.orderServices]: orderServices,
      [SheetHeaders.orderPayments]: orderPayments,
      [SheetHeaders.orderPaydates]: orderPaydates,
      [SheetHeaders.orderDept]: orderDept,
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
    // Выручка
    sheet.getCellByA1(
      "S" + rowIndex
    ).formula = `=СУММ(G${rowIndex}-J${rowIndex}-N${rowIndex}-O${rowIndex}-Q${rowIndex})`;

    // доплата/аванс
    // sheet.getCellByA1("L" + rowIndex).numberFormat = {
    //   type: "CURRENCY",
    //   pattern: "[$р.-419]#,##0",
    // };
    // дата внесения доплата/аванс
    // sheet.getCellByA1("M" + rowIndex).numberFormat = {
    //   type: "DATE",
    //   pattern: "dd.mm.yyyy",
    // };
    // Сумма долга
    // sheet.getCellByA1(
    //   "R" + rowIndex
    // ).formula = `=СУММ(G${rowIndex}-L${rowIndex})`;

    await sheet.saveUpdatedCells();
    return rowIndex;
  }

  async updateOrder(order: OrderDocument) {
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
    const orderPrice = order.price.final;
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
    const orderPayments = order.payments
      .map((payment) => "р." + payment.amount)
      .join("\n");
    const orderPaydates = order.payments
      .map((payment) => payment.date)
      .join("\n");
    const orderDept =
      orderPrice -
      order.payments.reduce((summ, payment) => summ + payment.amount, 0);
    await this.sheets.loadInfo();
    const rows = await this.sheets.sheetsByIndex[0].getRows();
    const row = rows.find(
      (row) => row[SheetHeaders.orderNumber] == orderNumber
    );
    if (row) {
      row[SheetHeaders.orderClient] = orderClient;
      row[SheetHeaders.orderDeceased] = orderDeceased;
      row[SheetHeaders.orderGrave] = orderGrave;
      row[SheetHeaders.orderPrice] = orderPrice;
      row[SheetHeaders.orderServices] = orderServices;
      row[SheetHeaders.orderPayments] = orderPayments;
      row[SheetHeaders.orderPaydates] = orderPaydates;
      row[SheetHeaders.orderDept] = orderDept;
      await row.save();
      return true;
    }
    return false;
  }

  async deleteOrder(order: OrderDocument) {
    const orderNumber = order.region + order.index;
    await this.sheets.loadInfo();
    const rows = await this.sheets.sheetsByIndex[0].getRows();
    const row = rows.find(
      (row) => row[SheetHeaders.orderNumber] == orderNumber
    );
    if (row) {
      await row.delete();
      return true;
    }
    return false;
  }
}
export default new SheetsService();
