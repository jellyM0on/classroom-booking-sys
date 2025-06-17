import { Booking, BookingSchedule } from "../../models/index.js";

const verifyStatusFromSchedule = (allowedStatuses = []) => {
  return async (req, res, next) => {
    const scheduleId = req.params.id || req.params.scheduleId;

    if (!scheduleId) {
      return res
        .status(400)
        .json({ message: "Booking schedule ID is required" });
    }

    try {
      const schedule = await BookingSchedule.findByPk(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: "Booking schedule not found" });
      }

      const booking = await Booking.findByPk(schedule.booking_id);
      if (!booking) {
        return res
          .status(404)
          .json({ message: "Associated booking not found" });
      }

      if (!allowedStatuses.includes(booking.status)) {
        return res.status(403).json({
          message: `Associated booking must have one of the following status values: ${allowedStatuses.join(
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

export default verifyStatusFromSchedule;
