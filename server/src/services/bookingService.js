import { Op } from "sequelize";
import { sequelize } from "../configs/sequelize.js";
import { Booking, BookingSchedule, Room, User } from "../models/index.js";

export const createBookingWithSchedules = async (bookingData) => {
  const { bookingSchedules, ...bookingFields } = bookingData;

  if (!Array.isArray(bookingSchedules) || bookingSchedules.length === 0) {
    const error = new Error("At least one booking schedule is required");
    error.statusCode = 400;
    throw error;
  }

  const booking = Booking.build(bookingFields);
  await booking.validate();

  for (const schedule of bookingSchedules) {
    const room = await Room.findByPk(schedule.room_id);
    if (!room) {
      const error = new Error(
        `Room with ID ${schedule.room_id} does not exist`
      );
      error.statusCode = 400;
      throw error;
    }
    const scheduleInstance = BookingSchedule.build(schedule);
    await scheduleInstance.validate({
      skip: ["booking_id"],
    });
  }

  const savedBooking = await Booking.create(bookingFields);

  for (const schedule of bookingSchedules) {
    await BookingSchedule.create({
      ...schedule,
      booking_id: savedBooking.id,
    });
  }

  return await Booking.findByPk(savedBooking.id, {
    include: {
      model: BookingSchedule,
      as: "schedules",
    },
  });
};

export const updatePendingBookingWithSchedules = async (id, updateData) => {
  const { bookingSchedules, ...bookingFields } = updateData;

  const booking = await Booking.findByPk(id, {
    include: { model: BookingSchedule, as: "schedules" },
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (!Array.isArray(bookingSchedules) || bookingSchedules.length === 0) {
    const error = new Error("At least one booking schedule is required");
    error.statusCode = 400;
    throw error;
  }

  booking.set(bookingFields);
  await booking.validate();

  for (const schedule of bookingSchedules) {
    const room = await Room.findByPk(schedule.room_id);
    if (!room) {
      const error = new Error(
        `Room with ID ${schedule.room_id} does not exist`
      );
      error.statusCode = 400;
      throw error;
    }

    const scheduleInstance = BookingSchedule.build({
      ...schedule,
      booking_id: booking.id,
    });

    await scheduleInstance.validate();
  }

  return await sequelize.transaction(async (t) => {
    await booking.update(bookingFields, { transaction: t });

    await BookingSchedule.destroy({
      where: { booking_id: booking.id },
      transaction: t,
    });

    for (const schedule of bookingSchedules) {
      await BookingSchedule.create(
        {
          ...schedule,
          booking_id: booking.id,
        },
        { transaction: t }
      );
    }

    return await Booking.findByPk(booking.id, {
      include: { model: BookingSchedule, as: "schedules" },
      transaction: t,
    });
  });
};

export const updateActiveBookingWithSchedules = async (id, updateData) => {
  const { bookingSchedules, ...bookingFields } = updateData;

  const booking = await Booking.findByPk(id, {
    include: { model: BookingSchedule, as: "schedules" },
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status !== "pending") {
    const error = new Error("Only pending bookings can be updated");
    error.statusCode = 403;
    throw error;
  }

  if (!Array.isArray(bookingSchedules) || bookingSchedules.length === 0) {
    const error = new Error("At least one booking schedule is required");
    error.statusCode = 400;
    throw error;
  }

  booking.set(bookingFields);
  await booking.validate();

  for (const schedule of bookingSchedules) {
    const room = await Room.findByPk(schedule.room_id);
    if (!room) {
      const error = new Error(
        `Room with ID ${schedule.room_id} does not exist`
      );
      error.statusCode = 400;
      throw error;
    }

    const instance = BookingSchedule.build({
      ...schedule,
      booking_id: booking.id,
    });
    await instance.validate();
  }

  return await sequelize.transaction(async (t) => {
    await booking.update(bookingFields, { transaction: t });

    const today = new Date().toISOString().split("T")[0];

    await BookingSchedule.destroy({
      where: {
        booking_id: booking.id,
        start_date: { [Op.gte]: today },
      },
      transaction: t,
    });

    for (const schedule of bookingSchedules) {
      await BookingSchedule.create(
        {
          ...schedule,
          booking_id: booking.id,
        },
        { transaction: t }
      );
    }

    return await Booking.findByPk(booking.id, {
      include: { model: BookingSchedule, as: "schedules" },
      transaction: t,
    });
  });
};

export const updateBookingStatusToCancelled = async (id) => {
  const booking = await Booking.findByPk(id);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status === "cancelled") {
    const error = new Error("Booking is already cancelled");
    error.statusCode = 400;
    throw error;
  }

  booking.status = "cancelled";
  await booking.save();

  return booking;
};

const VALID_STATUSES = ["approved", "rejected", "cancelled"];

export const updateBookingStatus = async (id, newStatus, requestingUid) => {
  if (!VALID_STATUSES.includes(newStatus)) {
    const error = new Error(
      `Invalid status: must be one of ${VALID_STATUSES.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findByPk(id);
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status === newStatus) {
    const error = new Error(`Booking is already ${newStatus}`);
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { uid: requestingUid } });
  if (!user) {
    const error = new Error("Authenticated user not found");
    error.statusCode = 401;
    throw error;
  }

  booking.status = newStatus;
  booking.reviewed_at = new Date();
  booking.reviewed_by = user.id;

  await booking.save();

  return booking;
};
