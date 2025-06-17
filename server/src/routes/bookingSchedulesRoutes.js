import express from "express";
import {
  cancelScheduleById,
  cancelSchedulesByBookingId,
  getAllByMonth,
} from "../controllers/bookingScheduleController.js";
import verifySelfBookingSchedule from "../middlewares/bookingMiddlewares/verifySelfBookingSchedule.js";
import verifyBookingStatus from "../middlewares/bookingMiddlewares/verifyStatus.js";
import verifyStatusFromSchedule from "../middlewares/bookingMiddlewares/verifyStatusFromSchedule.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/facilitated", verifyToken, getAllByMonth);
router.patch(
  "/:id/cancel",
  verifyToken,
  verifySelfBookingSchedule,
  verifyStatusFromSchedule(["active"]),
  cancelScheduleById
);
router.patch(
  "/:bookingId/cancel-future",
  verifyToken,
  verifySelfBookingSchedule,
  verifyBookingStatus(["active"]),
  cancelSchedulesByBookingId
);

router.patch(
  "/admin/:id/cancel",
  verifyToken,
  verifyAdmin,
  verifyStatusFromSchedule(["active"]),
  cancelScheduleById
);
router.patch(
  "/admin/:bookingId/cancel-future",
  verifyToken,
  verifyAdmin,
  verifyBookingStatus(["active"]),
  cancelSchedulesByBookingId
);

export default router;
