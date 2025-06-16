import { Op } from "sequelize";
import { BookingSchedule } from "../models/index.js";

export const cancelBookingScheduleById = async (id) => {
  const schedule = await BookingSchedule.findByPk(id);

  if (!schedule) {
    const error = new Error("Booking schedule not found");
    error.statusCode = 404;
    throw error;
  }

  if (schedule.status === "cancelled") {
    const error = new Error("Booking schedule is already cancelled");
    error.statusCode = 400;
    throw error;
  }

  const today = new Date().toISOString().split("T")[0];
  if (schedule.start_date < today) {
    const error = new Error("Cannot cancel a schedule that has already passed");
    error.statusCode = 400;
    throw error;
  }

  schedule.status = "cancelled";
  await schedule.save();

  return schedule;
};

export const cancelFutureSchedulesByBookingId = async (bookingId) => {
  const today = new Date().toISOString().split("T")[0];

  const updated = await BookingSchedule.update(
    { status: "cancelled" },
    {
      where: {
        booking_id: bookingId,
        start_date: { [Op.gte]: today },
        status: { [Op.ne]: "cancelled" },
      },
    }
  );

  return {
    affectedRows: updated[0],
  };
};
