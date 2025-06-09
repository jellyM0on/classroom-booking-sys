import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";

const Department = sequelize.define(
  "Department",
  {
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [1, 10],
          msg: "Code must be between 1 and 10 characters long",
        },
      },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: {
          args: [1, 200],
          msg: "Name must be between 1 and 200 characters long",
        },
      },
    },
  },
  {
    timestamps: true,
    tableName: "departments",
  }
);

export default Department;
