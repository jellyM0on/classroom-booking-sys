import { Op } from "sequelize";
import {
  findUserById,
  findUsers,
  updateUserById,
} from "../services/userService.js";
import { formatSequelizeErrors } from "../utils/formatSequelizeErrors.js";

export const getOne = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, departmentId, name } = req.query;

    const pagination = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    const filters = {};
    if (role) filters.role = role;
    if (departmentId) filters.departmentId = departmentId;
    if (name) filters.name = { [Op.like]: `%${name}%` };

    const result = await findUsers(filters, pagination);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      data: result.rows,
      total: result.count,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};

export const updateOne = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, department, role } = req.body;

    if (!name || !department || !role) {
      return res.status(400).json({
        message: "Name, department, and role are required.",
      });
    }

    const updatedUser = await updateUserById(userId, {
      name,
      department,
      role,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found or update failed",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    const formattedError = formatSequelizeErrors(error);
    return res.status(500).json({
      message: "Failed to update user",
      errors: formattedError,
    });
  }
};
