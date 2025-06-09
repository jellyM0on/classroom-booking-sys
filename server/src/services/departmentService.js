import { Department } from "../models/index.js";

export const findAllDepartments = async () => {
  return await Department.findAll({
    attributes: ["id", "code", "name"],
    order: [["name", "ASC"]],
  });
};
