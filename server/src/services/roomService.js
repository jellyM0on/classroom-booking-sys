import { BookingSchedule, Building, Room } from "../models/index.js";

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
