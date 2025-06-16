import express from "express";
import authRoutes from "./authRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import bookingScheduleRoutes from "./bookingSchedulesRoutes.js";
import buildingRoutes from "./buildingRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import roomRoutes from "./roomRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/departments", departmentRoutes);
router.use("/buildings", buildingRoutes);
router.use("/rooms", roomRoutes);
router.use("/bookings", bookingRoutes);
router.use("/schedules", bookingScheduleRoutes);

export default router;
