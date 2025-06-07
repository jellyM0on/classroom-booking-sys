import User from "../models/UserModel.js";

const findUserById = async (id) => {
  return await User.findOne({ where: { id } });
};

const findUsers = async (filters = {}, pagination = {}) => {
  return await User.findAndCountAll({
    where: filters,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [["createdAt", "DESC"]],
  });
};

export { findUserById, findUsers };
