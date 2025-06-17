import { Booking, User } from "../../models/index.js";

const verifySelfBooking = async (req, res, next) => {
  const { id: bookingId } = req.params;
  const requestingUid = req.user?.uid;

  try {
    if (!requestingUid) {
      return res.status(401).json({ message: "Unauthorized: Missing UID" });
    }

    const user = await User.findOne({ where: { uid: requestingUid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.submitted_by !== user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this booking" });
    }
    
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default verifySelfBooking;
