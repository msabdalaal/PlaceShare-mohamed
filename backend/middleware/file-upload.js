import multer from "multer";
import fs from "fs";
import HttpError from "../models/http-error.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
const MulterSetting = multer({
  limits: 900000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let folderPath = "";
      if (req.url === "/signup") {
        folderPath = path.join('/tmp', "uploads", "users");
      } else {
        folderPath = path.join('/tmp', "uploads", "places");
      }
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // `recursive: true` لإنشاء المجلدات الداخلية
      }
      // تحديد مكان حفظ الملفات
      cb(null, folderPath); //عايز اعمل فولدر جوه ال uploads بأسم موجود داخل ال req.body
    },
    filename: (req, file, cb) => {
      // تخصيص اسم الملف
      const ext = file.mimetype.split("/")[1]; // استخراج امتداد الملف
      cb(null, `file-${Date.now()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new HttpError(400, "type error"), false);
    }
  },
});
export const Multer = MulterSetting.single("image");
