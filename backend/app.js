import express from "express";
import placeRoute from "./routes/place-route.js";
import userRoute from "./routes/user-route.js";
import HttpError from "./models/http-error.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { body } from "express-validator";
import mongoose from "mongoose";
import cors from 'cors';
import fs from "fs";
import path from "path";
const app = express();

const corsOptions = {
  origin: 'https://place-share-client-beta.vercel.app', // تحديد النطاق المسموح به
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions)); // تطبيق CORS

// Middleware لمعالجة بيانات JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/uploads", express.static(path.join("uploads")));
// Middleware لإضافة CORS headers

app.use("/api/places", placeRoute);
app.use("/api/users", userRoute);
app.use("/", (req, res, next) => {
  console.log("running......");
  res.send("Welcome to the homepage!");
});
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
