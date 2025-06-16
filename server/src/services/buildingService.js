import { Building } from "../models/index.js";

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
