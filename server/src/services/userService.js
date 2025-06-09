import dayjs from "dayjs";
import { auth } from "../configs/firebase.js";
import { Department, User } from "../models/index.js";

const userAttributes = {
  exclude: ["uid", "departmentId"],
};

const departmentAttributes = ["code", "id", "name"];

const formatUser = (userInstance) => {
  const user = userInstance.toJSON();
  user.createdAt = dayjs(user.createdAt).format("YYYY-MM-DD");
  user.updatedAt = dayjs(user.updatedAt).format("YYYY-MM-DD");
  return user;
};

const findUserById = async (id) => {
  const user = await User.findOne({
    where: { id },
    attributes: userAttributes,
    include: {
      model: Department,
      as: "department",
      attributes: departmentAttributes,
    },
  });

  return user ? formatUser(user) : null;
};

const findUsers = async (filters = {}, pagination = {}) => {
  const result = await User.findAndCountAll({
    where: filters,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [["name"]],
    attributes: userAttributes,
    include: {
      model: Department,
      as: "department",
      attributes: departmentAttributes,
    },
  });

  return {
    count: result.count,
    rows: result.rows.map(formatUser),
  };
};

const updateUserById = async (id, { name, department, role }) => {
  const user = await User.findOne({ where: { id } });
  if (!user) return null;

  const roleChanged = role && user.role !== role;

  user.name = name;
  user.role = role;
  user.departmentId = department;

  await user.save();

  if (roleChanged) {
    await auth.setCustomUserClaims(user.uid, { role });
  }

  const updatedUser = await User.findOne({
    where: { id },
    attributes: userAttributes,
    include: {
      model: Department,
      as: "department",
      attributes: departmentAttributes,
    },
  });

  return updatedUser ? formatUser(updatedUser) : null;
};

export { findUserById, findUsers, updateUserById };
