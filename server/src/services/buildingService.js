import { Building, Room } from "../models/index.js";

export const findAllBuildings = async (filters = {}, pagination = {}) => {
  const result = await Building.findAndCountAll({
    where: filters,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [["name"]],
  });

  return {
    count: result.count,
    rows: result.rows,
  };
};

export const findBuildingByIdWithRooms = async (id) => {
  const building = await Building.findByPk(id, {
    include: {
      model: Room,
      as: "rooms"
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
