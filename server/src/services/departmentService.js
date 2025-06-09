import { Department } from "../models/index.js";

export const findAllDepartments = async () => {
  return await Department.findAll({
    attributes: ["id", "code", "name"],
    order: [["name", "ASC"]],
  });
};

export const createDepartment = async ({ code, name }) => {
  const department = await Department.create({ code, name });
  return department;
};

export const updateDepartmentById = async (id, { code, name }) => {
  const department = await Department.findByPk(id);
  if (!department) return null;

  department.code = code;
  department.name = name;

  await department.save();
  return department;
};