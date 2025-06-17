import { Op } from "sequelize";
import BookingSchedule from "../models/BookingScheduleModel.js";

export const isRoomAvailable = async (roomId, date, startTime, endTime) => {
  const conflicts = await BookingSchedule.findAll({
    where: {
      room_id: roomId,
      start_date: date,
      status: {
        [Op.in]: ["active"],
      },
      [Op.or]: [
        {
          start_time: {
            [Op.between]: [startTime, endTime],
          },
        },
        {
          end_time: {
            [Op.between]: [startTime, endTime],
          },
        },
        {
          [Op.and]: [
            { start_time: { [Op.lte]: startTime } },
            { end_time: { [Op.gte]: endTime } },
          ],
        },
      ],
    },
  });

  return conflicts.length === 0;
};
