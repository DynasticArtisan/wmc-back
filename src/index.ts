import express from "express";
import morgan from "morgan";
import { connect } from "mongoose";
import config from "config";
import ErrorMiddleware from "./middlewares/error.middleware";

try {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use(ErrorMiddleware);
  connect(config.get("db"), {}, (err) => {
    if (err) {
      console.log("Соединение с базой данных отсутствует");
      return;
    }
    console.log("Соединение с базой данных установлено");

    const port = config.get("port");
    app.listen(port, () => {
      console.log("Сервер запущен на порту", port);
    });
  });
} catch (e) {
  console.log("Ошибка на сервере", e);
}
