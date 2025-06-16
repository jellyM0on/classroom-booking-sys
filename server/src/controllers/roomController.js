import { Op } from "sequelize";
import {
  createRoom,
  deleteRoomById,
  findAllRooms,
  findRoomByIdWithBuilding,
  updateRoomById,
} from "../services/roomService.js";
import { formatSequelizeErrors } from "../utils/formatSequelizeErrors.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, number, type, buildingId } = req.query;

    const pagination = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const filters = {};
    if (number) filters.number = { [Op.like]: `%${number}%` };
    if (type) filters.type = type;
    if (buildingId) filters.buildingId = buildingId;

    const result = await findAllRooms(filters, pagination);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    return res.status(200).json({
      data: result.rows,
      total: result.count,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const room = await findRoomByIdWithBuilding(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.status(200).json({ data: room });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

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
    const deletedRoom = await deleteRoomById(id);
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
