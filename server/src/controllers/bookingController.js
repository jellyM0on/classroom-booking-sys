import { User } from "../models/index.js";
import {
  createBookingWithSchedules,
  findAllBookingsWithSchedulesAndRooms,
  findBookingByIdWithSchedulesAndRooms,
  findSelfBookingsWithSchedulesAndRooms,
  updateActiveBookingWithSchedules,
  updateBookingStatus,
  updateBookingStatusToCancelled,
  updateBookingStatusToPending,
  updatePendingBookingWithSchedules,
} from "../services/bookingService.js";
import { formatSequelizeErrors } from "../utils/formatSequelizeErrors.js";

export const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      urgency,
      reviewed_by,
      submitted_by,
      facilitated_by,
      date,
      room_id,
    } = req.query;

    const pagination = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const bookingFilters = {};
    if (status) bookingFilters.status = status;
    if (urgency) bookingFilters.urgency = urgency;
    if (reviewed_by) bookingFilters.reviewed_by = reviewed_by;
    if (submitted_by) bookingFilters.submitted_by = submitted_by;
    if (facilitated_by) bookingFilters.facilitated_by = facilitated_by;

    const scheduleFilters = {};
    if (date) scheduleFilters.date = date;
    if (room_id) scheduleFilters.room_id = room_id;

    const userFilters = {
      submittedBy: submitted_by ? { id: submitted_by } : null,
      facilitatedBy: facilitated_by ? { id: facilitated_by } : null,
      reviewedBy: reviewed_by ? { id: reviewed_by } : null,
    };

    const requestingUid = req.user?.uid;

    const currentUser = await User.findOne({ where: { uid: requestingUid } });
    if (!currentUser) {
      return res.status(403).json({ message: "User not found" });
    }

    const result = await findAllBookingsWithSchedulesAndRooms(
      {
        bookingFilters,
        scheduleFilters,
        userFilters,
        currentUserId: currentUser.id,
      },
      pagination
    );

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    const actualCount = result.rows.length;

    return res.status(200).json({
      data: result.rows,
      total: actualCount,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(actualCount / pagination.limit),
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllSelf = async (req, res) => {
  try {
    const requestingUid = req.user?.uid;

    if (!requestingUid) {
      return res.status(401).json({ message: "Unauthorized: Missing UID" });
    }

    const user = await User.findOne({
      where: { uid: requestingUid },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { page = 1, limit = 10, status, urgency, date, room_id } = req.query;

    const pagination = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const bookingFilters = {};
    if (status) bookingFilters.status = status;
    if (urgency) bookingFilters.urgency = urgency;

    const scheduleFilters = {};
    if (date) scheduleFilters.date = date;
    if (room_id) scheduleFilters.room_id = room_id;

    const result = await findSelfBookingsWithSchedulesAndRooms(
      user.id,
      { bookingFilters, scheduleFilters },
      pagination
    );

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({
      data: result.rows,
      total: result.count,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    console.error("Error fetching user’s bookings:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await findBookingByIdWithSchedulesAndRooms(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const requestingUid = req.user?.uid;

    const currentUser = await User.findOne({ where: { uid: requestingUid } });
    if (!currentUser) {
      return res.status(403).json({ message: "User not found" });
    }

    const newBooking = await createBookingWithSchedules({
      ...req.body,
      submitted_by: currentUser.id,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    const fieldErrors = formatSequelizeErrors(error, res);
    if (fieldErrors) return;

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updatePending = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBooking = await updatePendingBookingWithSchedules(
      id,
      req.body
    );

    return res.status(200).json({
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 404) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    const handled = formatSequelizeErrors(error, res);
    if (handled) return;

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateActive = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBooking = await updateActiveBookingWithSchedules(id, req.body);

    return res.status(200).json({
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 404) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    const handled = formatSequelizeErrors(error, res);
    if (handled) return;

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateCancel = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBooking = await updateBookingStatusToCancelled(id);

    return res.status(200).json({
      message: "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (error) {
    if (error.statusCode === 404 || error.statusCode === 400) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateToPending = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBooking = await updateBookingStatusToPending(id);

    return res.status(200).json({
      message: "Booking submitted successfully",
      data: updatedBooking,
    });
  } catch (error) {
    if (error.statusCode === 404 || error.statusCode === 400) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedBooking = await updateBookingStatus(id, status, req.user?.uid);

    return res.status(200).json({
      message: `Booking status updated to "${status}"`,
      data: updatedBooking,
    });
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 404) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
