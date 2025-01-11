//get-user
//signup
//login
import HttpError from "../models/http-error.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const cookiesOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOCKIES_EXPIRATION * 24 * 60 * 60 * 1000
  ),
  secure: true,       
  sameSite: 'None'
};
export const signup = async (req, res, next) => {
  try {
    req.body.places = [];
    const user = await User.create([req.body]);
    const token = generateToken(user[0]._id, user[0].email);

    res.cookie("jwt", token, cookiesOptions);
    user[0].password = undefined;
    res.status(200).json({
      status: "success",
      data: user[0],
    });
  } catch (err) {
    console.log(err);
    let message = "there is error in signup";
    if (err && err.keyPattern && err.keyPattern.email) {
      message = "email is already used";
    }
    return next(new HttpError(400, message));
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return next(new HttpError(400, "no email found "));
    }
    if (!(await user.checkPassword(req.body.password, user.password))) {
      return next(new HttpError(400, "password isn't correct"));
    }
    const token = generateToken(user._id, user.email);
    res.cookie("jwt", token, cookiesOptions);
    user.password = undefined;
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError(400, err.errorResponse.errmsg));
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("name email image places");
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return next(new HttpError(400, "there is unexpected error"));
  }
};
