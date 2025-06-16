import {
  createBookingWithSchedules,
  updateActiveBookingWithSchedules,
  updateBookingStatus,
  updateBookingStatusToCancelled,
  updatePendingBookingWithSchedules,
} from "../services/bookingService.js";
import { formatSequelizeErrors } from "../utils/formatSequelizeErrors.js";

export const create = async (req, res) => {
  try {
    const newBooking = await createBookingWithSchedules(req.body);

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

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedBooking = await updateBookingStatus(id, status);

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
