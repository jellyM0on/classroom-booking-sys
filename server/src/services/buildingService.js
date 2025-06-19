import { Op, col, fn, where } from "sequelize";
import { Building, Room } from "../models/index.js";

export const findAllBuildings = async (
  filters = {},
  pagination = {},
  sort = "ASC"
) => {
  const whereConditions = {};

  if (filters.search) {
    const term = filters.search.toLowerCase();
    whereConditions[Op.or] = [
      where(fn("LOWER", col("code")), { [Op.like]: `%${term}%` }),
      where(fn("LOWER", col("name")), { [Op.like]: `%${term}%` }),
    ];
  }

  console.log("Final whereConditions:", whereConditions);

  const rows = await Building.findAll({
    where: whereConditions,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [["name", sort.toUpperCase()]],
  });

  const count = await Building.count({
    where: whereConditions,
    distinct: true,
    col: "id",
  });

  return {
    count,
    rows,
  };
};

export const findBuildingByIdWithRooms = async (id) => {
  const building = await Building.findByPk(id, {
    include: {
      model: Room,
      as: "rooms",
    },
  });

  if (!building) {
    return null;
  }

  return building;
};

export const createBuilding = async (buildingData) => {
  const building = await Building.create(buildingData);
  return building;
};

export const updateBuildingById = async (id, updateData) => {
  const building = await Building.findByPk(id);
  if (!building) {
    return null;
  }

  await building.update(updateData);
  return building;
};

export const deleteBuildingById = async (id) => {
  const building = await Building.findByPk(id);

  if (!building) {
    return null;
  }

  await building.destroy();
  return building;
};
