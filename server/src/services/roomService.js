import { Op } from "sequelize";
import { BookingSchedule, Building, Room } from "../models/index.js";

export const findAllRooms = async (filters = {}, pagination = {}) => {
  const rooms = await Room.findAndCountAll({
    where: filters,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [["number"]],
    include: {
      model: Building,
      as: "building",
    },
  });

  return {
    count: rooms.count,
    rows: rooms.rows,
  };
};

export const findRoomByIdWithBuilding = async (id) => {
  const room = await Room.findByPk(id, {
    include: {
      model: Building,
      as: "building",
    },
  });

  if (!room) {
    return null;
  }

  return room;
};

export const createRoom = async (roomData) => {
  const { buildingId } = roomData;

  const building = await Building.findByPk(buildingId);
  if (!building) {
    const error = new Error("Building does not exist");
    error.statusCode = 400;
    throw error;
  }

  const room = await Room.create(roomData);
  return room;
};

export const updateRoomById = async (id, updateData) => {
  const room = await Room.findByPk(id);

  if (!room) {
    return null;
  }

  if (updateData.buildingId) {
    const building = await Building.findByPk(updateData.buildingId);
    if (!building) {
      const error = new Error("Building does not exist");
      error.statusCode = 400;
      throw error;
    }
  }

  await room.update(updateData);
  return room;
};

export const deleteRoomById = async (id) => {
  const room = await Room.findByPk(id);
  if (!room) {
    return null;
  }

  const existingSchedules = await BookingSchedule.findOne({
    where: {
      room_id: id,
      status: ["active", "inactive"],
    },
  });

  if (existingSchedules) {
    const error = newError(
      "Cannot delete room with active or inactive booking schedules"
    );
    error.statusCode = 400;
    throw error;
  }

  await room.destroy();
  return room;
};

export async function findAvailableRooms({
  buildingId,
  roomTypes,
  scheduleSlots,
}) {
  const rooms = await Room.findAll({
    where: {
      buildingId,
      type: {
        [Op.in]: roomTypes,
      },
    },
  });

  if (rooms.length === 0) return [];

  const roomIds = rooms.map((r) => r.id);

  const conflictConditions = scheduleSlots.map(
    ({ date, start_time, end_time }) => ({
      date,
      status: "active",
      [Op.and]: [
        {
          start_time: {
            [Op.lt]: end_time,
          },
        },
        {
          end_time: {
            [Op.gt]: start_time,
          },
        },
      ],
    })
  );

  const conflictingSchedules = await BookingSchedule.findAll({
    where: {
      room_id: {
        [Op.in]: roomIds,
      },
      [Op.or]: conflictConditions,
    },
  });

  const conflictedRoomIds = new Set(conflictingSchedules.map((s) => s.room_id));

  return rooms.filter((room) => !conflictedRoomIds.has(room.id));
}
