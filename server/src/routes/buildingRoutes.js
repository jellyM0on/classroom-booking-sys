import express from "express";
import {
  create,
  destroy,
  getAll,
  getOne,
  update,
} from "../controllers/buildingController.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/admin", verifyToken, getAll);
router.get("/admin/:id", verifyToken, getOne);
router.post("/admin", verifyToken, verifyAdmin, create);
router.put("/admin/:id", verifyToken, verifyAdmin, update);
router.delete("/admin/:id", verifyToken, verifyAdmin, destroy);

export default router;
