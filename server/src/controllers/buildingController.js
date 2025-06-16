import { Op } from "sequelize";
import {
  createBuilding,
  deleteBuildingById,
  findAllBuildings,
  findBuildingByIdWithRooms,
  updateBuildingById,
} from "../services/buildingService.js";
import { formatSequelizeErrors } from "../utils/formatSequelizeErrors.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, code, name } = req.query;

    const pagination = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const filters = {};
    if (code) filters.code = { [Op.like]: `%${code}%` };
    if (name) filters.name = { [Op.like]: `%${name}%` };

    const result = await findAllBuildings(filters, pagination);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ message: "No buildings found" });
    }

    return res.status(200).json({
      data: result.rows,
      total: result.count,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const building = await findBuildingByIdWithRooms(req.params.id);
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }
    return res.status(200).json({ data: building });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const newBuilding = await createBuilding(req.body);
    return res.status(201).json({ newBuilding });
  } catch (error) {
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
    const updatedBuilding = await updateBuildingById(id, req.body);

    if (!updatedBuilding) {
      return res.status(404).json({ message: "Building not found." });
    }

    return res.status(200).json({ updatedBuilding });
  } catch (error) {
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
    const deletedBuilding = await deleteBuildingById(id);
    if (!deletedBuilding) {
      return res.status(404).json({ message: "Building not found." });
    }
    return res.status(200).json(deletedBuilding);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
