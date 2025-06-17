import express from "express";
import {
  create,
  destroy,
  getAll,
  getOne,
  update,
} from "../controllers/roomController.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/admin", verifyToken, verifyAdmin, getAll);
router.get("/admin/:id", verifyToken, verifyAdmin, getOne);
router.post("/admin", verifyToken, verifyAdmin, create);
router.put("/admin/:id", verifyToken, verifyAdmin, update);
router.delete("/admin/:id", verifyToken, verifyAdmin, destroy);

export default router;
