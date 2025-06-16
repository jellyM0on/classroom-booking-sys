import { deleteBuildingById } from "../services/buildingService.js";
import { createRoom, updateRoomById } from "../services/roomService.js";
import { formatSequelizeErrors } from "../utils/formatSequelizeErrors.js";

export const create = async (req, res) => {
  try {
    const newRoom = await createRoom(req.body);
    return res.status(201).json({ newRoom });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }

    const fieldErrors = formatSequelizeErrors(error, res);
    if (fieldErrors) return;

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedRoom = await updateRoomById(id, req.body);
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.status(200).json({ updatedRoom });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    const fieldErrors = formatSequelizeErrors(error, res);
    if (fieldErrors) return;

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRoom = await deleteBuildingById(id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
