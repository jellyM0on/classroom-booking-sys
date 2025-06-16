import express from "express";
import authRoutes from "./authRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import userRoutes from "./userRoutes.js";
import buildingRoutes from "./buildingRoutes.js"
import roomRoutes from "./roomRoutes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/departments", departmentRoutes);
router.use("/buildings", buildingRoutes)
router.use("/rooms", roomRoutes)

export default router;
