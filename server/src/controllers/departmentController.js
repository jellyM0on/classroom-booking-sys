import {
  createDepartment,
  findAllDepartments,
  updateDepartmentById,
} from "../services/departmentService.js";

export const getAll = async (req, res) => {
  try {
    const departments = await findAllDepartments();

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    return res.status(200).json({ data: departments });
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const create = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: "Code and name are required." });
    }

    const newDept = await createDepartment({ code, name });
    return res.status(201).json(newDept);
  } catch (error) {
    console.error("Failed to create department:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        errors: error.errors.map((e) => ({ path: e.path, message: e.message })),
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: "Code and name are required." });
    }

    const updated = await updateDepartmentById(id, { code, name });

    if (!updated) {
      return res.status(404).json({ message: "Department not found." });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Failed to update department:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        errors: error.errors.map((e) => ({ path: e.path, message: e.message })),
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
