import {
  createBuilding,
  deleteBuildingById,
  updateBuildingById,
} from "../services/buildingService.js";
import { formatSequelizeErrors } from "../utils/formatSequelizeErrors.js";

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
