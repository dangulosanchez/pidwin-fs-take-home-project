// Models
import express from "express";
import { get10LongestWinStreaks } from "../utils/winStreaks.js";

const router = express.Router();
router.get("/", get10LongestWinStreaks);


export default router;