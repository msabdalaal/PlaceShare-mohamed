import express from "express";
import { checkToken,deleteToken } from "../middleware/check-Auth.js";
const checkTokenRouter = express.Router();

checkTokenRouter.get(checkToken);
checkTokenRouter.delete(deleteToken);
export default checkTokenRouter;