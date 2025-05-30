import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";

const Department = sequelize.define(
  "Department",
  {
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "departments",
  }
);

export default Department;
