import express from "express";
import { getAll } from "../controllers/departmentController.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/admin", verifyToken, verifyAdmin, getAll);

export default router;
