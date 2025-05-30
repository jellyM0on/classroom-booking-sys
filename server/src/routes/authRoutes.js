import express from "express";
import { register } from "../controllers/authController.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", verifyToken, verifyAdmin, register);

export default router;
