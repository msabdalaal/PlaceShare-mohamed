import express from "express";
import { Multer, uploadImageToCloudinary } from "../middleware/file-upload.js";
import { body } from 'express-validator';
import {signup,login,getUsers } from "../controllers/user-controllers.js"
const router=express.Router();
router.get('/',getUsers);
router.post('/signup',Multer,uploadImageToCloudinary,signup);
router.post('/login',login);
export default router;