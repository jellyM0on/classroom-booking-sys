import express from "express";
import {
  create,
  updateActive,
  updateCancel,
  updatePending,
  updateStatus,
} from "../controllers/bookingController.js";
import verifyBookingStatus from "../middlewares/bookingMiddlewares/verifyStatus.js";
import verifySelfBooking from "../middlewares/bookingMiddlewares/verifySelfBooking.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.put(
  "/:id",
  verifyToken,
  verifySelfBooking,
  verifyBookingStatus(["pending"]),
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
