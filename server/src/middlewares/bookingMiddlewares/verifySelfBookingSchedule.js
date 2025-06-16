import { Booking, BookingSchedule, User } from "../../models/index.js";

const verifySelfBookingSchedule = async (req, res, next) => {
  const { id: scheduleId } = req.params;
  const requestingUid = req.user?.uid;

  try {
    if (!requestingUid) {
      return res.status(401).json({ message: "Unauthorized: Missing UID" });
    }

    const user = await User.findOne({ where: { uid: requestingUid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const schedule = await BookingSchedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Booking schedule not found" });
    }

    const booking = await Booking.findByPk(schedule.booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Associated booking not found" });
    }

    if (booking.submitted_by !== user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this schedule" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default verifySelfBookingSchedule;
