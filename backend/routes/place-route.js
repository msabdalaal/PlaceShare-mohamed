import express from "express";
import { body } from "express-validator";
import {createPlace,getPlaceById,getPlacesByUserID,updatePlace,deletePlace} from "../controllers/places-controllers.js";
import { Multer } from "../middleware/file-upload.js";
import Check from "../middleware/check-Auth.js";
const router = express.Router();
router
  .route("/")
  .post(Check,Multer,[body("title").notEmpty(), body("description").isLength({ min: 5 }),body('address').notEmpty()],createPlace);
router.route("/:Pid").get(getPlaceById).patch(Check,updatePlace).delete(Check,deletePlace);
router.route("/user/:Uid").get(getPlacesByUserID);
export default router;
