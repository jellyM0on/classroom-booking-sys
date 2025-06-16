import {
  cancelBookingScheduleById,
  cancelFutureSchedulesByBookingId,
} from "../services/bookingScheduleService.js";

export const cancelScheduleById = async (req, res) => {
  const { id } = req.params;

  try {
    const cancelled = await cancelBookingScheduleById(id);

    return res.status(200).json({
      message: "Booking schedule cancelled",
      data: cancelled,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const cancelSchedulesByBookingId = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const result = await cancelFutureSchedulesByBookingId(bookingId);

    return res.status(200).json({
      message: `Cancelled ${result.affectedRows} future booking schedule(s)`,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};
