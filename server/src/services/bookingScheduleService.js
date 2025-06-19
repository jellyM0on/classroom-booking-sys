import { Op } from "sequelize";
import { Booking, BookingSchedule, Building, Room } from "../models/index.js";

export const findFacilitatedSchedulesByMonth = async (
  facilitatorId,
  month,
  filters = {}
) => {
  const [year, monthNumber] = month.split("-").map(Number);
  const startDate = `${month}-01`;
  const lastDay = new Date(year, monthNumber, 0).getDate();
  const endDate = `${month}-${lastDay.toString().padStart(2, "0")}`;

  const roomWhere = {};
  if (filters.roomId) roomWhere.id = filters.roomId;
  if (filters.buildingId) roomWhere.buildingId = filters.buildingId;

  const bookingWhere = {
    status: "approved",
    facilitated_by: facilitatorId,
  };
  if (filters.urgency) bookingWhere.urgency = filters.urgency;

  const schedules = await BookingSchedule.findAll({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [
      ["date", "ASC"],
      ["start_time", "ASC"],
    ],
    include: [
      {
        model: Booking,
        as: "booking",
        where: bookingWhere,
        required: true,
        attributes: ["id", "status", "purpose", "urgency", "createdAt"],
      },
      {
        model: Room,
        as: "room",
        where: roomWhere,
        attributes: ["id", "number", "type", "buildingId"],
        include: [
          {
            model: Building,
            as: "building",
            attributes: ["code", "name", "address"],
          },
        ],
      },
    ],
  });

  return schedules;
};

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
