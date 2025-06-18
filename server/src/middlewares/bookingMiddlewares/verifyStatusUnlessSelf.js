import { Booking, User } from "../../models/index.js";

const verifyBookingStatusUnlessSelf = (allowedStatuses = []) => {
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

      const requestingUid = req.user?.uid;

      if (!requestingUid) {
        return res.status(401).json({ message: "Unauthorized: Missing UID" });
      }

      const user = await User.findOne({ where: { uid: requestingUid } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (booking.submitted_by !== user.id) {
        if (!allowedStatuses.includes(booking.status)) {
          return res.status(403).json({
            message: `Booking must have one of the following status values: ${allowedStatuses.join(
              ", "
            )}`,
          });
        }
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

export default verifyBookingStatusUnlessSelf;
