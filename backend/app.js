import express from "express";
import placeRoute from "./routes/place-route.js";
import userRoute from "./routes/user-route.js";
import HttpError from "./models/http-error.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { checkToken } from "./middleware/check-Auth.js";
import cors from 'cors';
import cloudinary from "cloudinary";

const app = express();

const corsOptions = {
  origin: 'https://place-share-client-lake.vercel.app', // تحديد النطاق المسموح به
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions)); // تطبيق CORS

// Middleware لمعالجة بيانات JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


// Middleware لإضافة CORS headers

app.use("/api/places", placeRoute);
app.use("/api/users", userRoute);
app.use("/checkToken",checkToken)
app.use("/", (req, res, next) => {
  console.log("running......");
  res.send("Welcome to the homepage!");
});
app.all("*", (req, res, next) => {
  return next(new HttpError(400, "No Route"));
});

app.use(async(error, req, res, next) => {
  console.log("test");
  console.log(error);
  if (req.file) {
      await cloudinary.v2.uploader.destroy(req.body.imagePublicId);
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
