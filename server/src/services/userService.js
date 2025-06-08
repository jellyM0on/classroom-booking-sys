import dayjs from "dayjs";
import { Department, User } from "../models/index.js";

const userAttributes = {
  exclude: ["uid", "departmentId"],
};

const departmentAttributes = ["code"];

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

export { findUserById, findUsers };
