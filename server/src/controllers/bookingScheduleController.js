import { User } from "../models/index.js";
import {
  cancelBookingScheduleById,
  cancelFutureSchedulesByBookingId,
  findFacilitatedSchedulesByMonth,
} from "../services/bookingScheduleService.js";

export const getAllByMonth = async (req, res) => {
  try {
    const requestingUid = req.user?.uid;
    if (!requestingUid) {
      return res.status(401).json({ message: "Unauthorized: Missing UID" });
    }

    const user = await User.findOne({ where: { uid: requestingUid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { month, building_id, room_id, urgency } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        message: "Invalid or missing 'month' query. Format should be YYYY-MM.",
      });
    }

    const schedules = await findFacilitatedSchedulesByMonth(user.id, month, {
      buildingId: building_id,
      roomId: room_id,
      urgency: urgency,
    });

    return res.status(200).json({ data: schedules });
  } catch (error) {
    console.error("Error fetching schedules by month:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

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
