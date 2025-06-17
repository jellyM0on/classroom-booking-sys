import express from "express";
import {
  create,
  getAll,
  getAllSelf,
  getById,
  updateActive,
  updateCancel,
  updatePending,
  updateStatus,
} from "../controllers/bookingController.js";
import verifySelfBooking from "../middlewares/bookingMiddlewares/verifySelfBooking.js";
import verifyBookingStatus from "../middlewares/bookingMiddlewares/verifyStatus.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, verifySelfBooking, getById);
router.get("/", verifyToken, getAllSelf);

router.post("/", verifyToken, create);
router.put(
  "/:id",
  verifyToken,
  verifySelfBooking,
  verifyBookingStatus(["draft"]),
  updatePending
);
router.put(
  "/:id/cancel",
  verifyToken,
  verifySelfBooking,
  verifyBookingStatus(["pending"]),
  updateCancel
);

router.get("/admin/all", verifyToken, verifyAdmin, getAll);
router.get(
  "/admin/:id",
  verifyToken,
  verifyAdmin,
  verifyBookingStatus(["pending", "approved", "rejected", "cancelled"]),
  getById
);
router.put(
  "/admin/:id",
  verifyToken,
  verifyAdmin,
  verifyBookingStatus(["approved"]),
  updateActive
);
router.put(
  "/admin/:id/status",
  verifyToken,
  verifyAdmin,
  verifyBookingStatus(["pending"]),
  updateStatus
);

export default router;
