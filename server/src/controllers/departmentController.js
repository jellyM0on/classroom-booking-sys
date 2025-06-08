import { findAllDepartments } from "../services/departmentService.js";

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
