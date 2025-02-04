import multer from "multer";
import cloudinary from "cloudinary";
import HttpError from "../models/http-error.js";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRECT_KEY,
});
const storage = new multer.memoryStorage();
const upload = multer({storage});
export const Multer=upload.single("image");

export const uploadImageToCloudinary = async (req, res, next) => {
  try{
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    let Fpath="";
    if (req.url === "/signup") {
      Fpath="PLACE-SHARE/user_images"
    }else{
      Fpath="PLACE-SHARE/place_images"
    }
    const res=await cloudinary.v2.uploader.upload(dataURI,{
      resource_type: "auto",
      folder: Fpath,
      allowed_formats: ["jpg", "png", "jpeg"]
    })
    req.body.image=res.secure_url;
    req.body.imagePublicId=res.public_id;
    next();
  }catch (err){
    console.log(err);
    return next(new HttpError(400, "No"));
  }
}
