import express from "express";
import { getAll, getOne, updateOne } from "../controllers/userController.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifySelf from "../middlewares/verifySelf.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/admin/:id", verifyToken, verifyAdmin, getOne);
router.get("/admin", verifyToken, verifyAdmin, getAll);
router.put("/admin/:id", verifyToken, verifyAdmin, updateOne);

router.get("/:id", verifyToken, verifySelf, getOne);

export default router;
