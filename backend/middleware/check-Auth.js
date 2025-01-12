import jwt from "jsonwebtoken";
import HttpError from "../models/http-error.js";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

export const checkToken=async(req,res,next)=>{
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(200).json({
        status: "success",
      });
    }
    const decoded =  jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      status: "success",
      token: {
        id:decoded.id,
        email:decoded.email
      },
    });
  } catch (err) {
    if(err.message==="jwt expired"){
      return next(new HttpError(400, "Please Login again"));
    }
    console.log(err.message);
    return next(new HttpError(400, "you don't have access"));
  }
}


const Check = async (req, res, next) => {
  try {
    console.log("ddddddddddddddddddddddddddddddddddddddddd")
    console.log("token",req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
      return next(new HttpError(400, "you don't have access"));
    }
    const decoded =  jwt.verify(token, process.env.JWT_SECRET);


    req.userData = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if(err.message==="jwt expired"){
      return next(new HttpError(400, "Please Login again"));
    }
    console.log(err.message);
    return next(new HttpError(400, "you don't have access"));
  }
};
export default Check;
