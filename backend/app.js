import express from "express";
import placeRoute from "./routes/place-route.js";
import userRoute from "./routes/user-route.js";
import HttpError from "./models/http-error.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { body } from "express-validator";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
const app = express();

// Middleware لمعالجة بيانات JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/uploads", express.static(path.join("uploads")));
// Middleware لإضافة CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // السماح لجميع الدومينات (أو حدد دومين معين بدل *)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  ); // السماح بأنواع معينة من الطلبات
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // السماح بالهيدرز المطلوبة
  next(); // متابعة الطلب للـ routes
});

app.use("/", (req, res, next) => {
  console.log("running......");
  res.send("Welcome to the homepage!");
});
app.use("/api/places", placeRoute);
app.use("/api/users", userRoute);
app.all("*", (req, res, next) => {
  return next(new HttpError(400, "No Route"));
});

app.use((error, req, res, next) => {
  console.log(error);
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ code: error.code, message: error.message } || "unknown Error");
});

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
app.listen(process.env.PORT || 3000);
