import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import config from "config";
import ErrorMiddleware from "./middlewares/error.middleware";
import apiRouter from "./routers/api.router";
const PORT = config.get<number>("port");
const DB = config.get<string>("db");

try {
  const app = express();
  app.use(cors({ credentials: true, origin: config.get("siteUrl") }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use("/api", apiRouter);
  app.use(ErrorMiddleware);

  mongoose.set("strictQuery", true);
  mongoose.connect(DB, {}, (err) => {
    if (err) {
      console.log("Соединение с базой данных отсутствует");
      return process.exit();
    }
    console.log("Соединение с базой данных установлено");
    app.listen(PORT, () => {
      console.log("Сервер запущен на порту", PORT);
    });
  });
} catch (e) {
  console.log("Ошибка на сервере", e);
}
