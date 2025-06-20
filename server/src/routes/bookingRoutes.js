import express from "express";
import {
  create,
  deleteBooking,
  getAll,
  getAllSelf,
  getById,
  updateActive,
  updateCancel,
  updatePending,
  updateStatus,
  updateToPending,
} from "../controllers/bookingController.js";
import verifyFacilitatedBooking from "../middlewares/bookingMiddlewares/verifyFacilitatedBooking.js";
import verifySelfBooking from "../middlewares/bookingMiddlewares/verifySelfBooking.js";
import verifyBookingStatus from "../middlewares/bookingMiddlewares/verifyStatus.js";
import verifyBookingStatusUnlessSelf from "../middlewares/bookingMiddlewares/verifyStatusUnlessSelf.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, verifyFacilitatedBooking, getById);
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
router.put(
  "/:id/submit",
  verifyToken,
  verifySelfBooking,
  verifyBookingStatus(["draft"]),
  updateToPending
);

router.get("/admin/all", verifyToken, verifyAdmin, getAll);
router.get(
  "/admin/:id",
  verifyToken,
  verifyAdmin,
  verifyBookingStatusUnlessSelf([
    "pending",
    "approved",
    "rejected",
    "cancelled",
  ]),
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

router.delete(
  "/:id",
  verifyToken,
  verifySelfBooking,
  verifyBookingStatus(["draft"]),
  deleteBooking
);

export default router;
