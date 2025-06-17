// middlewares/verifyBookingStatus.js

import { Booking } from "../../models/index.js";

const verifyBookingStatus = (allowedStatuses = []) => {
  return async (req, res, next) => {
    const bookingId = req.params.id || req.params.bookingId;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (!allowedStatuses.includes(booking.status)) {
        return res.status(403).json({
          message: `Booking must have one of the following status values: ${allowedStatuses.join(
            ", "
          )}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
};

export default verifyBookingStatus;
