import express from "express";
import { create, getAll, update } from "../controllers/departmentController.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/admin", verifyToken, verifyAdmin, getAll);
router.put("/admin/:id", verifyToken, verifyAdmin, update);
router.post("/admin", verifyToken, verifyAdmin, create);

export default router;
